import { User, Client } from 'discord.js';

class UserRepository {
  private bot: Client;
  constructor(bot: Client) {
    this.bot = bot;
  }
  async getUser(userId: string): Promise<User> {
    const user = await this.bot.users.fetch(userId);
    return user;
  }

  async sendMessage(user: User, message: string) {
    return user.send(message);
  }
}

export default UserRepository;
