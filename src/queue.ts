import { Guild } from 'discord.js';
import { Job, DoneCallback } from 'bull';
import Queue from './config/queue';
import Bot from './config/bot';
import ytdl from 'ytdl-core';

const bot = new Bot().create();

let botReady = false;

bot.once('ready', async () => {
  botReady = true;
});

interface JobData {
  guildId: string;
  requesterId: string;
}

Queue.process('video transcoding', async (job: Job, done: DoneCallback) => {
  console.log(`Job executando: ${job.id} com o link ${job.data.link}`);
  if (!botReady) {
    console.log('Bot ainda não está pronto');
    return;
  }
  const { guildId, requesterId }: JobData = job.data;
  const guild = bot.guilds.resolve(guildId);
  const guildMember = await guild?.members.fetch(requesterId);

  if (!guildMember) return;

  guildMember?.voice.channel?.join().then(connection => {
    const dispatcher = connection.play(
      ytdl(job.data.link, { filter: 'audioonly' }),
    );
    dispatcher.setVolume(1);
    dispatcher.on('finish', () => {
      dispatcher.destroy;
      done();
      console.log(`Job ${job.id} finalizou`);
    });
    dispatcher.on('close', () => {
      dispatcher.destroy;
      done();
      console.log(`Job ${job.id} finalizou`);
    });
  });
});
