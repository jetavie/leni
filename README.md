![leni github banner](https://github.com/user-attachments/assets/761a9c7d-cff8-4636-9cea-67e3d432987d)

A simple Discord bot built with `discord.js` to manage blacklisting users in a server.

# Heads Up!!
🆕 **Version 2.0.0 is now available!** Now featuring timed blacklists and improved moderation tools. [See the changelog](./CHANGELOG.md)

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

| Command       | Description                           |
| ------------- | ------------------------------------- |
| `/blacklist @user`  | Blacklists the mentioned user.    |
| `/remove-blacklist @user`   | 	Removes the mentioned user from blacklist |

# Contributing
Feel free to open issues or submit pull requests.

# License
[MIT](https://opensource.org/license/MIT)

# Addeneum

NOTE: Make sure you have the role "Blacklisted" in your discord server. If you want to use a different name, refer to lines with:
```discord.js
const blacklistRole = interaction.guild.roles.cache.find(role => role.name === 'Blacklisted');
```
If you don't make these changes otherwise, you'll get this error:

`"Blacklist role not found."`

This is also true for members with staff roles:

```discord.js
const staffRole = interaction.guild.roles.cache.find(role => role.name === 'Staff'); 
```
If you don't make these changes otherwise, you'll get this error too:

`"⚠️ You reqiure elevated permissions to do this."`


