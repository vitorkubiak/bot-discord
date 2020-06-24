import fs from 'fs';
import path from 'path';

class MemeRepository {
  public getMemes() {
    let files = fs.readdirSync(path.resolve('src', 'assets', 'sounds'));

    let stringMemes: string[] = [];

    files.forEach((item: string) => {
      let nomes = item.split('.')[0];
      stringMemes.push(nomes);
    });

    return stringMemes;
  }

  public checkMemeExist(requestMeme: string): boolean {
    return !!this.getMemes().find(meme => meme === requestMeme);
  }
}

export default MemeRepository;
