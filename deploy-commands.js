const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10'); // Ensure this matches the API version you're using!
const { clientId, guildId, token } = require('./config.json');

const commands = [
    {
        name: 'blacklist',
        description: 'Blacklist a user',
        options: [
            {
                name: 'user',
                description: 'The user to blacklist',
                type: 6, 
                required: true,
            },
            {
                name: 'reason',
                description: 'Reason for blacklisting',
                type: 3, 
                required: true,
            },
        ],
    },
    {
        name: 'remove-blacklist',
        description: 'Remove a user from the blacklist',
        options: [
            {
                name: 'user',
                description: 'The user to remove from blacklist',
                type: 6, // User type
                required: true,
            },
        ],
    },
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commands,
        });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

