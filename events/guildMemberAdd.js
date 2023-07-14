'use strict';
const {EmbedBuilder} = require('discord.js');
const config = require('../config.json');

module.exports = async (client, member) => {
    let embed = new EmbedBuilder()
    .setTitle(`Welcome to ${member.guild.name}!`)
    .setDescription(config.embeds.verification.dms.replaceAll("%channel%", `<#${config.verifyChannelID}>`))
    .setImage(config.linkGIF)
    .setTimestamp()
    .setColor("#FD3A2D")
    if(config.settings.sendVerificationEmbedInDM) member.send({embeds:[embed]}).catch(err => {});


    let guild = client.guilds.cache.get(config.discordGuildID)
    if(guild) {
        let channel = guild.channels.cache.get(config.verifyChannelID)
        if(channel) {
            let CHembed = new EmbedBuilder()
            .setTitle(`Welcome to ${member.guild.name}!`)
            .setDescription(config.embeds.verification.channel.replaceAll("%channel%", `<#${config.verifyChannelID}>`))
            .setImage(config.linkGIF)
            .setTimestamp()
            .setColor("#FD3A2D")
            if(config.settings.sendVerificationEmbedInChannel) channel.send({content:`Welcome to the server <@${member.id}>`, embeds:[CHembed]}).catch(err => {});
        }   
    }
    
}