# Leni

A simple Discord bot built with `discord.js` to manage blacklisting users in a server.

## Features
- Blacklist users with a reason and notify them via DM.
- Remove users from the blacklist and notify them.
- Role-based permissions for staff only commands.

## Prerequisites
- [Node.js](https://nodejs.org/en/) v16.9.0 or higher.
- [Discord.js](https://discord.js.org) v14+.
- A [Discord bot](https://discord.com/developers/applications) with appropriate permissions.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jetavie/leni
   cd your-repository-name
2. Install dependencies:
```
npm install
```
3. Create a `config.json` file in the root directory:
```
{
    "clientId": "YOUR_BOT_CLIENT_ID",
    "guildId": "YOUR_GUILD_ID",
    "token": "YOUR_BOT_TOKEN"
}
```

4. Run the bot:
```
node index.js
```

# Usage
- Use `/blacklist @user reason` to blacklist a user.
- Use `/remove-blacklist @user` to remove a user from the blacklist.
NOTE: Make sure you have the role "Blacklisted" in your discord server, or refer to lines with:
```discord.js
const blacklistRole = interaction.guild.roles.cache.find(role => role.name === 'Blacklisted');
```
Then, change the blacklisted role to the name of your liking!

| Command       | Description                           |
| ------------- | ------------------------------------- |
| `/blacklist @user`  | Blacklists the mentioned user.    |
| `/remove-blacklist @user`   | 	Removes the mentioned user from blacklist |

# Contributing
Feel free to open issues or submit pull requests.

# License
[MIT](https://opensource.org/license/MIT)

