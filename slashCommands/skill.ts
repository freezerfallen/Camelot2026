import { getUserSchema } from '../Modules/queries';
import { SlashCommand } from '../types';

const exportCommand: SlashCommand = {
    name: 'skill',
    async execute({ interaction, author }) {

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'tree') {
            const user = interaction.options.getUser('user') ?? interaction.user;

            const stats = user.id === interaction.user.id ? author.schema : await getUserSchema(user.id);


        };

    },
};

export default exportCommand;
