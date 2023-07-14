'use strict';
const config = require('../config.json')



module.exports.run = async (client, interaction, author, guild) => {
    const link = client.linkModule;
    const logger = client.loggerModule;
    const api = client.apiModule;

    let usr = interaction.options.getUser("user")
    let memberID;
    if(usr) {
        if(await api.hasPerm(guild.id, author.id, "Administrator") === false) {
            let embed = await logger.createErrorEmbed("Permission Error", config.adminPerm)
            interaction.reply({embeds: [embed]})
            return;
        }
        memberID = interaction.options.getUser("user").id
    } else {
        memberID = author.id
    }


    if(memberID === author.id) {
        if(await link.isDiscordLinked(memberID)) {
            let oldAccount = await link.getMinecraftLinkedAccount(memberID)
            await link.unLinkAccount(memberID);
            let embed = await logger.createSuccessEmbed("DONE", `Your Discord account have been unlinked from the Minecraft account \`${oldAccount}\` `)
            interaction.reply({embeds: [embed]})
            await link.setGuildRoles(guild.id, memberID, false)
            guild.members.cache.get(memberID).setNickname(null, `User has unlinked his Minecraft account`).catch(err => {if(err.code === 50013) return;})
            console.log(`[LINK] Member \x1b[33m${guild.members.cache.get(memberID).user.tag}\x1b[0m has been unlinked from his Minecraft Account`)
            return;
        } else {
            let embed = await logger.createErrorEmbed("Unlink Error", config.notLinked, config.linkGIF)
            interaction.reply({embeds: [embed]})
            return;
        }
    } else {
        if(await link.isDiscordLinked(memberID)) {
            let oldAccount = await link.getMinecraftLinkedAccount(memberID)
            await link.unLinkAccount(memberID);
            let embed = await logger.createSuccessEmbed("Terminé", `The discord account <@${memberID}> have been unlinked from the Minecraft account \`${oldAccount}\` `)
            interaction.reply({embeds: [embed]})
            await link.setGuildRoles(guild.id, memberID, false)
            guild.members.cache.get(memberID).setNickname(null, `User has unlinked his Minecraft account`).catch(err => {if(err.code === 50013) return;})
            console.log(`[LINK] Member \x1b[33m${guild.members.cache.get(memberID).user.tag}\x1b[0m has been unlinked from his Minecraft Account`)
            return;
        } else {
            let embed = await logger.createErrorEmbed("Unlink Error", config.notLinked, config.linkGIF)
            interaction.reply({embeds: [embed]})
            return;
        }
    }
}



module.exports.help = {
    name: "unlink"
}