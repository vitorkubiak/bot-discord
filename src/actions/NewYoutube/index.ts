import { Queue, Job, DoneCallback } from 'bull';
import Ytdl from 'ytdl-core';
import Youtube, { Video } from 'discord-youtube-api';
import Ylist from 'youtube-playlist';
import VideoQueue from '../../config/queue';
import PlayListDTO from './dtos/PlayListDTO';

class NewYoutube {
    private videoQueue: Queue;
    private youtubeApi: Youtube;

    constructor() {
        this.youtubeApi = new Youtube(process.env.apiyoutube || '');
        this.videoQueue = VideoQueue;
    }

    private isUrl(input: string): boolean {
        return Ytdl.validateURL(input);
    }

    private async getUrl(input: string): Promise<string> {
        const video = await this.youtubeApi.searchVideos(input);
        return `https://www.youtube.com/watch?v=${video.id}`;
    }

    public async getCount() {
        console.log(await this.videoQueue.count());
    }

    private isPlaylist(link: string) {
        return link.length > 50;
    }

    public async playMusic(input: string) {
        if (this.isUrl(input)) {
            if (this.isPlaylist(input)) {
                // adicionar todas as musicas dentro da fila
                await Ylist(input, 'url').then((response: PlayListDTO) => {
                    return response.data.playlist.map((musicUrl: string) => {
                        this.videoQueue.add(musicUrl);
                    });
                });
                return;
            }
            // adicionar link dentro da fila
            return this.videoQueue.add(input);
        }
        // return getUrl(input); pegar a url e adicionar na fila
        return this.videoQueue.add(await this.getUrl(input))
    }

}

export default NewYoutube;