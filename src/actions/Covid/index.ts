import { Message } from 'discord.js';
import axios from 'axios';
import { format, parseISO } from 'date-fns';

import formatNumber from '../../services/formatNumber';

class Covid {
  private msg: Message;
  private apicovid: string | undefined = process.env.apicovid;

  constructor(message: Message) {
    this.msg = message;
  }

  public async getData() {
    axios({
      method: 'GET',
      url: 'https://covid-19-data.p.rapidapi.com/country',
      headers: {
        'content-type': 'application/octet-stream',
        'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
        'x-rapidapi-key': this.apicovid,
        useQueryString: true,
      },
      params: {
        format: 'json',
        name: 'brazil',
      },
    })
      .then(response => {
        const {
          confirmed,
          recovered,
          critical,
          deaths,
          lastUpdate,
        } = response.data[0];
        this.msg.channel.send(`
                        **Dados do COVID no Brasil:**\n
                        **Confirmados:** ${formatNumber(confirmed)}\n
                        **Recuperados:** ${formatNumber(recovered)}\n
                        **Críticos:** ${formatNumber(critical)}\n
                        **Mortes:** ${formatNumber(deaths)}\n
                        **Última atualização:** ${format(
                          parseISO(lastUpdate),
                          "dd/MM/yyyy 'às' hh:mm:ss a",
                        )}
                    `);
      })
      .catch(err => {
        this.msg.channel.send(`Erro: ${err}`);
      });
  }
}

export default Covid;
