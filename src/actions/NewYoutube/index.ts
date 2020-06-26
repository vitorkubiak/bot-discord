import { Message } from 'discord.js';
import Ytdl from 'ytdl-core';
import { Job } from 'bull';
import Youtube, { Video } from 'discord-youtube-api';
import Ylist from 'youtube-playlist';
import videoQueue from '../../config/queue';
import PlayListDTO from './dtos/PlayListDTO';

class NewYoutube {
  private youtubeApi: Youtube;

  constructor() {
    this.youtubeApi = new Youtube(process.env.apiyoutube || '');
  }

  private isUrl(input: string): boolean {
    return Ytdl.validateURL(input);
  }

  public async nextVideo(msg: Message) {
    const connection = msg.member?.voice.channel;
    connection?.join().then(connection => {
      connection.disconnect();
    });
  }

  public clearQueue() {
    return videoQueue.empty();
  }

  private async getUrl(input: string): Promise<string> {
    const video = await this.youtubeApi.searchVideos(input);
    return `https://www.youtube.com/watch?v=${video.id}`;
  }

  public async getQueueList(msg: Message) {
    msg.reply(`A fila tem ${await videoQueue.count()} vídeos pela frente`);

    const jobs: Job[] = await videoQueue.getJobs(['waiting']);

    if (jobs.length === 0) {
      return msg.reply('Nada na fila.');
    }

    const youtubeTitles: string[] = [];

    jobs.forEach(async job => {
      // const video = await this.youtubeApi.getVideo(
      //   'https://www.youtube.com/watch?v=5NPBIwQyPWE',
      // );
      return youtubeTitles.push(`${job.data.link}\n`);
    });

    return msg.channel.send(youtubeTitles);
  }

  private isPlaylist(link: string) {
    return link.length > 50;
  }

  public async playMusic(msg: Message, input: string) {
    if (!msg.member?.voice.channel)
      return msg.reply('Você precisa estar em um canal!');

    if (this.isUrl(input)) {
      if (this.isPlaylist(input)) {
        // adicionar todas as musicas dentro da fila
        await Ylist(input, 'url').then((response: PlayListDTO) => {
          return response.data.playlist.map((musicUrl: string) => {
            return videoQueue.add('video transcoding', {
              link: musicUrl,
              guildId: msg.guild?.id,
              requesterId: msg.author.id,
            });
          });
        });
        return;
      }
      // adicionar link dentro da fila
      // return videoQueue.add('video transcoding', {
      //   message: msg,
      //   link: input,
      // });
      return videoQueue.add('video transcoding', {
        link: input,
        guildId: msg.guild?.id,
        requesterId: msg.author.id,
      });
    }
    // return getUrl(input); pegar a url e adicionar na fila
    this.getUrl(input)
      .then(link => {
        return videoQueue.add('video transcoding', {
          link,
          guildId: msg.guild?.id,
          requesterId: msg.author.id,
        });
      })
      .catch(err => {
        return msg.reply(
          `a busca por uma música no youtube não tá funfando não gurizão: ${err}`,
        );
      });
  }
}

export default NewYoutube;
