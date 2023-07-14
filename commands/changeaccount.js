'use strict';
const config = require('../config.json')

module.exports.run = async (client, interaction, author, guild) => {
    const link = client.linkModule;
    const logger = client.loggerModule;
    const api = client.apiModule;
    var user = interaction.options.getString("username")
    let memberID = author.id
    if(await link.isDiscordLinked(author.id) === false) {
        let embed = await logger.createErrorEmbed("Unlink Error", config.notLinked, config.linkGIF)
            interaction.reply({embeds: [embed]})
            return;
    }
    let oldAccount = await link.getMinecraftLinkedAccount(memberID)

    if(user.toLowerCase() === oldAccount) {
        let embed = await logger.createErrorEmbed("Verification Error", "Minecraft account is the same!")
        interaction.reply({embeds: [embed]})
        return; 
    }

    let uuid = await api.getID(user)
    if(!uuid) {
        let embed = await logger.createErrorEmbed("Verification Error", "Minecraft account not found!")
        interaction.reply({embeds: [embed]})
        return; 
    }
    let realName = await api.getMinecraftName(user)
    let profile = await api.getHypixelProfile(uuid);

    if(!profile) {
        let embed = await logger.createErrorEmbed("Verification Error", "Your Hypixel profile is not found!")
        interaction.reply({embeds: [embed]})
        return;
    }
    if(!profile.socialMedia) {
        let embed = await logger.createErrorEmbed("Verification Error", `Please add your **Discord TAG** to your Hypixel profile's social medias!\n\n :question: How to add your Discord Tag to your Hypixel profile:\n> - Connect on **hypixel.net**
        > - Click on your profile menu (Head in your inventory)
        > - Go on __Social Media__ page
        > - Click on the Discord Head and type your Discord TAG in the chat (check the gif down below)`, config.linkGIF)
        interaction.reply({embeds: [embed]})
        return;
    }
    if(!profile.socialMedia.links) {
        let embed = await logger.createErrorEmbed("Verification Error", `Please add your **Discord TAG** to your Hypixel profile's social medias!\n\n :question: How to add your Discord Tag to your Hypixel profile:\n> - Connect on **hypixel.net**
        > - Click on your profile menu (Head in your inventory)
        > - Go on __Social Media__ page
        > - Click on the Discord Head and type your Discord TAG in the chat (check the gif down below)`, config.linkGIF)
        interaction.reply({embeds: [embed]})
        return;
    }
    if(!profile.socialMedia.links.DISCORD) {
        let embed = await logger.createErrorEmbed("Verification Error", `Please add your **Discord TAG** to your Hypixel profile's social medias!\n\n :question: How to add your Discord Tag to your Hypixel profile:\n> - Connect on **hypixel.net**
        > - Click on your profile menu (Head in your inventory)
        > - Go on __Social Media__ page
        > - Click on the Discord Head and type your Discord TAG in the chat (check the gif down below)`, config.linkGIF)
        interaction.reply({embeds: [embed]})
        return;
    }

    if(author.tag !== profile.socialMedia.links.DISCORD) {
        let embed = await logger.createErrorEmbed("Verification Error", `Your Hypixel Discord Tag is **wrong**!\n\n :question: How to add your Discord Tag to your Hypixel profile:\n> - Connect on **hypixel.net**
        > - Click on your profile menu (Head in your inventory)
        > - Go on __Social Media__ page
        > - Click on the Discord Head and type your Discord TAG in the chat (check the gif down below)`, config.linkGIF)
        interaction.reply({embeds: [embed]})
        return;
    }




    let isOnGuild = await api.isAPIGuildMember(uuid);
    if(isOnGuild) {
        await link.unLinkAccount(memberID);
        await link.linkAccount(realName, author.id, true);
            let embed = await logger.createSuccessEmbed(`Welcome!`, `Your Discord account is now linked to the Minecraft account \`${realName}\`\nAs a guild member, you got the  <@&${await api.getGuildRole()}> role`)
            interaction.reply({embeds:[embed]})
            await link.setGuildRoles(guild.id, memberID, true)
    } else {
        await link.unLinkAccount(memberID);
        await link.linkAccount(realName, author.id, false);
            let embed = await logger.createSuccessEmbed(`Welcome!`, `Your Discord account is now linked to the Minecraft account \`${realName}\`\nYou got the <@&${await api.getVisitorRole()}> role`)
            interaction.reply({embeds:[embed]})
            await link.setGuildRoles(guild.id, memberID, false)
    }
    console.log(`[LINK] Member \x1b[33m ${author.tag} \x1b[0mchanged his Minecraft account to \x1b[33m ${realName}\x1b[0m`)
    guild.members.cache.get(author.id).setNickname(realName, `User has changed his Minecraft account`).catch(err => {if(err.code === 50013) return;})
    return;

}



module.exports.help = {
    name: "changeaccount"
}