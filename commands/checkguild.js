'use strict';
const config = require('../config.json')



module.exports.run = async (client, interaction, author, guild) => {
    const link = client.linkModule;
    const logger = client.loggerModule;
    const api = client.apiModule;


    let usr = interaction.options.getUser("user")
    
    let memberID;
    if(usr) {
        if(!(await api.hasPerm(guild.id, author.id, "Administrator"))) {
            let embed = await logger.createErrorEmbed("Permission Error", config.adminPerm)
            interaction.reply({embeds: [embed]})
            return;
        }
        memberID = interaction.options.getUser("user").id
    } else {
        memberID = author.id
    }
    
    if(!(await link.isDiscordLinked(memberID))) {
        let embed = await logger.createErrorEmbed("Verification Error", config.notLinked, config.linkGIF)
        interaction.reply({embeds: [embed]})
        return;
    }

    
    let username = await link.getMinecraftLinkedAccount(memberID)
    
    let dataState = await api.isDataGuildMember(username)

    let uuid = await api.getID(username)
    if(!uuid) {
        let embed = await logger.createErrorEmbed("Verification Error", "Minecraft account not found!\nIf you have changed your username, type the command \`/changeaccount <New Minecraft username>\` ")
        interaction.reply({embeds: [embed]})
        return; 
    }

    let APIState = await api.isAPIGuildMember(uuid)

    await api.setGuildMember(guild.id, username, dataState);
    await link.setGuildRoles(guild.id, memberID, APIState);

    if(memberID === author.id) {
        
        if(!dataState && !APIState) {
            let embed = await logger.createSuccessEmbed("State Updated", "**Your Guild status have been verified**\nNo changes found.");
            interaction.reply({embeds: [embed]})
            return;   
        }
        if(dataState && APIState) {
            let embed = await logger.createSuccessEmbed("State Updated", "**Your Guild status have been verified**\nNo changes found.");
            interaction.reply({embeds: [embed]})
            return;   
        }
        if(dataState && !APIState) {
            let embed = await logger.createSuccessEmbed("State Updated", `**Your Guild status have been verified**\nYou are not in the guild anymore, you got the <@&${config.roles.visitor}> role`);
            interaction.reply({embeds: [embed]})
            return;  
        }
        if(!dataState && APIState) {
            let embed = await logger.createSuccessEmbed("Welcome!", `**Your Guild status have been verified**\nYou got the <@&${config.roles.guildMember}> role`);
            interaction.reply({embeds: [embed]})
            return; 
        }
    } else {
        if(!dataState && !APIState) {
            let embed = await logger.createSuccessEmbed("State Updated", "**<@" + memberID + ">'s guild status have been verified**\nNo changes found.");
            interaction.reply({embeds: [embed]})
            return;   
        }
        if(dataState && APIState) {
            let embed = await logger.createSuccessEmbed("State Updated", "**<@" + memberID + ">'s guild status have been verified**\nNo changes found.");
            interaction.reply({embeds: [embed]})
            return;   
        }
        if(dataState && !APIState) {
            let embed = await logger.createSuccessEmbed("State Updated", "**<@" + memberID + `>'s guild status have been verified**\nHe is not in the guild anymore and he got the <@&${await api.getVisitorRole()}> role`);
            interaction.reply({embeds: [embed]})
            return;  
        }
        if(!dataState && APIState) {
            let embed = await logger.createSuccessEmbed("Welcome!", "**<@" + memberID + `>'s guild status have been verified**\nHe obtained the <@&${await api.getGuildRole()}> role`);
            interaction.reply({embeds: [embed]})
            return; 
        }
    }
    
}



module.exports.help = {
    name: "checkguild"
}