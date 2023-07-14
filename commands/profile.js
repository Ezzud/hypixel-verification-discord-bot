'use strict';
const config = require('../config.json')
    
    
    
module.exports.run = async (client, interaction, author, guild) => {
    const link = client.linkModule;
    const logger = client.loggerModule;
    const api = client.apiModule;
    
    let usr = interaction.options.getUser("user")
    let memberID;
    if(usr) { memberID = interaction.options.getUser("user").id } else { memberID = author.id };

    if(await link.isDiscordLinked(memberID) === false) {
        let embed = await logger.createErrorEmbed("Profile Error", config.notLinked, config.linkGIF)
        interaction.reply({embeds: [embed]})
        return;
    }
    let username = await link.getMinecraftLinkedAccount(memberID);
    let discordAccount = guild.members.cache.get(memberID).user;

    if(await api.isDataGuildMember(username)) {
            let dataSheet = "";

            let uuid = await api.getID(username)
            let hypixelGuild = await api.getHypixelGuild(uuid)

            if(!hypixelGuild) {
                let embed = await logger.createErrorEmbed("Profile Error", `User is not in a guild!`)
                interaction.reply({embeds: [embed]})
                return;
            }

            let userInfo = hypixelGuild.members.find(x => x.uuid === uuid)
            if(!userInfo) {
                dataSheet = "No Information about the user"
            } else {
                
                let rank = userInfo.rank
                let rankEmoji;
                switch(rank) {
                    case "Member":
                        rankEmoji = config.guildEmojis.Member
                        break;
                    case "Crew":
                        rankEmoji = config.guildEmojis.Crew
                        break;
                    case "Elite":
                        rankEmoji = config.guildEmojis.Elite
                        break;
                    case "Staff":
                        rankEmoji = config.guildEmojis.Staff
                        break;
                    case "Owner":
                        rankEmoji = config.guildEmojis.Owner
                        break;
                    case "Guild Master":
                        rankEmoji = config.guildEmojis.GuildMaster
                        break;
                    default:
                        rankEmoji = ":white_circle:"
                        break;
                }
                var formatedDate = Math.trunc(userInfo.joined / 1000)

                dataSheet = `:satellite: Minecraft Username: **${username}**\n:house: Guild Rank: **${rankEmoji} ${rank}**\n:incoming_envelope: Joined at: <t:${formatedDate}:R> (<t:${formatedDate}>)`
                let embed = await logger.createProfileEmbed(`${discordAccount.username}'s profile`, dataSheet, discordAccount, userInfo.expHistory)
                interaction.reply({embeds: [embed]})
                return; 
            }
    } else {
        let embed = await logger.createErrorEmbed("Profile Error", `User is not in the guild!`)
        interaction.reply({embeds: [embed]})
        return;   
    }


        return;
    
    
    
    }
    
    
    
    module.exports.help = {
        name: "profile"
    }