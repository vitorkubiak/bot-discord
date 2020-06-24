import { Message } from 'discord.js';
import axios from 'axios';

class Joke {
  private msg: Message;
  constructor(message: Message) {
    this.msg = message;
  }

  public async getJoke(): Promise<void | Message> {
    return axios
      .get('https://official-joke-api.appspot.com/random_joke')
      .then(response => {
        this.msg.channel.send(response.data.setup);
        setTimeout(() => this.msg.channel.send(response.data.punchline), 5000);
      });
  }
}

export default Joke;
