'use strict';
const config = require("../config.json")

module.exports = async (client, interaction) => {
    if (!interaction.isCommand()) return;
    const logger = client.loggerModule;
    if(interaction.channel) {
        if(interaction.channel.isTextBased() && !interaction.channel.isDMBased()) {
            let commande_file = client.commands.get(interaction.commandName);
            if (commande_file) commande_file.run(client, interaction, interaction.user, interaction.member.guild);       
        }
    } else {
        let embed = await logger.createErrorEmbed("Verification Error", `Please use this command in the <#${config.verifyChannelID}> channel`)
        interaction.reply({embeds: [embed]}).catch(err => {})
        return;
    }
    
    
}