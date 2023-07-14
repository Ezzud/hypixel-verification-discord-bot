const Discord = require('discord.js');
const request = require('request');
const QuickDB = require('quick.db');
const db = new QuickDB.table("main");
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const ms = require('ms');
const config = require('./config.json');
const fs = require('fs');
const moment = require('moment');
const json = require('./package.json')




const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.DirectMessages]
});

const link_module = require("./modules/linkModule");
const logger_module = require("./modules/loggerModule");
const api_module = require("./modules/apiModule");

client.userDB = db;

// START
launch();
async function launch() {
    console.log(`[CORE] Loading core files`)
    await _eventHandler();
    await _commandHandler();
    console.log(`[CORE] Events and commands loaded!`)
    console.log(`[CORE] Loading modules`)
    client.linkModule = new link_module(client);
    client.loggerModule = new logger_module(client);
    client.apiModule = new api_module(client);
    client.commands = new Discord.Collection();
    client.events = new Discord.Collection();
    if(!await db.get("minecraftData")) {
        await db.set("minecraftData", [])
        await db.push("minecraftData", {"username":"Ezzud", "id":"638773138712428575", "isLinked":true, "isGuildMember":true})
    }
    console.log(`[CORE] Modules loaded`)
    console.log(`[API] Connecting to API...`)
    client.login(config.token);
}






function _commandHandler() {
    fs.readdir("./commands/", (err, files) => {
        if (err) console.log(err);
        let jsfile = files.filter(f => f.split(".").pop() === "js");
        if (jsfile.length <= 0) {
            console.log("Aucun fichier trouvé dans ./commands/");
            return;
        }
        jsfile.forEach((f, i) => {
            let props = require(`./commands/${f}`);
            client.commands.set(props.help.name, props);
        });
    });
}

function _eventHandler() {
    fs.readdir('./events/', async (err, f) => {
        if (err) console.log(err);
        let jsfile = f.filter(f => f.split(".").pop() === "js");
        if (jsfile.length <= 0) {
            console.log("Aucun fichier trouvé dans ./events/");
            return;
        }
        f.forEach((f) => {
            const events = require(`./events/${f}`);
            const event = f.split(".")[0];
            client.on(event, events.bind(null, client));
        });
    });
}
