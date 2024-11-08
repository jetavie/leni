const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { clientId, guildId, token } = require('./config.json');

const commands = [
    {
        name: 'blacklist',
        description: 'Blacklist a user from the server',
        options: [
            {
                name: 'user',
                description: 'The user to blacklist',
                type: 6, // USER type
                required: true,
            },
            {
                name: 'reason',
                description: 'Reason for blacklisting',
                type: 3, // STRING type
                required: true,
            },
            {
                name: 'duration',
                description: 'Duration of the blacklist (e.g., 60s, 5m, 1h, 1d, 1w, permanent)',
                type: 3, // STRING type
                required: false,
                choices: [
                    { name: '1 minute', value: '1m' },
                    { name: '5 minutes', value: '5m' },
                    { name: '15 minutes', value: '15m' },
                    { name: '30 minutes', value: '30m' },
                    { name: '1 hour', value: '1h' },
                    { name: '6 hours', value: '6h' },
                    { name: '12 hours', value: '12h' },
                    { name: '1 day', value: '1d' },
                    { name: '3 days', value: '3d' },
                    { name: '1 week', value: '1w' },
                    { name: 'Permanent', value: 'permanent' }
                ]
            }
        ],
    },
    {
        name: 'remove-blacklist',
        description: 'Remove a user from the blacklist',
        options: [
            {
                name: 'user',
                description: 'The user to remove from blacklist',
                type: 6, // USER type
                required: true,
            }
        ],
    }
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('Error deploying commands:', error);
    }
})();