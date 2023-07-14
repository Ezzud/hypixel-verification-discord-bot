'use strict';
const {EmbedBuilder} = require('discord.js');

module.exports.run = async (client, interaction, author, guild) => {
    const link = client.linkModule;
    const logger = client.loggerModule;
    const api = client.apiModule;
    let embed = new EmbedBuilder()
    .setTitle(`💌 Help Menu`)
    .addFields(
        {
            name:`👤 User commands`, 
            value: `> **/verify** \`<Your Minecraft Username>\` - Link your minecraft account\n> **/changeaccount** \`<New Minecraft Username>\` - Change linked Minecraft account\n> **/unlink** - Unlink your Minecraft Account\n> **/checkguild** - Check your state in the guild\n> **/profile** \`Optional: <User to check>\` - Check your or someone's guild profile `
        },
        {
            name:`🔧 Administration Commands`, 
            value: `\n:warning: \`These commands require the "ADMINISTRATOR" permission**\`\n\n> **/showconfiguration** - Show the server's configuration\n> **/setguildrole** \`<Role>\` - Change the role of the guild members\n> **/setvisitorrole** \`<Role>\` - Change the role of the visitors\n> **/unlink** \`<User to unlink>\` - Unlink someone from his Minecraft account\n> **/checkguild** \`<User to check>\` - Check someone's guild state`
        }
    )
    .setColor("#2D88FD")
    .setThumbnail(author.avatarURL({dynamic: true}))
    .setTimestamp()
    interaction.reply({embeds: [embed]})
    
    return;



}



module.exports.help = {
    name: "help"
}