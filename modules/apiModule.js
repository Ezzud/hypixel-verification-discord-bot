


// VARIABLES AND REQUIREMENTS

const { EventEmitter } = require('events');
const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const moment = require('moment')
const config = require("../config.json")
const quick = require('quick.db')
const request = require("request");
const { Resolver } = require('dns');
const conf = new quick.table("configuration")
const db = new quick.table("main")
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};



// MAIN CLASS

class apiModule extends EventEmitter {
    constructor(client) {
        super();
        if (!client) throw new Error('Client is a required option.');
        this.client = client;
        this.ready = false;
        this._init();
    }


    getGuildRole() {
        return new Promise(async (resolve, reject) => {
            let role = await conf.get("guildMemberRole")
            return resolve(role);
        })   
    }

    getVisitorRole() {
        return new Promise(async (resolve, reject) => {
            let role = await conf.get("visitorRole")
            return resolve(role);
        })   
    }

    async setGuildRole(roleID) {
        await conf.set("guildMemberRole", roleID)  
    }

    async setVisitorRole(roleID) {
        await conf.set("visitorRole", roleID)  
    }


    hasPerm(guildID, userID, permission) {
        return new Promise(async (resolve, reject) => {
            let guild = this.client.guilds.cache.get(guildID)
            let member = guild.members.cache.get(userID)

            if(member.permissions.has(permission)) {
                return resolve(true);
            }
            return resolve(false);

        })   
    }


    getID(playername) {
        return new Promise(async (resolve, reject) => {
            request({
                url: `https://api.mojang.com/users/profiles/minecraft/${playername}`,
                method: "GET",
                json: true
            }, function (error, response, body){
                if(body) {
                    return resolve(body.id);
                } else {
                    return resolve(undefined);
                }
            });
        })
    }


    getMinecraftName(playername) {
        return new Promise(async (resolve, reject) => {
            request({
                url: `https://api.mojang.com/users/profiles/minecraft/${playername}`,
                method: "GET",
                json: true
            }, function (error, response, body){
                if(body) {
                    return resolve(body.name);
                } else {
                    return resolve(undefined);
                }
            });
        })
    }

    isDataGuildMember(username) {
        return new Promise(async (resolve, reject) => {
            var data = await db.get(`minecraftData`)
            if (!data) {
                return resolve(undefined);
            }
            let val = data.find(x => x.username === username)
            if(!val) return resolve(false); 
            if(val.isGuildMember) {
                return resolve(true);
            } else {
                return resolve(false); 
            }

        })
    }

    isAPIGuildMember(uuid) {
        return new Promise(async (resolve, reject) => {
            request({
                headers: {
                    "API-Key": config.hypixelKey,
                },
                url: `https://api.hypixel.net/guild?player=${uuid}`,
                method: "GET",
                json: true
            }, async function (error, response, body){
                if(body.guild === null) {
                    return resolve(false);
                }
                if(body.guild._id === config.guildID) {
                    return resolve(true);
        
                } else {
                    return resolve(false);
                }
            });
        })
    }

    getHypixelGuild(uuid) {
        return new Promise(async (resolve, reject) => {
            request({
                headers: {
                    "API-Key": config.hypixelKey,
                },
                url: `https://api.hypixel.net/guild?player=${uuid}`,
                method: "GET",
                json: true
            }, async function (error, response, body){
                if(body.success === false) {
                    return resolve();
                }
                if(body.guild === null) {
                    return resolve();
                }
                return resolve(body.guild)
            });
        })
    }

    getHypixelProfile(uuid) {
        return new Promise(async (resolve, reject) => {
            request({
                headers: {
                    "API-Key": config.hypixelKey,
                },
                url: `https://api.hypixel.net/player?uuid=${uuid}`,
                method: "GET",
                json: true
            }, async function (error, response, body){
                if(body.success === false) {
                    return resolve();
                }
                return resolve(body.player)
            });
        })
    }

    async setGuildMember(username, state) {
            let linkModule = this.client.linkModule;
            var data = await db.get(`minecraftData`)
            if(await linkModule.isMinecraftLinked(username) === false) return;
            data = data.filter(x => x.username !== username)
            data.push({"username":username, "id":userID, "isLinked":true, "isGuildMember":state})
            await db.set("minecraftData", data)
    }


    _init() {
        
        if(!this.client.userDB) {
            this.client.userDB = db
        }
        this.ready = true;
        console.log(` \x1b[32mLoaded\x1b[33m apiModule.js\x1b[32m module` + `\x1b[0m`);
    }
}

module.exports = apiModule;