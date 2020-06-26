import 'dotenv/config';
import Bot from './config/bot';

import Ajuda from './actions/Ajuda';
import Meme from './actions/Meme';
import Stop from './actions/Stop';
import Sortear from './actions/Sortear';
import Joke from './actions/Joke';
import Covid from './actions/Covid';
import Watson from './actions/Watson';
import Youtube from './actions/Youtube';
import NewYoutube from './actions/NewYoutube';
import Atacar from './actions/Atacar';

const bot = new Bot().create();

const youtube = new Youtube();
const newYoutube = new NewYoutube();

bot.on('message', async msg => {
  try {
    // Marcar o bot
    if (msg.content === `<@!${bot.user?.id}>`) {
      return msg.reply('que tu quer o retardado');
    }

    // Ajuda
    if (msg.content === '!ajuda') {
      const ajuda = new Ajuda(msg);
      return ajuda.importCommands();
    }

    // Memes áudio
    if (msg.content.startsWith('!meme')) {
      const splittedMessage = msg.content.split(' ')[1];
      const meme = new Meme(msg);
      return meme.getMeme(splittedMessage);
    }

    // Parar bot
    if (msg.content === '!stop') {
      const stop = new Stop(msg);
      youtube.ready = true;
      newYoutube.removeAllMusics();
      return stop.stop();
    }

    // Ta falando merda
    if (msg.content === '!tafalandomerda') {
      return msg.reply('Nãnãnãnãão, tá falando merda!');
    }

    // Youtube Play
    if (msg.content.startsWith('!youtube')) {
      return youtube.getMusic(msg);
    }

    if (msg.content === '!yt next') {
      return newYoutube.skipMusic(msg);
    }

    if (msg.content === '!yt fila') {
      return newYoutube.handleList().forEach(music => {
        msg.reply(music.input.link);
      });
    }

    if (msg.content.startsWith('!yt')) {
      const input = msg.content
        .split(' ')
        .filter(i => i !== '!yt')
        .join(' ');
      return newYoutube.playMusic(msg, input);
    }

    // Sortear
    if (msg.content === '!sortear') {
      const sortear = new Sortear(msg, bot);
      return sortear.sortear();
    }

    // Joke
    if (msg.content === '!joke') {
      const joke = new Joke(msg);
      return joke.getJoke();
    }

    // Covid
    if (msg.content.startsWith('!covid')) {
      const covid = new Covid(msg);
      return covid.getData();
    }

    // Ladrão
    if (msg.content === '!ladrao') {
      return msg.channel.send(
        `<@448617496472322058> é mt ladrão mano, não da pra aguentar um cara desses`,
      );
    }

    // Watson
    if (msg.channel.type === 'dm') {
      const watson = new Watson(msg, bot);
      return watson.sendMessage();
    }

    // nao consigo
    if (msg.content === '!nao consigo') {
      return msg.reply('Não desista gurizão, tenta de novo e meta ficha');
    }

    // Atacar
    if (msg.content.startsWith('!atacar')) {
      const atacar = new Atacar(msg, bot);
      return atacar.atacar();
    }
  } catch (err) {
    console.log(err);
    return msg.reply('Rolou um erro gurizao, tenta de novo e meta ficha');
  }
});
