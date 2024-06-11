import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, AutocompleteInteraction } from 'discord.js';
// import { ese}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('quicksave')
        // .setDescription('Run on a message to save the contained image to the specified server and channel')
        .addSubcommand(subcommand =>
            subcommand
            .setName('configure')
            .setDescription('Set the server and channel to save images to')
            .addStringOption(option =>
                option.setName('server')
                .setDescription('The server to save the image to')
                .setRequired(true)
                .setAutocomplete(true)
            )
            .addStringOption(option =>
                option.setName('channel')
                .setDescription('Channel to save image to')
                .setRequired(true)
                .setAutocomplete(true)
            )
    ),
    async autocomplete(interaction: AutocompleteInteraction) {

    },

    async execute(interaction: ChatInputCommandInteraction) {
        interaction.reply("hello world")
    }
}