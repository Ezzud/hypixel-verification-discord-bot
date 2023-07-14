'use strict';

module.exports.run = async (client, interaction, author, guild) => {
    const link = client.linkModule;
    const logger = client.loggerModule;
    const api = client.apiModule;

    if(!(await api.hasPerm(guild.id, author.id, "Administrator"))) {
        let embed = await logger.createErrorEmbed("Permission Error", config.adminPerm)
        interaction.reply({embeds: [embed]})
        return;
    }
    let grole = ":x: Not Defined";
    let vrole = ":x: Not Defined";
    if(await api.getGuildRole()) grole = `<@&${await api.getGuildRole()}>`;
    if(await api.getVisitorRole()) vrole = `<@&${await api.getVisitorRole()}>`;

    let data = await link.getMinecraftData()
    let visitors = data.filter(x => x.isGuildMember === false).length
    let guildmembers = data.filter(x => x.isGuildMember === true).length
    let embed = await logger.createInfoEmbed("Server Configuration", `GuildMember Role: ${grole}\nVisitor Role: ${vrole}\n\nNumber of linked visitors: \` ${visitors} \`\nNumber of linked guild members: \` ${guildmembers} \` `)
    interaction.reply({embeds: [embed]})
    
    return;



}



module.exports.help = {
    name: "showconfiguration"
}