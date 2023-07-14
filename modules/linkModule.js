// VARIABLES AND REQUIREMENTS

const { EventEmitter } = require('events');
const Discord = require('discord.js');
const moment = require('moment')
const config = require("../config.json")
const quick = require('quick.db')
const db = new quick.table("main")
const conf = new quick.table("configuration")
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};



// MAIN CLASS

class linkModule extends EventEmitter {
    constructor(client) {
        super();
        if (!client) throw new Error('Client is a required option.');
        this.client = client;
        this.ready = false;
        this._init();
    }


    getMinecraftData() {
        return new Promise(async (resolve, reject) => {
            var data = await db.get(`minecraftData`)
            return resolve(data);
        }) 
    }

    isDiscordLinked(userID) {
        return new Promise(async (resolve, reject) => {
            var data = await db.get(`minecraftData`)
            if (!data) {
                return resolve(undefined);
            }
            let val = data.find(x => x.id === userID)
            if(!val) return resolve(false); 
            if(val.isLinked) {
                return resolve(true);
            } else {
                return resolve(false); 
            }

        })
    }

    isMinecraftLinked(username) {
        return new Promise(async (resolve, reject) => {
            var data = await db.get(`minecraftData`)
            if (!data) {
                return resolve(undefined);
            }
            let val = data.find(x => x.username.toLowerCase() === username.toLowerCase())
            if(!val) return resolve(false); 
            if(val.isLinked) {
                return resolve(true);
            } else {
                return resolve(false); 
            }

        })
    }

    async linkAccount(username, userID, isGuildMember) {
            var data = await db.get(`minecraftData`)
            data = data.filter(x => x.id !== userID)
            data.push({"username":username, "id":userID, "isLinked":true, "isGuildMember":isGuildMember})
            await db.set("minecraftData", data)
    }

    async unLinkAccount(userID) {
        var data = await db.get(`minecraftData`)
        data = data.filter(x => x.id !== userID)
        await db.set("minecraftData", data)
    }

    getMinecraftLinkedAccount(userID) {
        return new Promise(async (resolve, reject) => {
            var data = await db.get(`minecraftData`)
            if (!data) {
                return resolve(undefined);
            }
            let val = data.find(x => x.id === userID)
            if(!val) return resolve(undefined); 
            if(!val.isLinked) return resolve(undefined); 
            if(val.username) {
                return resolve(val.username);
            } else {
                return resolve(undefined); 
            }

        })  
    }


    getDiscordLinkedAccount(username) {
        return new Promise(async (resolve, reject) => {
            var data = await db.get(`minecraftData`)
            if (!data) {
                return resolve(undefined);
            }
            let val = data.find(x => x.username === username)
            if(!val) return resolve(undefined); 
            if(!val.isLinked) return resolve(undefined); 
            if(val.userID) {
                return resolve(val.userID);
            } else {
                return resolve(undefined); 
            }

        })  
    }

    async setGuildRoles(guildID, userID, isGuildMember) {
        var guildMemberRole = await conf.get("guildMemberRole")
        var visitorRole = await conf.get("visitorRole")
        if(isGuildMember) {
            if(guildMemberRole) {
                let guild = this.client.guilds.cache.get(guildID)
                let member = guild.members.cache.get(userID)
                if(member.roles.cache.get(visitorRole)) {
                    member.roles.remove(visitorRole)
                }
                if(!member.roles.cache.get(guildMemberRole)) {
                    member.roles.add(guildMemberRole)
                }
            }
        } else {
            if(visitorRole) {
                let guild = this.client.guilds.cache.get(guildID)
                let member = guild.members.cache.get(userID)
                if(member.roles.cache.get(guildMemberRole)) {
                    member.roles.remove(guildMemberRole)
                }
                if(!member.roles.cache.get(visitorRole)) {
                    member.roles.add(visitorRole)
                }
            }
        }
    }

    _init() {
        
        if(!this.client.userDB) {
            this.client.userDB = db
        }
        this.ready = true;
        console.log(` \x1b[32mLoaded\x1b[33m linkModule.js\x1b[32m module` + `\x1b[0m`);
    }
}

module.exports = linkModule;