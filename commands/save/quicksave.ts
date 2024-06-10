import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, MessageContextMenuCommandInteraction, AutocompleteInteraction, ContextMenuCommandBuilder, ContextMenuCommandType, ApplicationCommandType, ContextMenuCommandInteraction, IntegrationApplication, Guild, User, CacheType, InteractionResponse } from 'discord.js';

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Quicksave')
        .setType(ApplicationCommandType.Message),

    async execute(interaction: MessageContextMenuCommandInteraction) {
        console.log(interaction.targetMessage.attachments.size)
        const reply = (interaction.targetMessage.attachments.size > 0) ? interaction.targetMessage.attachments.map(attachment => attachment.url).join('\n') : null
        console.log(interaction.targetMessage.attachments.size)
        interaction.reply(reply ?? {embeds: [new EmbedBuilder().setTitle('Error').setDescription('No images found in target message!').setColor(0x50C878)]} )
    }
}