import { Message, Client } from 'discord.js';
import AssistantV2 from 'ibm-watson/assistant/v2';
import { IamAuthenticator } from 'ibm-watson/auth';

class Watson {
  private msg: Message;
  private bot: Client;
  private assistant: null | AssistantV2 = null;
  private assistantidibm: string | undefined = process.env.assistantidibm;
  private apiibm: string | undefined = process.env.apiibm;
  private urlapiibm: string | undefined = process.env.urlapiibm;

  constructor(message: Message, bot: Client) {
    this.msg = message;
    this.bot = bot;
    this.assistant = new AssistantV2({
      version: '2020-04-01',
      authenticator: new IamAuthenticator({
        apikey: this.apiibm ? this.apiibm : '',
      }),
      url: this.urlapiibm,
    });
  }

  public async sendMessage() {
    if (this.msg.author.id === this.bot.user?.id) return;
    if (!this.assistant) return;
    //   if (!apiIbmSession) return;
    this.assistant
      .messageStateless({
        assistantId: this.assistantidibm ? this.assistantidibm : '',
        input: {
          message_type: 'text',
          text: this.msg.content,
        },
      })
      .then(res => {
        // console.log(JSON.stringify(res.result, null, 2));
        const responseArray = res.result?.output.generic || [];
        if (responseArray.length > 0) {
          this.msg.reply(responseArray[0].text);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
}

export default Watson;
