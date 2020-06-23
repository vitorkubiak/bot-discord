"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = __importDefault(require("discord.js"));
var ytdl_core_1 = __importDefault(require("ytdl-core"));
var csv_parse_1 = __importDefault(require("csv-parse"));
var fs_1 = __importDefault(require("fs"));
require("dotenv/config");
var axios_1 = __importDefault(require("axios"));
var date_fns_1 = require("date-fns");
var discord_youtube_api_1 = __importDefault(require("discord-youtube-api"));
var youtube_playlist_1 = __importDefault(require("youtube-playlist"));
var v2_1 = __importDefault(require("ibm-watson/assistant/v2"));
var auth_1 = require("ibm-watson/auth");
var path_1 = __importDefault(require("path"));
var apiyoutube = process.env.apiyoutube;
var apiibm = process.env.apiibm;
var urlapiibm = process.env.urlapiibm;
var apicovid = process.env.apicovid;
var assistantidibm = process.env.assistantidibm;
var apiIbmSession;
// https://api.us-east.assistant.watson.cloud.ibm.com
var ready = true;
var filaMusicas = [];
var arrayMessages = [];
var youtubeApi = new discord_youtube_api_1.default(apiyoutube ? apiyoutube : "");
var assistant = null;
var bot = new discord_js_1.default.Client();
bot.login(process.env.token);
bot.once('ready', function () {
    var _a, _b;
    (_a = bot.user) === null || _a === void 0 ? void 0 : _a.setActivity("!ajuda");
    console.log("Bot online: " + ((_b = bot.user) === null || _b === void 0 ? void 0 : _b.tag));
    assistant = new v2_1.default({
        version: '2020-04-01',
        authenticator: new auth_1.IamAuthenticator({
            apikey: (apiibm ? apiibm : ""),
        }),
        url: urlapiibm,
    });
    assistant.createSession({
        assistantId: (assistantidibm ? assistantidibm : "")
    })
        .then(function (res) {
        console.log('Watson is alive!');
        apiIbmSession = res.result.session_id;
    })
        .catch(function (err) {
        console.log(err);
    });
});
function handleYoutube(msg, check) {
    var _a, _b, _c, _d;
    if (check === void 0) { check = false; }
    return __awaiter(this, void 0, void 0, function () {
        var splitYoutube, link, nomeVideo, stringVideo, video, linkVideo, linkPlaylist, links, currentMusic, connection, connection;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    splitYoutube = msg.content.split(' ');
                    link = splitYoutube[1];
                    if (!(!ytdl_core_1.default.validateURL(link) && !arrayMessages.includes(msg) && 'next' !== link)) return [3 /*break*/, 2];
                    nomeVideo = splitYoutube.filter(function (palavra) { return palavra !== '!youtube'; });
                    stringVideo = nomeVideo.join(" ");
                    return [4 /*yield*/, youtubeApi.searchVideos(stringVideo)];
                case 1:
                    video = _e.sent();
                    linkVideo = 'https://www.youtube.com/watch?v=' + video.id;
                    filaMusicas.push(linkVideo);
                    msg.reply(linkVideo);
                    if (!ready) {
                        return [2 /*return*/];
                    }
                    _e.label = 2;
                case 2:
                    if (!(link.length > 50 && !arrayMessages.includes(msg))) return [3 /*break*/, 4];
                    linkPlaylist = msg.content.split(' ')[1];
                    links = [];
                    return [4 /*yield*/, youtube_playlist_1.default(linkPlaylist, 'url').then(function (response) {
                            //links = response.data.playlist
                            response.data.playlist.map(function (musica) {
                                return filaMusicas = __spreadArrays(filaMusicas, [musica]);
                            });
                        })];
                case 3:
                    _e.sent();
                    console.log(filaMusicas);
                    _e.label = 4;
                case 4:
                    if (link === "next") {
                        filaMusicas.shift();
                        currentMusic = filaMusicas[0];
                        currentMusic = currentMusic.split("=")[1];
                        msg.channel.send('Próxima música: https://www.youtube.com/watch?v=' + currentMusic);
                        if (filaMusicas.length === 0) {
                            if ((_a = msg.member) === null || _a === void 0 ? void 0 : _a.voice.channel) {
                                if ((_c = (_b = msg.member) === null || _b === void 0 ? void 0 : _b.voice.channel) === null || _c === void 0 ? void 0 : _c.members.map(function (guildMember) { return guildMember.user.username === 'Botzera'; })) {
                                    connection = msg.member.voice.channel;
                                    connection.join().then(function (connection) {
                                        ready = true;
                                        arrayMessages = [];
                                        filaMusicas = [];
                                        connection.disconnect();
                                    });
                                }
                            }
                        }
                        {
                            arrayMessages.length > 1 && arrayMessages.shift();
                        }
                        ;
                        ready = true;
                        // handleNextMusic(msg);
                        return [2 /*return*/, (handleYoutube(arrayMessages[0]))];
                    }
                    arrayMessages.push(msg);
                    if (filaMusicas.length > 0 && !ready && ytdl_core_1.default.validateURL(link)) {
                        filaMusicas.push(link);
                    }
                    else {
                        {
                            ytdl_core_1.default.validateURL(link) && link.length < 50 && !check && filaMusicas.push(link);
                        }
                        if ((_d = msg.member) === null || _d === void 0 ? void 0 : _d.voice.channel) {
                            ready = false;
                            connection = msg.member.voice.channel;
                            connection.join().then(function (connection) {
                                var dispatcher = connection.play(ytdl_core_1.default(filaMusicas[0], { filter: "audioonly" }));
                                dispatcher.setVolume(0.3);
                                dispatcher.on('finish', function () {
                                    filaMusicas.shift();
                                    arrayMessages.shift();
                                    ready = true;
                                    dispatcher.destroy;
                                    handleYoutube(msg, true);
                                });
                            });
                        }
                        else {
                            msg.reply('Você precisa estar em um canal!');
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getYoutubePlaylist(msg, link) {
    return __awaiter(this, void 0, void 0, function () {
        var message;
        return __generator(this, function (_a) {
            message = msg;
            return [2 /*return*/];
        });
    });
}
function importCommands() {
    return __awaiter(this, void 0, void 0, function () {
        var readCSV, parseStream, parseCSV, stringCommands;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    readCSV = fs_1.default.createReadStream(path_1.default.resolve("src", "assets", "commands.csv"));
                    parseStream = csv_parse_1.default({
                        from_line: 1,
                    });
                    parseCSV = readCSV.pipe(parseStream);
                    stringCommands = '';
                    parseCSV.on('data', function (line) { return __awaiter(_this, void 0, void 0, function () {
                        var command;
                        return __generator(this, function (_a) {
                            command = line.map(function (palavra) {
                                return palavra.trim();
                            })[0];
                            stringCommands += "\n" + command;
                            return [2 /*return*/];
                        });
                    }); });
                    return [4 /*yield*/, new Promise(function (resolve) { return parseCSV.on('end', resolve); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, stringCommands];
            }
        });
    });
}
function playSound(msg) {
    var _a;
    var file = msg.content.split(' ')[1];
    if ((_a = msg.member) === null || _a === void 0 ? void 0 : _a.voice.channel) {
        var connection = msg.member.voice.channel;
        connection.join().then(function (connection) {
            var dispatcher = connection.play(path_1.default.resolve("src", "assets", "sounds", file + ".mp3"));
            dispatcher.setVolume(0.3);
            dispatcher.on('finish', function () {
                connection.disconnect();
            });
        });
    }
    else {
        msg.reply('Você precisa estar em um canal!');
    }
}
function memes() {
    var files = fs_1.default.readdirSync(path_1.default.resolve("src", "assets", "sounds"));
    var stringMemes = [];
    files.forEach(function (item) {
        var nomes = item.split(".")[0];
        stringMemes.push(nomes);
    });
    return stringMemes;
}
function formatNumber(number) {
    return new Intl.NumberFormat('pt-BR', { maximumSignificantDigits: 3 }).format(number);
}
function getUser(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bot.users.fetch(userId)];
                case 1:
                    user = _a.sent();
                    return [2 /*return*/, user];
            }
        });
    });
}
function sendMessage(user, message) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, user.send(message)];
        });
    });
}
bot.on('message', function (msg) {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        if (msg.content === "<@!" + ((_a = bot.user) === null || _a === void 0 ? void 0 : _a.id) + ">") {
            msg.reply('que tu quer o retardado');
        }
        // Ajuda
        if (msg.content === "!ajuda") {
            importCommands().then(function (response) {
                var stringMemes = '';
                memes().map(function (meme) { return stringMemes += "\n\t" + meme; });
                msg.channel.send("```" + ("!meme <> " + stringMemes + "\n\t " + response) + "```");
            });
        }
        // Memes áudio
        if (msg.content.startsWith('!meme')) {
            var splittedMessage_1 = msg.content.split(' ')[1];
            if (memes().find(function (meme) { return meme === splittedMessage_1; })) {
                playSound(msg);
            }
        }
        // Parar bot
        if (msg.content === "!stop") {
            if ((_b = msg.member) === null || _b === void 0 ? void 0 : _b.voice.channel) {
                if ((_d = (_c = msg.member) === null || _c === void 0 ? void 0 : _c.voice.channel) === null || _d === void 0 ? void 0 : _d.members.map(function (guildMember) { return guildMember.user.username === 'Botzera'; })) {
                    var connection = msg.member.voice.channel;
                    connection.join().then(function (connection) {
                        ready = true;
                        arrayMessages = [];
                        filaMusicas = [];
                        connection.disconnect();
                    });
                }
            }
        }
        // Ta falando merda
        if (msg.content === '!tafalandomerda') {
            msg.reply('Nãnãnãnãão, tá falando merda!');
        }
        // Youtube Play
        if (msg.content.startsWith('!youtube')) {
            handleYoutube(msg);
        }
        // Sortear
        if (msg.content === '!sortear') {
            var members = (_f = (_e = msg.member) === null || _e === void 0 ? void 0 : _e.voice.channel) === null || _f === void 0 ? void 0 : _f.members.map(function (guildMember) { return guildMember.user.username !== 'Botzera' && guildMember.user.id; });
            if (members) {
                var choosedMember = members[Math.floor(Math.random() * members.length)];
                msg.channel.send("Se fodeu <@" + choosedMember + ">, tu foi o escolhido!");
            }
        }
        // Atacar
        if (msg.content.startsWith("!atacar")) {
            var splittedMessage = msg.content.split(' ');
            if (splittedMessage.length === 3) {
                var memberId = splittedMessage[1].replace('<', '').replace('>', '').replace('@', '').replace('!', '');
                var message_1 = splittedMessage[2];
                var vitim = getUser(memberId);
                vitim.then(function (user) {
                    console.log("O bot come\u00E7ara uma metralhadora de " + message_1 + " para o usu\u00E1rio " + user.username);
                    for (var i = 0; i < 100; i++) {
                        setTimeout(function () { return sendMessage(user, message_1); }, 1000);
                    }
                    console.log("O bot assasinou " + user.username);
                });
            }
        }
        // Joke
        if (msg.content === "!joke") {
            axios_1.default.get('https://official-joke-api.appspot.com/random_joke').then(function (response) {
                msg.channel.send(response.data.setup);
                setTimeout(function () { return msg.channel.send(response.data.punchline); }, 5000);
            });
        }
        // Covid
        if (msg.content.startsWith('!covid')) {
            axios_1.default({
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
                .then(function (response) {
                var _a = response.data[0], confirmed = _a.confirmed, recovered = _a.recovered, critical = _a.critical, deaths = _a.deaths, lastUpdate = _a.lastUpdate;
                msg.channel.send("\n                    **Dados do COVID no Brasil:**\n\n                    **Confirmados:** " + formatNumber(confirmed) + "\n\n                    **Recuperados:** " + formatNumber(recovered) + "\n\n                    **Cr\u00EDticos:** " + formatNumber(critical) + "\n\n                    **Mortes:** " + formatNumber(deaths) + "\n\n                    **\u00DAltima atualiza\u00E7\u00E3o:** " + date_fns_1.format(date_fns_1.parseISO(lastUpdate), "dd/MM/yyyy 'às' hh:mm:ss a") + "\n                ");
            }).catch(function (err) {
                msg.channel.send("Erro: " + err);
            });
        }
        // Ladrão
        if (msg.content === "!ladrao") {
            msg.channel.send("<@448617496472322058> \u00E9 mt ladr\u00E3o mano, n\u00E3o da pra aguentar um cara desses");
        }
        // Watson
        if (msg.channel.type === "dm") {
            if (msg.author.id === ((_g = bot.user) === null || _g === void 0 ? void 0 : _g.id))
                return;
            if (!assistant)
                return;
            if (!apiIbmSession)
                return;
            assistant.message({
                assistantId: (assistantidibm ? assistantidibm : ""),
                sessionId: apiIbmSession,
                input: {
                    message_type: 'text',
                    text: msg.content,
                }
            })
                .then(function (res) {
                var _a;
                // console.log(JSON.stringify(res.result, null, 2));
                var responseArray = ((_a = res.result) === null || _a === void 0 ? void 0 : _a.output.generic) || [];
                if (responseArray.length > 0) {
                    msg.reply(responseArray[0].text);
                }
            })
                .catch(function (err) {
                console.log(err);
            });
        }
        if (msg.content === "!nao consigo") {
            msg.reply("Não desista gurizão, tenta de novo e meta ficha");
        }
    }
    catch (err) {
        msg.reply('Rolou um erro gurizao, tenta de novo e meta ficha');
        console.log(err);
        // fs.appendFile(path.resolve(__dirname, "config", "log.csv"), `Um novo erro ocorreu piazada:\nData: ${new Date()}\nConteúdo: ${err}\n\n`, () => { });
    }
});
//# sourceMappingURL=bot.js.map