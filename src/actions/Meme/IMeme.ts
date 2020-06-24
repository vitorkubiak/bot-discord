import { Message } from 'discord.js';

export default interface IMeme {
  getMeme(meme: string): Message | void | Promise<Message>;
}
