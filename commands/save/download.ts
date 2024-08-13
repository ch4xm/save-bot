import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, AutocompleteInteraction, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } from 'discord.js';
import { Modal, TextInputComponent, SelectMenuComponent, showModal } from 'discord-modals'
// import { ese}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('download')
        .setDescription('Download all attachments from the current channel up to a certain limit')
        .addSubcommand(subcommand =>
            subcommand
            .setName('all')
            .setDescription('Download all attachments from the current channel')
            .addStringOption(option =>
                option.setName('type')
                .setDescription('The type of attachment to download')
                .addChoices(
                    {name: 'All', value: 'all'},
                    {name: 'Images', value: 'image'},
                    {name: 'Videos', value: 'video'},
                    {name: 'Files', value: 'file'}
                )
                .setRequired(false)
            )
            .addIntegerOption(option =>
                option.setName('limit')
                .setDescription('The maximum number of attachments to download')
                .setMaxValue(100)
                .setMinValue(1)
                .setRequired(false) // Default to 10 images
            )
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        // if (interaction.commandName !== 'configure') {
        //     return
        // }
        console.log(interaction.channel?.messages.cache)
        interaction.channel?.messages.cache.forEach((message) => {
            console.log(message.attachments)
        })
        // console.log(interaction.client.guilds.cache)
    }
}