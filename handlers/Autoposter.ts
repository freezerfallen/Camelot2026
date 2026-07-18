import { Client } from "discord.js";
import { BotHandler } from "../types";
import { AutoPoster } from 'topgg-autoposter';
import { RankTopClient } from '@rank-top/sdk';

const handler: BotHandler = {
    name: "Autoposter",
    execute: async (client: Client) => {

        // Only if Camelot
        if (process.env.CLIENT_ID === "706183309943767112") {

            // POST bot stats to top.gg when configured
            if (process.env.TOPGG_TOKEN?.trim()) {
                const ap = AutoPoster(process.env.TOPGG_TOKEN, client);
                ap.on('posted', (stats) => {
                    console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`);
                });
            } else {
                console.warn('[Top.gg] Autoposter disabled: TOPGG_TOKEN is not configured.');
            };

            // POST bot stats to rank.top when configured
            if (process.env.RANK_API_KEY?.trim() && process.env.RANK_AUTH?.trim()) {
                const rankTop = new RankTopClient({
                    apiKey: process.env.RANK_API_KEY
                });
                rankTop.startAutopost({
                    client: client,
                    authorization: process.env.RANK_AUTH
                });
                rankTop.on("autoposter/posted", () => {
                    console.log("[Rank.top] Posted stats");
                });
                rankTop.on("autoposter/error", (error) => {
                    console.log("[Rank.top] Autoposter error:", error);
                });
            } else {
                console.warn('[Rank.top] Autoposter disabled: RANK_API_KEY and RANK_AUTH are not configured.');
            };
        };

    },
};

export default handler;
