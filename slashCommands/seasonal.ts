import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ContainerBuilder, MessageFlags } from "discord.js";
import { SlashCommand } from "../types";
import { botPfp } from "../Modules/components";
import { customHpBars } from "../Modules/customHpBars";

const embedColor = 0x2aad9d;

type SeasonalShopTab = 'runes' | 'hpbars' | 'backgrounds' | 'skins';

const getSeasonalShopButtonRow = (currentTab: SeasonalShopTab) => {
    const rowButtons = [
        // { id: 'runes', label: 'Runes', emoji: '<:example_rune:1087093666130169997>' },
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
            { name: "Falling Leaves", id: 4, price: 500, isNew: true },
            { name: "Autumn Leaves", id: 5, price: 500, isNew: true },
            { name: "Coffee Brew", id: 1, price: 500, isNew: true },
            { name: "Pinkish Fantasy", id: 2, price: 500, isNew: true },
            { name: "Golden Grasslands", id: 3, price: 500, isNew: true },
            // { name: "Default", id: 0, price: 200, isNew: false },
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
        // TODO: Add backgrounds tab
    } else if (currentTab === 'skins') {
        // TODO: Add skins tab
    };

    return shopContainer;
};

export const exportCommand: SlashCommand = {
    name: 'seasonal',
    async execute({ interaction, author }) {

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
            });
        });

    },
};

export default exportCommand;
