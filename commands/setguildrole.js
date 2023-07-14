'use strict';
const config = require('../config.json')

module.exports.run = async (client, interaction, author, guild) => {
    const link = client.linkModule;
    const logger = client.loggerModule;
    const api = client.apiModule;

    let role = interaction.options.getRole("role").id
    if(await api.hasPerm(guild.id, author.id, "Administrator") === false) {
        let embed = await logger.createErrorEmbed("Permission Error", config.adminPerm)
        interaction.reply({embeds: [embed]})
        return;
    }

    if(await api.getGuildRole() === role) {
        let embed = await logger.createErrorEmbed("Configuration Error", "The given role is the same as the defined role")
        interaction.reply({embeds: [embed]})
        return;    
    }

    if(!guild.roles.cache.get(role).editable) {
        let embed = await logger.createErrorEmbed("Permission Error", `I don't have permission to give the role to members!\nPlease set the **${client.user.username}** role above the <@&${role}> role`)
        interaction.reply({embeds: [embed]})
        return; 
    }

    if(role === await api.getVisitorRole()) {
        let embed = await logger.createErrorEmbed("Configuration Error", `The given role is the same as the Visitor's role`)
        interaction.reply({embeds: [embed]})
        return;  
    }

    let oldRole = await api.getGuildRole()
    await api.setGuildRole(role);
    var data = await link.getMinecraftData()

    let affected_users = 0;
    for(let i = 0; i < data.length; i++) {
        let user = data[i]
        let member = guild.members.cache.get(user.id)
        if(member) {
            if(await api.isDataGuildMember(user.username) === false) continue;
            affected_users++;
            if(member.roles.cache.get(oldRole)) {
                member.roles.remove(oldRole)
            }
            await link.setGuildRoles(guild.id, user.id, true)
        }
    }
    let embed = await logger.createSuccessEmbed("Roles Updated", "The GuildMember's role have been changed!\n` " + affected_users + " ` users have been affected")
    interaction.reply({embeds: [embed]})
    return; 



}



module.exports.help = {
    name: "setguildrole"
}