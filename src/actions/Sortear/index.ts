import { Message, User, Client } from 'discord.js';

import UserRepository from '../../repositories/UserRepository';

class Sortear {
  private msg: Message;
  private userRepository: UserRepository;

  constructor(message: Message, bot: Client) {
    this.msg = message;
    this.userRepository = new UserRepository(bot);
  }

  public sortear() {
    const members = this.msg.member?.voice.channel?.members.map(
      guildMember =>
        guildMember.user.username !== 'Botzera' && guildMember.user.id,
    );
    if (members) {
      const choosedMember = members[Math.floor(Math.random() * members.length)];
      this.msg.channel.send(
        `Se fodeu <@${choosedMember}>, tu foi o escolhido!`,
      );
    }
  }
}

export default Sortear;
