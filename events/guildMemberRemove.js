'use strict';
const config = require('../config.json')

module.exports = async (client, member) => {
    
    const link = client.linkModule;

    if(!config.settings.unlinkUserOnleave) return;
    if(await link.isDiscordLinked(member.id)) {
        await link.unLinkAccount(member.id)
        console.log(`[LINK] Member \x1b[33m${member.user.tag}\x1b[0m has been unlinked for leaving the server`)
        return;
    }


}