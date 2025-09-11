import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ContainerBuilder, MessageFlags } from "discord.js";
import { SlashCommand } from "../types";
import { botPfp } from "../Modules/components";
import { customHpBars } from "../Modules/customHpBars";
import { profileSets } from "../Modules/profileDecorations";

const embedColor = 0x2aad9d;

type SeasonalShopTab = 'runes' | 'hpbars' | 'backgrounds' | 'skins';

const getSeasonalShopButtonRow = (currentTab: SeasonalShopTab) => {
    const rowButtons = [
        { id: 'runes', label: 'Runes', emoji: '<:example_rune:1087093666130169997>' },
        { id: 'hpbars', label: 'HP Bars', emoji: '💧' },
        { id: 'backgrounds', label: 'Backgrounds', emoji: '🖼️' },
        { id: 'skins', label: 'Skins', emoji: '✨' },
    ];

    return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            ...rowButtons.map((button) => {
                return new ButtonBuilder()
                    .setCustomId(`tab_${button.id}`)
                    .setLabel(button.label)
                    .setEmoji(button.emoji)
                    .setStyle(currentTab === button.id ? ButtonStyle.Primary : ButtonStyle.Secondary);
            }),
        );
};

const getShopPage = (currentTab: SeasonalShopTab): ContainerBuilder => {
    const shopContainer = new ContainerBuilder()
        .setAccentColor(embedColor)
        .addSectionComponents(section => section
            .addTextDisplayComponents(
                text => text.setContent('# Seasonal Shop'),
                text => text.setContent(`Welcome! Take a look at the seasonal items available for a limited time.\n**Time left**: <t:1758060000:R>`)
            )
            .setThumbnailAccessory(thumbnail => thumbnail.setURL(botPfp))
        )
        .addSeparatorComponents(separator => separator);

    // Customize shop tab layouts

    if (currentTab === 'runes') {
        // TODO: Add runes tab
    } else if (currentTab === 'hpbars') {
        const hpBarsForSale = [
            { name: "Falling Leaves", id: 4, price: 90, isNew: true },
            { name: "Autumn Leaves", id: 5, price: 70, isNew: true },
            { name: "Coffee Brew", id: 1, price: 60, isNew: true },
            { name: "Golden Grasslands", id: 3, price: 60, isNew: true },
        ];

        hpBarsForSale.forEach(hpBar => shopContainer
            .addSectionComponents(section => section
                .addTextDisplayComponents(text => text
                    .setContent(`${hpBar.isNew ? '<:newtwo:1408872814294863933> ' : ''}**${customHpBars[hpBar.id].name}**\n${customHpBars[hpBar.id].getHpBar(0.7, 0.4)}`)
                )
                .setButtonAccessory(button => button
                    .setCustomId(`buy_seasonal_hpbar_${hpBar.id}`)
                    .setLabel('Buy Now')
                    .setStyle(ButtonStyle.Primary)
                )
            )
        );

    } else if (currentTab === 'backgrounds') {
        const backgroundsForSale = [
            { name: "Eternal Autumn", id: 12, price: 60, isNew: true },
            { name: "Shades of Rust", id: 10, price: 90, isNew: true },
            { name: "Autumn Forest", id: 11, price: 70, isNew: true },
        ];

        backgroundsForSale.forEach(background => shopContainer
            .addSectionComponents(section => section
                .addTextDisplayComponents(text => text
                    .setContent(`${background.isNew ? '<:newtwo:1408872814294863933> ' : ''}**${background.name}**\nBackgrounds: ${profileSets[background.id].assets.length}`)
                )
                .setButtonAccessory(button => button
                    .setCustomId(`redirect_bg_${background.id}`)
                    .setLabel('View Backgrounds')
                    .setStyle(ButtonStyle.Primary)
                )
            )
        );

    } else if (currentTab === 'skins') {
        // TODO: Add skins tab
    };

    return shopContainer;
};

export const exportCommand: SlashCommand = {
    name: 'seasonal',
    async execute({ interaction, author, server, locale }) {

        let currentTab: SeasonalShopTab = 'hpbars';

        return interaction.reply({ components: [getShopPage(currentTab), getSeasonalShopButtonRow(currentTab)], flags: MessageFlags.IsComponentsV2 }).then(async (msg) => {
            const collector = msg.createMessageComponentCollector({ filter: (r) => r.user.id === interaction.user.id, componentType: ComponentType.Button, time: 120000 });

            collector.on('collect', async (r) => {
                if (r.customId.startsWith('tab_')) {
                    currentTab = r.customId.split('_')[1] as SeasonalShopTab;
                    await msg.edit({ components: [getShopPage(currentTab), getSeasonalShopButtonRow(currentTab)] });
                };

                if (r.customId.startsWith('buy_')) {
                    // do something
                };

                if (r.customId.startsWith('redirect_bg_')) {
                    const backgroundId = parseInt(r.customId.split('_')[2]);
                    const background = profileSets[backgroundId];

                    // Modify command details
                    interaction.commandName = 'background';
                    // @ts-ignore
                    interaction.options._subcommand = 'search';
                    // @ts-ignore
                    interaction.options._hoistedOptions = [
                        { name: 'name', type: 3, value: background.name },
                        { name: 'type', type: 3, value: 'set' }
                    ];
                    interaction.deferred = true;

                    // Slash Commands
                    const command = interaction.client.slashCommands.get(interaction.commandName) as SlashCommand | undefined;
                    if (command) command.execute({ interaction, author, server, locale });
                };
            });
        });

    },
};

export default exportCommand;
