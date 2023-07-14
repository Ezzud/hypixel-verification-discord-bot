// VARIABLES AND REQUIREMENTS

const { EventEmitter } = require('events');
const fs = require('fs');
const { EmbedBuilder } = require('discord.js');
const moment = require('moment')
const config = require("../config.json")
const quick = require('quick.db')
const db = new quick.table("main")
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};



// MAIN CLASS

class loggerModule extends EventEmitter {
    constructor(client) {
        super();
        if (!client) throw new Error('Client is a required option.');
        this.client = client;
        this.ready = false;
        this._init();
    }

    createSuccessEmbed(title, reason) {
        return new Promise(async (resolve, reject) => {
            var embed = new EmbedBuilder()
            .setTitle(`✅ ` + title)
            .setDescription(reason)
            .setColor("#29FF03")
            .setTimestamp()
            return resolve(embed);
        })
    }

    createErrorEmbed(title, reason, image) {
        return new Promise(async (resolve, reject) => {
            var embed = new EmbedBuilder()
            .setTitle(`❌ ` + title)
            .setDescription(reason)
            .setColor("#FF0B03")
            .setTimestamp();
            if(image) embed.setImage(image);
            return resolve(embed);
        })
    }

    createInfoEmbed(title, reason) {
        return new Promise(async (resolve, reject) => {
            var embed = new EmbedBuilder()
            .setTitle(`ℹ ` + title)
            .setDescription(reason)
            .setColor("#03FFF4")
            .setTimestamp()
            return resolve(embed);
        })
    }

    createProfileEmbed(title, reason, profile, expHistory) {
        return new Promise(async (resolve, reject) => {
            let history = "";
            for(let i = 0; i < Object.values(expHistory).length; i++) {
                let date = new Date(Object.keys(expHistory)[i]).getTime();
                let count = Object.values(expHistory)[i];
                var formatedDate = Math.trunc(date / 1000);
                history += `- <t:${formatedDate}:D>: ${count} :small_blue_diamond:\n`;
            }

            var embed = new EmbedBuilder()
            .setTitle(`👤 ` + title)
            .setDescription(reason)
            .setThumbnail(profile.avatarURL({dynamic: true}))
            .addFields(
                {
                    name:`:clipboard: Experience History`, 
                    value: history
                }
            )
            .setColor("#FDE42D")
            .setTimestamp()
            return resolve(embed);
        })
    }


    _init() {
        
        if(!this.client.userDB) {
            this.client.userDB = db
        }
        this.ready = true;
        console.log(` \x1b[32mLoaded\x1b[33m loggerModule.js\x1b[32m module` + `\x1b[0m`);
    }
}

module.exports = loggerModule;