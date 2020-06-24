import Discord from 'discord.js';

class Bot {
  constructor() {}

  public create() {
    const bot = new Discord.Client();
    bot.login(process.env.token);
    bot.once('ready', () => {
      bot.user?.setActivity('!ajuda');
      console.log(`Bot online: ${bot.user?.tag}`);
    });

    return bot;
  }
}

export default Bot;
