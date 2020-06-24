import { Message } from 'discord.js';
import youtube from 'discord-youtube-api';
import ytdl from 'ytdl-core';
import ylist from 'youtube-playlist';

class Youtube {
  //   private ready = true;
  private filaMusicas: string[] = [];
  private arrayMessages: Message[] = [];
  private apiyoutube: string | undefined = process.env.apiyoutube;
  private youtubeApi = new youtube(this.apiyoutube ? this.apiyoutube : '');

  constructor() {}

  async getMusic(msg: Message, check = false): Promise<any> {
    const splitYoutube = msg.content.split(' ');

    const link = splitYoutube[1];

    if (
      !ytdl.validateURL(link) &&
      !this.arrayMessages.includes(msg) &&
      'next' !== link
    ) {
      const nomeVideo = splitYoutube.filter(
        (palavra: string) => palavra !== '!youtube',
      );

      const stringVideo = nomeVideo.join(' ');

      const video = await this.youtubeApi.searchVideos(stringVideo);

      const linkVideo = 'https://www.youtube.com/watch?v=' + video.id;

      this.filaMusicas.push(linkVideo);

      msg.reply(linkVideo);

      // if (!this.ready) {
      //     return;
      // }
    }

    if (link.length > 50 && !this.arrayMessages.includes(msg)) {
      const linkPlaylist = msg.content.split(' ')[1];
      let links: string[] = [];

      interface Playlist {
        response: object;
        data: {
          playlist: string[];
        };
      }

      await ylist(linkPlaylist, 'url').then((response: Playlist) => {
        //links = response.data.playlist
        response.data.playlist.map(
          (musica: string) =>
            (this.filaMusicas = [...this.filaMusicas, musica]),
        );
      });
      console.log(this.filaMusicas);
    }

    if (link === 'next') {
      this.filaMusicas.shift();
      var currentMusic = this.filaMusicas[0];
      currentMusic = currentMusic.split('=')[1];
      msg.channel.send(
        'Próxima música: https://www.youtube.com/watch?v=' + currentMusic,
      );
      if (this.filaMusicas.length === 0) {
        if (msg.member?.voice.channel) {
          if (
            msg.member?.voice.channel?.members.map(
              guildMember => guildMember.user.username === 'Botzera',
            )
          ) {
            const connection = msg.member.voice.channel;
            connection.join().then(connection => {
              // ready = true
              this.arrayMessages = [];
              this.filaMusicas = [];
              connection.disconnect();
            });
          }
        }
      }
      {
        this.arrayMessages.length > 1 && this.arrayMessages.shift();
      }
      // this.ready = true;
      // handleNextMusic(msg);

      return this.getMusic(this.arrayMessages[0]);
    }

    this.arrayMessages.push(msg);

    if (this.filaMusicas.length > 0 && ytdl.validateURL(link)) {
      this.filaMusicas.push(link);
    } else {
      {
        ytdl.validateURL(link) &&
          link.length < 50 &&
          !check &&
          this.filaMusicas.push(link);
      }
      if (msg.member?.voice.channel) {
        // ready = false;
        const connection = msg.member.voice.channel;

        connection.join().then(connection => {
          const dispatcher = connection.play(
            ytdl(this.filaMusicas[0], { filter: 'audioonly' }),
          );
          dispatcher.setVolume(0.3);
          dispatcher.on('finish', () => {
            this.filaMusicas.shift();
            this.arrayMessages.shift();
            // ready = true
            dispatcher.destroy;
            this.getMusic(msg, true);
          });
        });
      } else {
        msg.reply('Você precisa estar em um canal!');
      }
    }
  }
}

export default Youtube;
