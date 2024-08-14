// @ts-nocheck
import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, MessageContextMenuCommandInteraction, AutocompleteInteraction, ContextMenuCommandBuilder, ContextMenuCommandType, ApplicationCommandType, ContextMenuCommandInteraction, IntegrationApplication, Guild, User, CacheType, InteractionResponse, Client, TextChannel } from 'discord.js';
import { client } from '../../main';

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


        let userDM = interaction.user.dmChannel ?? await interaction.user.createDM()
        let messages = await userDM.messages.fetch()
        let configMessage = Array.from(messages.filter(m => m.content.includes('Quicksave configuration channel set to') && m.author.id === interaction.client.user.id).sort((a, b) => b.createdTimestamp - a.createdTimestamp).values())
        let channelId = (configMessage.length > 0) ? configMessage[0].content.split('Quicksave configuration channel set to ')[1] : null
        // console.log(channelId)
        if (!channelId) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder().setTitle('No Quicksave Channel Set!').setDescription('Set a quicksave output channel using /quicksave configure!').setColor('#FF0000')
                ],
                ephemeral: true
            })
            return
        }
        const channel = await client.channels.fetch(channelId.replace('<#', '').replace('>!', ''))
        if (!channel) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder().setTitle('Channel not found!').setDescription('Set a quicksave output channel using /quicksave configure!').setColor('#FF0000')
                ],
                ephemeral: true
            })
            return
        }

        if (!channel.isTextBased() || channel.isVoiceBased()) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder().setTitle('Selected channel not a text channel!').setDescription('Set a quicksave output channel using /quicksave configure!').setColor('#FF0000')
                ] ,
                ephemeral: true
            })
            return
        }

        if (message.length > 0) {
            channel.send(message)
            interaction.reply({
                embeds: [
                    new EmbedBuilder().setTitle('Success').setDescription(`Message sent to quicksave output channel ${channel}!`).setColor(0x50C878)
                ],
                ephemeral: true
            })
        }
        else {
            interaction.reply({
                embeds: [
                    new EmbedBuilder().setTitle('Error').setDescription(`No attachments found in target message!`).setColor(0xD2042D)
                ],
                ephemeral: true
            })
        }
    }
}