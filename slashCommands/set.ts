import { classLevelToXP, userLevelToXP } from '../Modules/functions';
import { updateUsers } from '../Modules/queries';
import { SlashCommand } from '../types';

const exportCommand: SlashCommand = {
    name: 'set',
    async execute({ interaction, author }) {

        // Command can only be used in the test bot
        if (interaction.client.user.id !== "695286837568340119") return interaction.reply("This command can only be used in Elder");

        const subcommand = interaction.options.getSubcommand();
        const value = interaction.options.getInteger('value', true);

        if (subcommand === "level") {
            if (value < 1 || value > 2000) return interaction.reply("Please provide a value between 1 and 2'000");

            // Update users table
            await updateUsers(interaction.user.id, {
                level: { type: "set", value },
            });

            return interaction.reply(`Successfully set your level to **${value}**`);
        };

        if (subcommand === "clvl") {
            if (value < 1 || value > 15000) return interaction.reply("Please provide a value between 1 and 15'000");

            const currentClass = author.schema.class;
            if (!currentClass) return interaction.reply("You don't have a class equipped");

            // Update users table
            author.schema.dungeon_classlevels[currentClass] = classLevelToXP(value);
            await updateUsers(interaction.user.id, {
                dungeon_classlevels: { type: "set", value: author.schema.dungeon_classlevels },
            });

            return interaction.reply(`Successfully set your class level to **${value}**`);
        };

        if (subcommand === "acclvl") {
            if (value < 1 || value > 120) return interaction.reply("Please provide a value between 1 and 120");

            // Update users table
            await updateUsers(interaction.user.id, {
                xp: { type: "set", value: userLevelToXP(value) },
            });

            return interaction.reply(`Successfully set your account level to **${value}**`);
        };

    },
};

export default exportCommand;
