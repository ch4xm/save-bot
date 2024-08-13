import { SlashCommandBuilder, TextChannel, EmbedBuilder, ChatInputCommandInteraction, AutocompleteInteraction, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } from 'discord.js';
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
    ,
    async autocomplete(interaction: AutocompleteInteraction) {

    },

    async execute(interaction: ChatInputCommandInteraction) {
        // if (interaction.commandName !== 'configure') {
        //     return
        // }
        // console.log(interaction.client.guilds.cache)
        // console.log(interaction.client.guilds.cache)
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
            (channel as TextChannel).send('Hello world!')
        })
    }
}