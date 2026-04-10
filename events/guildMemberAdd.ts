import { Client, ActivityType, GuildMember } from "discord.js";
import { BotEvent } from "../types";

const event: BotEvent = {
    name: "guildMemberAdd",
    disabled: true,
    execute: (member: GuildMember) => {

        // Only if Camelot
        if (process.env.CLIENT_ID !== "706183309943767112") return;

        if (member.guild.id === "927257132624130119") {
            const welcomeChannelId = '1153393405657894953';
            const channel = member.guild.channels.cache.get(welcomeChannelId);
            if (channel?.isSendable()) channel.send(`Hey ${member.user.toString()}, welcome to the official server of <@706183309943767112> <:KotoWave:1025884105281372260>`);
        };

    },
};

export default event;
