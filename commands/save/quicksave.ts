import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, AutocompleteInteraction } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quicksave')
        .setDescription('Run this on a message to save contained image to member defined user defined server and channel')
        .addSubcommand(subcommand =>
            subcommand.setName('configure')
            .setDescription('Configure the server and channel you want to quicksave to')
        )
}