// @ts-nocheck
import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, MessageContextMenuCommandInteraction, AutocompleteInteraction, ContextMenuCommandBuilder, ContextMenuCommandType, ApplicationCommandType, ContextMenuCommandInteraction, IntegrationApplication, Guild, User, CacheType, InteractionResponse, Client, TextChannel } from 'discord.js';
import { client } from '../../main';

const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g//

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Quicksave')
        .setType(ApplicationCommandType.Message),

    async execute(interaction: MessageContextMenuCommandInteraction) {
        // let stickers = interaction.targetMessage.stickers
        // console.log(stickers)
        const attachments = (interaction.targetMessage.attachments.size > 0) ? interaction.targetMessage.attachments.map(attachment => attachment.url).join('\n') : null
        const links = [...interaction.targetMessage.content.matchAll(URL_REGEX)]
        let message: str = ''
        if (links.length > 0) {
            message += links.map(link => link[0]).join('\n')
        }
        if (attachments) {
            message += attachments
        }
        // interaction.reply(client.channels.cache.toString(),)
        // let channel: TextChannel = client.channels.cache.get('1040033223855591474')
        // if (channel.isText()) {
        //     channel.send('message')
        // }
        client.guilds.cache.forEach((guild: Guild) => {
            console.log(guild.id)
            guild.channels.fetch().then((channels) => {
                channels.forEach((channel: TextChannel) => {
                    console.log(channel.id, channel.name)
                })
            })
            // guild.channels.cache.forEach((channel: TextChannel) => {
                // console.log('channel', channel.id)
            // })
        })
        // channel.send('message')
        // client.channels.cache.get('1040033223855591474')
        interaction.reply((message.length > 0) ? message : {embeds: [new EmbedBuilder().setTitle('Error').setDescription('No images found in target message!').setColor(0x50C878)]} )
    }
}