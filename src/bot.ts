import Discord, { Message, User } from 'discord.js';
import ytdl from 'ytdl-core'; 
import 'dotenv/config';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

let ready = true;
let filaMusicas: string[] = [];
let arrayMessages: Message[] = [];

const bot = new Discord.Client();
bot.login(process.env.token);
bot.once('ready', () => {
    bot.user?.setActivity("!ajuda");
    console.log(`Bot online: ${bot.user?.tag}`)
})

function handleYoutube(msg: Message, check = false) {
    
    const link = msg.content.split(' ')[1];
    
    if (link === "next") {
        handleNextMusic(msg);
        return;
    }
    
    arrayMessages.push(msg);

    if (filaMusicas.length > 0 && !ready){
        filaMusicas.push(link);
    } else { 
        { !check && filaMusicas.push(link) }    
            if (msg.member?.voice.channel) {
                ready = false;
                const connection = msg.member.voice.channel;

                connection.join().then(connection => {
                    console.log(filaMusicas);
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

    function handleNextMusic(msg: Message) {
        const aux: Message[] = [];

        if (msg.member?.voice.channel){
            if (msg.member?.voice.channel?.members.map(guildMember => guildMember.user.username === 'Botzera')){
                const connection = msg.member.voice.channel;
                connection.join().then(connection => {
                connection.dispatcher._destroy;
            })
            }  
        }

        arrayMessages.shift();
        arrayMessages.map(musica => aux.push(musica));
        arrayMessages = [];
        filaMusicas = [];
        ready = true
        
        aux.map(comando => handleYoutube(comando));
        
        }

function playSound(msg: Message){
    const file = msg.content.split(' ')[1];
    if (msg.member?.voice.channel) {
        const connection = msg.member.voice.channel;

        connection.join().then(connection => {
            const dispatcher = connection.play(`./assets/${file}.mp3`);
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
    var fs = require('fs');
    var files = fs.readdirSync("./assets");

    var array: string[] = [];

    array = files.map((item: string) => {
        var nomes = item.split(".")[0];
        return(nomes);
    })

    return array;
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

    // Ajuda
    if (msg.content === "!ajuda") {
        const array: string[] = memes();
        msg.channel.send("```" + `!meme <> ${array.map(meme => `\n\t${meme}`)}\n\t\n!stop\n!sortear\n!tafalandomerdaz\n!covid\n!youtube <link>` + "```")
    }

    // Memes áudio
    if(msg.content.startsWith('!meme')){
        playSound(msg); 
    }

    // Parar bot
    if (msg.content === "!stop") {
        if (msg.member?.voice.channel){
            if (msg.member?.voice.channel?.members.map(guildMember => guildMember.user.username === 'Botzera')){
                const connection = msg.member.voice.channel;
                connection.join().then(connection => {
                ready = true
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
            "method":"GET",
            "url":"https://covid-19-data.p.rapidapi.com/country",
            "headers":{
            "content-type":"application/octet-stream",
            "x-rapidapi-host":"covid-19-data.p.rapidapi.com",
            "x-rapidapi-key":"022dee71f7mshde4f2a7030ec299p1fbe32jsncc5f22d16bf5",
            "useQueryString":true
            },"params":{
            "format":"json",
            "name":"brazil"
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
});




















