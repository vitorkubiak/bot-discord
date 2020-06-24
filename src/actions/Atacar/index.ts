import { Message, User, Client } from 'discord.js';

import UserRepository from '../../repositories/UserRepository';

class Atacar {
  private msg: Message;
  private userRepository: UserRepository;

  constructor(message: Message, bot: Client) {
    this.msg = message;
    this.userRepository = new UserRepository(bot);
  }

  public async atacar() {
    const splittedMessage = this.msg.content.split(' ');
    if (splittedMessage.length === 3) {
      const memberId = splittedMessage[1]
        .replace('<', '')
        .replace('>', '')
        .replace('@', '')
        .replace('!', '');
      const message = splittedMessage[2];
      this.userRepository.getUser(memberId).then((user: User) => {
        console.log(
          `O bot começara uma metralhadora de ${message} para o usuário ${user.username}`,
        );
        for (var i = 0; i < 100; i++) {
          setTimeout(
            () => this.userRepository.sendMessage(user, message),
            1000,
          );
        }
        console.log(`O bot assasinou ${user.username}`);
      });
    }
  }
}

export default Atacar;
