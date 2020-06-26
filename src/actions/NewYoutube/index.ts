import { Message } from 'discord.js';
import Ytdl from 'ytdl-core';
import Youtube from 'discord-youtube-api';
import Ylist from 'youtube-playlist';
import PlayListDTO from './dtos/PlayListDTO';
import QueueRepository from '../../repositories/QueueRepository';
import youtube from 'discord-youtube-api';
import ytdl from 'ytdl-core';
import ylist from 'youtube-playlist';

class NewYoutube {
  private youtubeApi: Youtube;
  private queue: QueueRepository;

  constructor() {
    this.youtubeApi = new Youtube(process.env.apiyoutube || '');
    this.queue = new QueueRepository();
  }

  private isUrl(input: string): boolean {
    return Ytdl.validateURL(input);
  }

  public async skipMusic(msg: Message) {
    if (this.queue.list().length === 0) return;
    const connection = msg.member?.voice.channel;
    connection?.join().then(connection => {
      connection.disconnect();
    });
  }

  private handleAddMusic(msg: Message, link: string) {
    this.queue.add({ msg, link });
    return this.handleNextMusic(msg);
  }

  private handleRemoveMusic(msg: Message) {
    this.queue.remove();
    return this.handleNextMusic(msg);
  }

  private handleNextMusic(msg: Message) {
    if (!this.queue.firstIsWorking()) {
      if (this.queue.first()) {
        this.queue.first().working = true;
        return this.handleMusic(msg);
      }
    }
  }

  public handleList() {
    return this.queue.list();
  }

  private handleMusic(msg: Message) {
    if (msg.member?.voice.channel) {
      const connection = msg.member.voice.channel;

      connection.join().then(connection => {
        const dispatcher = connection.play(
          ytdl(this.queue.first().input.link, { filter: 'audioonly' }),
        );
        dispatcher.setVolume(0.3);
        dispatcher.on('finish', () => {
          dispatcher.destroy;
          this.handleRemoveMusic(msg);

          if (!this.queue.first()) {
            connection.disconnect();
          }
        });

        dispatcher.on('close', () => {
          dispatcher.destroy;
          this.handleRemoveMusic(msg);

          if (!this.queue.first()) {
            connection.disconnect();
          }
        });
      });
    } else {
      msg.reply('Você precisa estar em um canal!');
    }
  }

  private async getUrl(input: string): Promise<string> {
    const video = await this.youtubeApi.searchVideos(input);
    return `https://www.youtube.com/watch?v=${video.id}`;
  }

  public removeAllMusics() {
    return this.queue.removeAll();
  }

  private isPlaylist(link: string) {
    return link.length > 50;
  }

  public async playMusic(msg: Message, input: string) {
    if (this.isUrl(input)) {
      if (this.isPlaylist(input)) {
        // adicionar todas as musicas dentro da fila
        await Ylist(input, 'url').then((response: PlayListDTO) => {
          return response.data.playlist.map((musicUrl: string) => {
            this.handleAddMusic(msg, musicUrl);
          });
        });
        return;
      }

      return this.handleAddMusic(msg, input);
    }
    // return getUrl(input); pegar a url e adicionar na fila
    this.getUrl(input)
      .then(link => {
        return this.handleAddMusic(msg, link);
      })
      .catch(err => {
        return msg.reply(
          `a busca por uma música no youtube não tá funfando não gurizão: ${err}`,
        );
      });
  }
}

export default NewYoutube;
