import Discord, { Message, User, ErrorEvent, DMChannel } from 'discord.js';
import ytdl from 'ytdl-core';
import csvParse from 'csv-parse';
import fs from 'fs';
import 'dotenv/config';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import youtube from 'discord-youtube-api';
import ylist from 'youtube-playlist';
import AssistantV2 from 'ibm-watson/assistant/v2';
import { IamAuthenticator } from 'ibm-watson/auth';

var apiyoutube: string | undefined = process.env.apiyoutube;
var apiibm: string | undefined = process.env.apiibm;
var urlapiibm: string | undefined = process.env.urlapiibm;
var apicovid: string | undefined = process.env.apicovid;
var assistantidibm: string | undefined = process.env.assistantidibm;

var apiIbmSession: string | undefined;
// https://api.us-east.assistant.watson.cloud.ibm.com
let ready = true;
let filaMusicas: string[] = [];
let arrayMessages: Message[] = [];
const youtubeApi = new youtube(apiyoutube ? apiyoutube : "");

let assistant: null | AssistantV2 = null;
const bot = new Discord.Client();
bot.login(process.env.token);
bot.once('ready', () => {
    bot.user?.setActivity("!ajuda");
    console.log(`Bot online: ${bot.user?.tag}`)
    assistant = new AssistantV2({
        version: '2020-04-01',
        authenticator: new IamAuthenticator({
            apikey: (apiibm ? apiibm : ""),
        }),
        url: urlapiibm,
    });
    assistant.createSession({
        assistantId: (assistantidibm ? assistantidibm : "")
      }) 
        .then(res => {
          console.log('Watson is alive!')
          apiIbmSession = res.result.session_id;
        })
        .catch(err => {
          console.log(err);
        });
})

async function handleYoutube(msg: Message, check = false): Promise<any> {

    const splitYoutube = msg.content.split(' ');

    const link = splitYoutube[1];

    if (!ytdl.validateURL(link) && !arrayMessages.includes(msg) && 'next' !== link) {

        const nomeVideo = splitYoutube.filter((palavra: string) => palavra !== '!youtube');

        const stringVideo = nomeVideo.join(" ");

        const video = await youtubeApi.searchVideos(stringVideo);

        const linkVideo = 'https://www.youtube.com/watch?v=' + video.id;

        filaMusicas.push(linkVideo)

        msg.reply(linkVideo);

        if (!ready) {
            return;
        }
    }

    if (link.length > 50 && !arrayMessages.includes(msg)) {
        const linkPlaylist = msg.content.split(' ')[1];
        let links: string[] = [];

        interface Playlist {
            response: object;
            data: {
                playlist: string[];
            };
        }

        await ylist(linkPlaylist, 'url').then((response: Playlist) => {
            //links = response.data.playlist
            response.data.playlist.map((musica: string) =>
                filaMusicas = [...filaMusicas, musica]
            )
        });
        console.log(filaMusicas);
    }

    if (link === "next") {
        filaMusicas.shift();
        if(filaMusicas.length === 0){
            if (msg.member?.voice.channel) {
                if (msg.member?.voice.channel?.members.map(guildMember => guildMember.user.username === 'Botzera')) {
                    const connection = msg.member.voice.channel;
                    connection.join().then(connection => {
                        ready = true
                        arrayMessages = [];
                        filaMusicas = [];
                        connection.disconnect();
                    })
                }
            }
        }
        { arrayMessages.length > 1 && arrayMessages.shift() };
        ready = true;
        // handleNextMusic(msg);

        return (handleYoutube(arrayMessages[0]));
    }

    arrayMessages.push(msg);

    if (filaMusicas.length > 0 && !ready && ytdl.validateURL(link)) {

        filaMusicas.push(link);
    } else {
        { ytdl.validateURL(link) && link.length < 50 && !check && filaMusicas.push(link) }
        if (msg.member?.voice.channel) {
            ready = false;
            const connection = msg.member.voice.channel;

            connection.join().then(connection => {

                const dispatcher = connection.play(ytdl(filaMusicas[0], { filter: "audioonly" }));
                dispatcher.setVolume(0.3);
                dispatcher.on('finish', () => {
                    filaMusicas.shift();
                    arrayMessages.shift();
                    ready = true
                    dispatcher.destroy;
                    handleYoutube(msg, true);
                })
            });
        } else {
            msg.reply('Você precisa estar em um canal!');
        }
    }
}

async function getYoutubePlaylist(msg: Message, link: string) {
    let message: Message;
    message = msg;

}

async function importCommands(): Promise<string> {
    const readCSV = fs.createReadStream('./assets/commands.csv');
    const parseStream = csvParse({
        from_line: 1,
    });

    const parseCSV = readCSV.pipe(parseStream);

    let stringCommands: string = '';

    parseCSV.on('data', async line => {
        const [command] = line.map((palavra: string) =>
            palavra.trim(),
        );

        stringCommands += `\n${command}`;
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    return stringCommands;
}

function playSound(msg: Message) {
    const file = msg.content.split(' ')[1];

    if (msg.member?.voice.channel) {
        const connection = msg.member.voice.channel;

        connection.join().then(connection => {
            const dispatcher = connection.play(`./assets/sounds/${file}.mp3`);
            dispatcher.setVolume(0.3);
            dispatcher.on('finish', () => {
                connection.disconnect();
            })
        });
    } else {
        msg.reply('Você precisa estar em um canal!');
    }
}

function memes(): string[] {
    var files = fs.readdirSync("./assets/sounds");

    var stringMemes: string[] = [];

    files.forEach((item: string) => {
        var nomes = item.split(".")[0];
        stringMemes.push(nomes)
    })

    return stringMemes;
}

function formatNumber(number: number) {
    return new Intl.NumberFormat('pt-BR', { maximumSignificantDigits: 3 }).format(number)
}

async function getUser(userId: string) {
    const user = await bot.users.fetch(userId);
    return user;
}

async function sendMessage(user: User, message: string) {
    return user.send(message);
}

bot.on('message', msg => {
    try {

        if (msg.content === `<@!${bot.user?.id}>`) {
            msg.reply('que tu quer o retardado')
        }
        // Ajuda
        if (msg.content === "!ajuda") {
            importCommands().then(response => {
                let stringMemes = '';
                memes().map(meme => stringMemes += `\n\t${meme}`);
                msg.channel.send("```" + `!meme <> ${stringMemes}\n\t ${response}` + "```")
            });
        }

        // Memes áudio
        if (msg.content.startsWith('!meme')) {
            const splittedMessage = msg.content.split(' ')[1];

            if (memes().find(meme => meme === splittedMessage)) {
                playSound(msg);
            }
        }

        // Parar bot
        if (msg.content === "!stop") {
            if (msg.member?.voice.channel) {
                if (msg.member?.voice.channel?.members.map(guildMember => guildMember.user.username === 'Botzera')) {
                    const connection = msg.member.voice.channel;
                    connection.join().then(connection => {
                        ready = true
                        arrayMessages = [];
                        filaMusicas = [];
                        connection.disconnect();
                    })
                }
            }
        }

        // Ta falando merda
        if (msg.content === '!tafalandomerda') {
            msg.reply('Nãnãnãnãão, tá falando merda!')
        }

        // Youtube Play
        if (msg.content.startsWith('!youtube')) {
            handleYoutube(msg);
        }

        // Sortear
        if (msg.content === '!sortear') {

            const members = msg.member?.voice.channel?.members.map(guildMember => guildMember.user.username !== 'Botzera' && guildMember.user.id);
            if (members) {
                const choosedMember = members[Math.floor(Math.random() * members.length)];
                msg.channel.send(`Se fodeu <@${choosedMember}>, tu foi o escolhido!`);
            }
        }

        // Atacar
        if (msg.content.startsWith("!atacar")) {
            const splittedMessage = msg.content.split(' ');
            if (splittedMessage.length === 3) {
                const memberId = splittedMessage[1].replace('<', '').replace('>', '').replace('@', '').replace('!', '');
                const message = splittedMessage[2];
                const vitim = getUser(memberId);
                vitim.then((user: User) => {
                    console.log(`O bot começara uma metralhadora de ${message} para o usuário ${user.username}`)
                    for (var i = 0; i < 100; i++) {
                        setTimeout(() => sendMessage(user, message), 1000);
                    }
                    console.log(`O bot assasinou ${user.username}`)
                })
            }
        }

        // Joke
        if (msg.content === "!joke") {
            axios.get('https://official-joke-api.appspot.com/random_joke').then(response => {
                msg.channel.send(response.data.setup)
                setTimeout(() => msg.channel.send(response.data.punchline), 5000)
            })
        }

        // Covid
        if (msg.content.startsWith('!covid')) {
            axios({
                "method": "GET",
                "url": "https://covid-19-data.p.rapidapi.com/country",
                "headers": {
                    "content-type": "application/octet-stream",
                    "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
                    "x-rapidapi-key": apicovid,
                    "useQueryString": true
                }, "params": {
                    "format": "json",
                    "name": "brazil"
                }
            })
                .then(response => {
                    const { confirmed, recovered, critical, deaths, lastUpdate } = response.data[0];
                    msg.channel.send(`
                    **Dados do COVID no Brasil:**\n
                    **Confirmados:** ${formatNumber(confirmed)}\n
                    **Recuperados:** ${formatNumber(recovered)}\n
                    **Críticos:** ${formatNumber(critical)}\n
                    **Mortes:** ${formatNumber(deaths)}\n
                    **Última atualização:** ${format(parseISO(lastUpdate), "dd/MM/yyyy 'às' hh:mm:ss a")}
                `)
                }).catch(err => {
                    msg.channel.send(`Erro: ${err}`)
                });
        }

        // Ladrão
        if (msg.content === "!ladrao") {
            msg.channel.send(`<@448617496472322058> é mt ladrão mano, não da pra aguentar um cara desses`)
        }

        // Watson
        if (msg.channel.type === "dm") {
            if (msg.author.id === bot.user?.id) return;
            if (!assistant) return;
            if (!apiIbmSession) return;
            // "1419de93-b881-4086-9480-00e6727304ef"
            assistant.message({
                assistantId: (assistantidibm ? assistantidibm : ""),
                sessionId: apiIbmSession,
                input: {
                  message_type: 'text',
                  text: msg.content,
                  } 
                })
                .then(res => { 
                  // console.log(JSON.stringify(res.result, null, 2));
                  const responseArray = res.result?.output.generic || [];
                  if (responseArray.length > 0) {
                      msg.reply(responseArray[0].text);   
                  }
                }) 
                .catch(err => { 
                  console.log(err); 
                }); 
        }  

        if (msg.content === "!nao consigo") {
            msg.reply("Não desista gurizão, tenta de novo e meta ficha")
        }

    } catch (err) {
        msg.reply('Rolou um erro gurizao, tenta de novo e meta ficha')
        fs.appendFile("./log.csv", `Um novo erro ocorreu piazada:\nData: ${new Date()}\nConteúdo: ${err}\n\n`, () => { });
    }

});













