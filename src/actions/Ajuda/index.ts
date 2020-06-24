import { Message } from 'discord.js';
import fs from 'fs';
import path from 'path';
import csvParse from 'csv-parse';

import IAjuda from './IAjuda';
import MemeRepository from '../../repositories/MemeRepository';

class Ajuda implements IAjuda {
  private msg: Message;
  private memeRepository: MemeRepository;

  constructor(message: Message) {
    this.msg = message;
    this.memeRepository = new MemeRepository();
  }

  public async importCommands(): Promise<void> {
    const readCSV = fs.createReadStream(
      path.resolve('src', 'assets', 'commands.csv'),
    );

    const parseStream = csvParse({
      from_line: 1,
    });

    const parseCSV = readCSV.pipe(parseStream);

    let stringCommands: string = '';

    parseCSV.on('data', async line => {
      const [command] = line.map((palavra: string) => palavra.trim());

      stringCommands += `\n${command}`;
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    let stringMemes = '';
    this.memeRepository.getMemes().map(meme => (stringMemes += `\n\t${meme}`));
    this.msg.channel.send(
      '```' + `!meme <> ${stringMemes}\n\t ${stringCommands}` + '```',
    );
  }
}

export default Ajuda;
