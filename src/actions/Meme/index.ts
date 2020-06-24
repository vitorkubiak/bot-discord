import { Message } from 'discord.js';
import path from 'path';

import MemeRepository from '../../repositories/MemeRepository';
import IMeme from './IMeme';

class Meme implements IMeme {
  private memeRepository: MemeRepository;
  private msg: Message;

  constructor(message: Message) {
    this.memeRepository = new MemeRepository();
    this.msg = message;
  }

  private playSound(): void | Message {
    const file = this.msg.content.split(' ')[1];

    if (this.msg.member?.voice.channel) {
      const connection = this.msg.member.voice.channel;

      connection.join().then(connection => {
        const dispatcher = connection.play(
          path.resolve('src', 'assets', 'sounds', `${file}.mp3`),
        );
        dispatcher.setVolume(0.3);
        dispatcher.on('finish', () => {
          connection.disconnect();
        });
      });
    } else {
      this.msg.reply('Você precisa estar em um canal!');
    }
  }

  public getMeme(meme: string): Message | void | Promise<Message> {
    if (this.memeRepository.checkMemeExist(meme)) {
      return this.playSound();
    }

    return this.msg.reply('esse meme não existe gurizão');
  }
}

export default Meme;
