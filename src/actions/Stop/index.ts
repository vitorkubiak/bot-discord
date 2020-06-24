import { Message } from 'discord.js';

class Stop {
  private msg: Message;

  constructor(message: Message) {
    this.msg = message;
  }

  public stop() {
    if (this.msg.member?.voice.channel) {
      if (
        this.msg.member?.voice.channel?.members.map(
          guildMember => guildMember.user.username === 'Botzera',
        )
      ) {
        const connection = this.msg.member.voice.channel;
        connection.join().then(connection => {
          connection.disconnect();
        });
      }
    }
  }
}

export default Stop;
