const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const config = require('./config.json');

// Store active blacklists with their timeouts
const activeBlacklists = new Map();

// Helper function to parse duration string into milliseconds
function parseDuration(durationStr) {
    if (!durationStr || durationStr.toLowerCase() === 'permanent') return null;
    
    const units = {
        's': 1000,
        'm': 60 * 1000,
        'h': 60 * 60 * 1000,
        'd': 24 * 60 * 60 * 1000,
        'w': 7 * 24 * 60 * 60 * 1000
    };
    
    const match = durationStr.match(/^(\d+)([smhdw])$/i);
    if (!match) return null;
    
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    
    return value * (units[unit] || 0);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Bot ready event
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setActivity('for infractions', { type: 'WATCHING' });
});

// Command handling
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    // Check for Staff role
    const staffRole = interaction.guild.roles.cache.find(role => role.name === 'Staff');
    if (!staffRole) {
        return interaction.reply({
            content: '❌ Staff role not found! Please create a role named "Staff".',
            ephemeral: true
        });
    }

    // Check if user has the Staff role
    if (!interaction.member.roles.cache.has(staffRole.id)) {
        return interaction.reply({
            content: '⚠️ You require elevated permissions to use this command.',
            ephemeral: true
        });
    }

    try {
        if (commandName === 'blacklist') {
            const user = options.getUser('user');
            const reason = options.getString('reason');
            const duration = options.getString('duration') || 'permanent';
            
            // Check if user exists in the guild
            const member = await interaction.guild.members.fetch(user.id).catch(() => null);
            if (!member) {
                return interaction.reply({
                    content: '❌ User not found in the server.',
                    ephemeral: true
                });
            }

            // Find blacklist role
            const blacklistRole = interaction.guild.roles.cache.find(role => role.name === 'Blacklisted');
            if (!blacklistRole) {
                return interaction.reply({
                    content: '❌ Blacklisted role not found! Please create a role named "Blacklisted".',
                    ephemeral: true
                });
            }

            // Check if user is already blacklisted
            if (member.roles.cache.has(blacklistRole.id)) {
                return interaction.reply({
                    content: `⚠️ ${user.tag} is already blacklisted!`,
                    ephemeral: true
                });
            }

            // Parse duration and set up timeout if not permanent
            const durationMs = parseDuration(duration);
            
            // Clear any existing timeout for this user
            if (activeBlacklists.has(user.id)) {
                clearTimeout(activeBlacklists.get(user.id));
                activeBlacklists.delete(user.id);
            }

            // Create blacklist embed for logging
            const blacklistEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('User Blacklisted')
                .addFields(
                    { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
                    { name: 'Moderator', value: interaction.user.tag, inline: true },
                    { name: 'Reason', value: reason },
                    { name: 'Duration', value: duration }
                )
                .setTimestamp();

            // Add blacklist role
            await member.roles.add(blacklistRole);

            // Set up timeout for automatic role removal if duration is specified
            if (durationMs) {
                const timeout = setTimeout(async () => {
                    try {
                        const targetMember = await interaction.guild.members.fetch(user.id);
                        if (targetMember && targetMember.roles.cache.has(blacklistRole.id)) {
                            await targetMember.roles.remove(blacklistRole);
                            
                            // Log the automatic removal
                            const logChannel = interaction.guild.channels.cache.find(
                                channel => channel.name === 'mod-logs'
                            );
                            if (logChannel) {
                                const expiredEmbed = new EmbedBuilder()
                                    .setColor('#00FF00')
                                    .setTitle('Blacklist Expired')
                                    .addFields(
                                        { name: 'User', value: `${user.tag} (${user.id})` },
                                        { name: 'Duration', value: duration }
                                    )
                                    .setTimestamp();
                                await logChannel.send({ embeds: [expiredEmbed] });
                            }
                        }
                    } catch (error) {
                        console.error('Error removing expired blacklist:', error);
                    }
                    activeBlacklists.delete(user.id);
                }, durationMs);

                activeBlacklists.set(user.id, timeout);
            }

            // Try to DM the user
            try {
                const dmEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('You have been blacklisted')
                    .addFields(
                        { name: 'Server', value: interaction.guild.name },
                        { name: 'Reason', value: reason },
                        { name: 'Duration', value: duration }
                    );
                
                await user.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.log(`Could not DM user ${user.tag}`);
            }

            // Send confirmation and log
            await interaction.reply({
                content: `✅ Successfully blacklisted ${user.tag} ${duration === 'permanent' ? 'permanently' : `for ${duration}`}`,
                ephemeral: true
            });

            // Log the action in a logging channel if it exists
            const logChannel = interaction.guild.channels.cache.find(
                channel => channel.name === 'mod-logs'
            );
            if (logChannel) {
                await logChannel.send({ embeds: [blacklistEmbed] });
            }

// ... [Previous code remains the same until the remove-blacklist command] ...

} else if (commandName === 'remove-blacklist') {
    const user = options.getUser('user');
    
    // Check if user exists in the guild
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) {
        return interaction.reply({
            content: '❌ User not found in the server.',
            ephemeral: true
        });
    }

    // Find blacklist role
    const blacklistRole = interaction.guild.roles.cache.find(role => role.name === 'Blacklisted');
    if (!blacklistRole) {
        return interaction.reply({
            content: '❌ Blacklisted role not found!',
            ephemeral: true
        });
    }

    // Check if user is not blacklisted
    if (!member.roles.cache.has(blacklistRole.id)) {
        return interaction.reply({
            content: `⚠️ ${user.tag} is not blacklisted, no need to remove anything.`,
            ephemeral: true
        });
    }

    // Clear any active timeout for this user
    if (activeBlacklists.has(user.id)) {
        clearTimeout(activeBlacklists.get(user.id));
        activeBlacklists.delete(user.id);
    }

    // Create unblacklist embed for logging
    const unblacklistEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('User Removed from Blacklist')
        .addFields(
            { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
            { name: 'Moderator', value: interaction.user.tag, inline: true }
        )
        .setTimestamp();

    // Remove blacklist role
    await member.roles.remove(blacklistRole);

    // Try to DM the user
    try {
        const dmEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('Blacklist Removed')
            .setDescription('Your blacklist has been removed.')
            .addFields({ name: 'Server', value: interaction.guild.name });
        
        await user.send({ embeds: [dmEmbed] });
    } catch (error) {
        console.log(`Could not DM user ${user.tag}`);
    }

    // Send confirmation and log
    await interaction.reply({
        content: `✅ Successfully removed ${user.tag} from the blacklist`,
        ephemeral: true
    });

    // Log the action in a logging channel if it exists
    const logChannel = interaction.guild.channels.cache.find(
        channel => channel.name === 'mod-logs'
    );
    if (logChannel) {
        await logChannel.send({ embeds: [unblacklistEmbed] });
    }
}
    } catch (error) {
        console.error('Command execution error:', error);
        const errorMessage = '❌ An error occurred while executing this command.';
        
        if (!interaction.replied) {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        } else {
            await interaction.followUp({ content: errorMessage, ephemeral: true });
        }
    }
});

client.login(config.token);
