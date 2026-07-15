import { EmbedBuilder } from "discord.js";
import { achievements } from "../Modules/achievements";
import { search, rarityColor } from "../Modules/functions";
import { SlashCommand } from '../types';
import { getCharacterSchemasOfUser, updateUsersAndCache } from '../Modules/queries';

function parsePrintChoice(choice: string) {
    const match = choice.trim().match(/^(.*?)`?\s*#\s*(\d+)`?$/);
    if (!match) return { name: choice.trim() };
    return { name: match[1].trim(), print: Number(match[2]) };
};

const exportCommand: SlashCommand = {
    name: 'fav',
    skipUserRefetch: true,
    skipServerRefetch: true,
    async execute({ interaction, author }) {

        const choice = interaction.options.getString('character', true);

        const stats = author.schema;

        const char = search(choice, stats.chars, interaction);
        if (!char) return;

        const parsed = parsePrintChoice(choice);

        if (char.rarity === "VIP") {
            const vipChars = await getCharacterSchemasOfUser(interaction.user.id);
            if (parsed.print !== undefined) {
                const owned = vipChars.find((e) => e.charid === char.id && e.print === parsed.print);
                if (!owned) return interaction.reply(`You don't have a copy of **${char.name}#${parsed.print}**`);
            } else {
                const owned = vipChars.find((e) => e.charid === char.id);
                if (!owned) return interaction.reply(`You don't have a copy of **${char.name}**`);
            };
        } else {
            if (!stats.chars.includes(char.id)) return interaction.reply(`You don't have a copy of **${char.name}**`);
        };

        const displayName = parsed.print !== undefined ? `${char.name}#${parsed.print}` : char.name;

        const thumbnail = char.getImage(stats.premium, stats.custom_skins[char.id], stats.char_skin[char.id]);

        const Embed = new EmbedBuilder()
            .setColor(rarityColor(char.rarity))
            .setDescription(`Favourite character set to \n**${displayName}**`)
            .setImage(thumbnail);
        interaction.reply({ embeds: [Embed] });

        await updateUsersAndCache(interaction.client, interaction.user.id, {
            updates: {
                favchar: { type: "set", value: char.id }
            },
        });

        // Achievements
        achievements[46].check(interaction); // First Steps
    },
};

export default exportCommand;
