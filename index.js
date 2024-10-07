const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent // Optional if you want to read message contents
    ]
});


const TOKEN = 'MTI5MjAyMjcwNTE2MzQ2ODg2Mg.GZEUPD.veKNfggmPNM92ErrpkrIOyS1f5wMpCcRBFq6cg';  // Replace with your bot token

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    
    // Set the bot's status to "Listening to commands"
    client.user.setActivity('you', { type: 'WATCHING' });
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    // Check if the user has the "Staff" role
    const staffRole = interaction.guild.roles.cache.find(role => role.name === 'Staff'); // Replace with your staff role name

    if (!interaction.member.roles.cache.has(staffRole.id)) {
        return interaction.reply({
            content: '⚠️ You reqiure elevated permissions to do this.',
            ephemeral: true // This makes the reply visible only to the user who invoked the command
        });
    }

    try {
        if (commandName === 'blacklist') {
            const user = options.getUser('user');
            const reason = options.getString('reason');
            const member = await interaction.guild.members.fetch(user.id); // Fetch the member object

            // Your logic to blacklist the user
            await interaction.reply(`✅ User ${user.username} has been blacklisted.`);

            // Assign the blacklist role
            const blacklistRole = interaction.guild.roles.cache.find(role => role.name === 'Blacklisted'); // Replace with your blacklist role name
            if (blacklistRole) {
                await member.roles.add(blacklistRole);
                console.log(`Role added to ${user.username}`);
            } else {
                console.log('Blacklist role not found.');
            }

            // Notify the user if they can receive DMs
            try {
                await user.send(`You were blacklisted by: ${interaction.user.username}\nReason: ${reason}\nPlease check the #blacklisted channel for more information.`);
            } catch (error) {
                if (error.code === 50007) {
                    console.log(`Could not send DM to ${user.tag}. They may have DMs disabled.`);
                    await interaction.followUp(`❔ Successfully blacklisted ${user.username}, but could not notify them (DMs are likely disabled).`);
                } else {
                    console.error('Error sending DM:', error);
                    await interaction.followUp('❌ An error occurred while trying to notify the user.');
                }
            }
        } else if (commandName === 'remove-blacklist') {
            const user = options.getUser('user');
            const member = await interaction.guild.members.fetch(user.id); // Fetch the member object

            // Your logic to remove the user from the blacklist
            await interaction.reply(`✅ User ${user.username} has been removed from the blacklist.`);

            // Remove the blacklist role
            const blacklistRole = interaction.guild.roles.cache.find(role => role.name === 'Blacklisted'); // Replace with your blacklist role name
            if (blacklistRole) {
                await member.roles.remove(blacklistRole);
                console.log(`Role removed from ${user.username}`);
            } else {
                console.log('Blacklist role not found.');
            }

            // Notify the user if they can receive DMs
            try {
                await user.send(`You were removed from the blacklist and your appeal was accepted.`);
            } catch (error) {
                if (error.code === 50007) {
                    console.log(`Could not send DM to ${user.tag}. They may have DMs disabled.`);
                    await interaction.followUp(`❔ Successfully removed ${user.username} from the blacklist, but could not notify them (DMs are likely disabled).`);
                } else {
                    console.error('Error sending DM:', error);
                    await interaction.followUp('❌ An error occurred while trying to notify the user.');
                }
            }
        }
    } catch (error) {
        console.error('Error handling command:', error);
        if (!interaction.replied) {
            await interaction.reply('❌ There was an error while executing this command!');
        } else {
            await interaction.followUp('❌ There was an error while executing this command!');
        }
    }
});

client.login(TOKEN);
