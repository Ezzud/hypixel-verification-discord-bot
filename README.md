# Hypixel Verification Discord Bot
Discord Bot to make users verify their Minecraft account on Hypixel

## Warning: This is an old project barely ported to DiscordJS v14

Requirement:
- 1 verification channel
- a Hypixel API Key: https://developer.hypixel.net

Features:
- Hypixel Guild Support
- Gives specific role for verification (one for guild members, one for visitors)
- Customisable messages
- Configurable

Commands:
- /help - Help command
- /verify <Username> - Verify his account
- /unlink <Optional for Admins: Username> - Unlink Discord account from the registered Minecraft account
- /changeaccount <New Username> - Change verified Minecraft account
- /checkguild <Optional for Admins: Username> - Check for any guild status modification
- /profile <Optional: User> - Check Guild Member's profile
- /setguildrole <Role> - Admins Only: Change role for guild members
- /setvisitorrole <Role> - Admins Only: Change role for visitors
- /showconfiguration - Admins only: Check server configuration

### Setup
- Fill `config.json` with your Discord Bot token, Discord bot application ID, Hypixel API Key, Hypixel Guild ID, Verification Channel ID and Discord Guild ID
- Change messages if needed
- Change settings if needed:
  - unlinkUserOnleave: does members who leaves the server will be automatically unlinked?
  - sendVerificationEmbedInDM: does new members receive a DM showing how to link their Minecraft Account
  - sendVerificationEmbedInChannel: does new members receive a mention & a new message on the verification channel showing how to link their Minecraft Account
