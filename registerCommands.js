const { Client, GatewayIntentBits, Partials, Collection, SlashCommandBuilder } = require('discord.js');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.DirectMessages]
});

const ms = require('ms');
const settings = require('./config.json');
const fs = require('fs');
const moment = require('moment');
const json = require('./package.json')
moment.locale("fr")



async function main() {

        let commandsArray = []
        
        let data99 = new SlashCommandBuilder()
            .setName("help")
            .setDescription("Show the help menu")
            .setDMPermission(false)
        commandsArray.push(data99.toJSON())

        let data0 = new SlashCommandBuilder()
            .setName("showconfiguration")
            .setDescription("Show Server's configuration and statistics")
            .setDMPermission(false)
        commandsArray.push(data0.toJSON())

        let data = new SlashCommandBuilder()
            .setName("changeaccount")
            .setDescription("Change linked Minecraft account")
            .addStringOption(option => option.setName('username')
                .setDescription("Your new Minecraft username")
                .setRequired(true))
            .setDMPermission(false)
        commandsArray.push(data.toJSON())

        let data2 = new SlashCommandBuilder()
            .setName("verify")
            .setDescription("Link your minecraft account")
            .addStringOption(option => option.setName('username')
                .setDescription("Your Minecraft Username")
                .setRequired(true))
            .setDMPermission(false)
        commandsArray.push(data2.toJSON())


        let data3 = new SlashCommandBuilder()
            .setName("profile")
            .setDescription("Check your profile")
            .addUserOption(option => option.setName('user')
                .setDescription("Check someone's profile")
                .setRequired(false))
            .setDMPermission(false)

        commandsArray.push(data3.toJSON())

        let data4 = new SlashCommandBuilder()
            .setName("unlink")
            .setDescription("Unlink your Minecraft Account")
            .addUserOption(option => option.setName('user')
                .setDescription("ADMINISTRATOR permission: Unlink someone's account")
                .setRequired(false))
            .setDMPermission(false)

        commandsArray.push(data4.toJSON())

        let data5 = new SlashCommandBuilder()
        .setName("setguildrole")
        .setDescription("ADMINISTRATOR permission: Change guild members's role")
        .setDefaultMemberPermissions(8)
        .addRoleOption(option => option.setName('role')
            .setDescription("Role to choose")
            .setRequired(true))
        .setDMPermission(false)
    commandsArray.push(data5.toJSON())

    let data6 = new SlashCommandBuilder()
    .setName("setvisitorrole")
    .setDescription("ADMINISTRATOR permission: Change visitors's role")
    .setDefaultMemberPermissions(8)
    .addRoleOption(option => option.setName('role')
        .setDescription("Role to choose")
        .setRequired(true))
    .setDMPermission(false)
    commandsArray.push(data6.toJSON())

    let data7 = new SlashCommandBuilder()
    .setName("checkguild")
    .setDescription("Check your state in the guild")
    .setDefaultMemberPermissions(8)
    .addUserOption(option => option.setName('user')
        .setDescription("ADMINISTRATOR permission: Check someone's state in the guild")
        .setRequired(false))
    .setDMPermission(false)
    commandsArray.push(data7.toJSON())
        
        console.log(commandsArray)

        const { REST } = require('@discordjs/rest');
        const { Routes } = require('discord-api-types/v9');
        const rest = new REST({ version: '9' }).setToken(settings.token);
        (async() => {
            try {
                console.log(' Started refreshing application (/) commands.');
                await rest.put(Routes.applicationCommands(settings.applicationID), {
                    body: commandsArray
                }, );
                console.log(' Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        })();
        console.log(" \x1b[32m" + " \x1b[32mChargement des commandes effectué" + "\x1b[0m");

}

main().then(async() => console.log("Register starting")).catch(async(err) => console.log("Error while registering commands!\n" + err))