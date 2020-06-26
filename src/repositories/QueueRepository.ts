import { Message } from 'discord.js';

interface Input {
  link: string;
  msg: Message;
}

interface QueueData {
  input: Input;
  working: boolean;
}

class QueueRepository {
  private queue: QueueData[] = [];

  constructor() {}

  public add(input: Input) {
    console.log('Conteúdo adicionado na fila.');

    return this.queue.push({ input, working: false });
  }

  public remove() {
    console.log('Conteúdo removido da fila.');
    this.queue.shift();
  }

  public firstIsWorking() {
    if (this.queue.length > 0) {
      if (this.queue[0].working == true) {
        return true;
      }
    }
    return false;
  }

  public list() {
    return this.queue;
  }

  public first() {
    return this.queue[0];
  }

  public removeAll() {
    return this.queue.splice(0, this.queue.length - 1);
  }
}

export default QueueRepository;
