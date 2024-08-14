import { SlashCommandBuilder, TextChannel, EmbedBuilder, ChatInputCommandInteraction, AutocompleteInteraction, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, DMChannel } from 'discord.js';
import { Modal, TextInputComponent, SelectMenuComponent, showModal } from 'discord-modals'
// import { ese}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('quicksave')
        .setDescription('Run on a message to save the contained image to the specified server and channel')
        .addSubcommand(subcommand =>
            subcommand
            .setName('configure')
            .setDescription('Set the server and channel to save images to')
            // .addStringOption(option =>
            //     option.setName('server')
            //     .setDescription('The server to save the image to')
            //     .setRequired(true)
            //     .setAutocomplete(true)
            // )
            // .addStringOption(option =>
            //     option.setName('channel')
            //     .setDescription('Channel to save image to')
            //     .setRequired(true)
            //     .setAutocomplete(true)
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName('info')
            .setDescription('Get the current server and channel configuration')
        )
    ,
    async autocomplete(interaction: AutocompleteInteraction) {

    },

    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.options.getSubcommand() === 'configure') {
            this.configure(interaction)
        }
        else if (interaction.options.getSubcommand() === 'info') {
            this.info(interaction)
        }
    },

    async configure(interaction: ChatInputCommandInteraction) {
        const serverSelectBox = new StringSelectMenuBuilder()
            .setCustomId('server-select')
            .setPlaceholder('Select target server...')
            .addOptions(
                interaction.client.guilds.cache.map((guild) => {
                        return {
                            label: interaction.client.guilds.cache.get(guild.id)?.name ?? 'Invalid Server Name',
                            description: guild.id,
                            value: guild.id
                        }
                        
                })
            )
        // const serverSelectBox = new StringSelectMenuBuilder()
        //     .setCustomId('server-select')
        //     .setPlaceholder('Select target server...')
        //     .addOptions(
        //         {label: 'Select a target server first!'}
        //     )
        
        const serverSelectRow = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(serverSelectBox)
        
        await interaction.reply({
            content: 'Quicksave Server/Channel Configuration',
            components: [serverSelectRow],
            ephemeral: true
        });

        interaction.client.on('interactionCreate', async (interaction) => {
            if (!interaction.isStringSelectMenu() || interaction.customId != 'server-select') return;
            const serverId = interaction.values[0]
            const server = interaction.client.guilds.cache.get(serverId)

            if (!server) {
                await interaction.update({
                    content: 'Selected server not found!',
                    components: [],
                });
                return;
            }

            const channelSelectBox = new StringSelectMenuBuilder()
                .setCustomId('channel-select')
                .setPlaceholder('Select target channel...')
                .addOptions(
                    server.channels.cache
                        .filter(channel => channel.isTextBased() && !channel.isVoiceBased())
                        .map((channel) => {
                            return {
                                label: channel.name,
                                description: channel.id,
                                value: channel.id
                            }
                        })
                )
            const channelSelectRow = new ActionRowBuilder<StringSelectMenuBuilder>()
                .addComponents(channelSelectBox);
            await interaction.reply({
                content: 'Select a channel from the selected server:',
                components: [channelSelectRow],
                ephemeral: true
            });
        })

        interaction.client.on('interactionCreate', async (interaction) => {
            if (!interaction.isStringSelectMenu() || interaction.customId != 'channel-select') return;
            const channelId = interaction.values[0]
            const channel = interaction.client.channels.cache.get(channelId)

            if (!channel) {
                await interaction.update({
                    content: 'Selected channel not found!',
                    components: [],
                });
                return;
            }
            if (!channel.isTextBased()) {
                await interaction.update({
                    content: 'Selected channel is not a text channel!',
                    components: [],
                });
                return;
            }

            await interaction.update({
                content: `Channel ${channel} selected for quicksave output!`,
                components: [],
            });
            let userDM = interaction.user.dmChannel ?? await interaction.user.createDM();
            let messages = (await userDM.messages.fetch())
            let configMessage = Array.from(messages.filter(m => m.content.includes('Quicksave configuration channel set to') && m.author.id === interaction.client.user.id).sorted((a, b) => b.createdTimestamp - a.createdTimestamp).values())
            console.log(configMessage, typeof configMessage[0], configMessage.length)
            if (configMessage.length > 0) {
                configMessage[0].edit(`Quicksave configuration channel set to ${channel}!`)
            }
            else{
                userDM.send(`Quicksave configuration channel set to ${channel}!`)
            }
        })
    },
    async info(interaction: ChatInputCommandInteraction) {
        let userDM = interaction.user.dmChannel ?? await interaction.user.createDM();
        let messages = await userDM.messages.fetch() 
        let configMessage = Array.from(messages.filter(m => m.content.includes('Quicksave configuration channel set to') && m.author.id === interaction.client.user.id).sorted((a, b) => b.createdTimestamp - a.createdTimestamp).values())
            // messages = Array.from(messages.filter(m => m.author.id === interaction.client.user.id))

        if (configMessage.length > 0) {
            const savedChannel = configMessage[0].content.split('Quicksave configuration channel set to ')[1]

            interaction.reply({
                content: `Quicksave configuration channel set to ${savedChannel}`,
                ephemeral: true
            })            
        }
        else {
            interaction.reply({
                embeds: [
                    new EmbedBuilder().setTitle('No Quicksave Channel Set!').setDescription('Set a quicksave output channel using /quicksave configure!').setColor('#FF0000')
                ],
                ephemeral: true
            })
            return
        }
    },


    // async getUserDM(interaction: ChatInputCommandInteraction) {
    //     let userDM = interaction.user.dmChannel ?? await interaction.user.createDM();
    //     return userDM
    // },

    // async getConfigMessage(interaction: ChatInputCommandInteraction) {
    //     let userDM = this.getUserDM(interaction)
    //     let messages = (await userDM.messages.fetch())
    //     let configMessage = Array.from(messages.filter(m => m.content.includes('Quicksave configuration channel set to') && m.author.id === interaction.client.user.id).sorted((a, b) => b.createdTimestamp - a.createdTimestamp).values())
    //     return configMessage
    // }

}