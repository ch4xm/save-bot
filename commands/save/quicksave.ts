// @ts-nocheck
import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, MessageContextMenuCommandInteraction, AutocompleteInteraction, ContextMenuCommandBuilder, ContextMenuCommandType, ApplicationCommandType, ContextMenuCommandInteraction, IntegrationApplication, Guild, User, CacheType, InteractionResponse } from 'discord.js';

const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g//

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Quicksave')
        .setType(ApplicationCommandType.Message),

    async execute(interaction: MessageContextMenuCommandInteraction) {

        const attachments = (interaction.targetMessage.attachments.size > 0) ? interaction.targetMessage.attachments.map(attachment => attachment.url).join('\n') : null
        const links = [...interaction.targetMessage.content.matchAll(URL_REGEX)]
        let message: str = ''
        if (links.length > 0) {
            message += links.map(link => link[0]).join('\n')
        }
        if (attachments) {
            message += attachments
        }
        interaction.reply((message.length > 0) ? message : {embeds: [new EmbedBuilder().setTitle('Error').setDescription('No images found in target message!').setColor(0x50C878)]} )
    }
}