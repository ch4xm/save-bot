import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, AutocompleteInteraction } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('save')
        .setDescription('Run on a message to save the contained image to the specified server and channel')
        .addStringOption(option =>
            option.setName('server')
            .setDescription('The server to save the image to')
            .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('Channel to save image to')
            .setRequired(true)
        )
}