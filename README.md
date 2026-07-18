# Camelot

Camelot is a large Discord dungeon RPG and character-collection game inspired by anime, manga, games, and Arthurian fantasy. Players collect and upgrade characters, explore dungeons, fight in several game modes, trade, form parties and guilds, complete quests, and participate in recurring and seasonal events.

This repository contains the source code for Camelot 2.7.0. It is published as a historical and technical reference for the project.

> [!IMPORTANT]
> **Public source does not mean open source.** No open-source license is granted for this repository. Unless a file explicitly says otherwise, the code and original project material are copyright of their respective authors and may not be copied, modified, redistributed, or used to operate another service without permission. Third-party names, characters, artwork, trademarks, and other material remain the property of their respective owners.

## Features

- Character collecting with multiple rarities, refinement, leveling, favorites, skins, and profile customization
- Interactive dungeon, arena, trial, raid, boss, and seasonal combat
- Classes, abilities, skill trees, equipment, crafting, curses, and character builds
- Parties, guilds, trading, auctions, referrals, leaderboards, and an in-game economy
- Daily and weekly quests, achievements, login rewards, events, and vote rewards
- Generated profile graphics and optional AI-assisted image features
- PostgreSQL persistence, automatic sharding, runtime caching, and scheduled game jobs
- Optional Patreon, Top.gg, Rank.top, OpenRouter, Runware, and Gemini integrations

## Technology

- [Node.js](https://nodejs.org/) and TypeScript
- [discord.js](https://discord.js.org/) 14
- PostgreSQL
- Canvas and Sharp for image processing
- Express for local and external webhook endpoints
- PM2 for the production process definition

## Project status

Camelot grew as a production bot over several years. The code reflects the infrastructure and Discord resources used by the original deployment, including hard-coded command, emoji, guild, channel, and integration identifiers. A separate deployment will require configuration and may require replacing Camelot-specific Discord resources.

The repository currently has no automated test suite. TypeScript compilation is the primary automated verification step.

## Requirements

- Node.js 20.9 or newer
- npm
- PostgreSQL running on the same host
- A Discord application and bot token
- Native build prerequisites required by `canvas` if a prebuilt binary is unavailable for your platform

## Setup

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Create an empty PostgreSQL database and a PostgreSQL user with permission to create and modify objects in it. The application creates its tables, indexes, and triggers during startup.

3. Copy the environment template:

   ```bash
   cp .env.example .env
   ```

   On PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

4. Set at least the required values in `.env`:

   | Variable | Required | Purpose |
   | --- | --- | --- |
   | `CLIENT_ID` | Yes | Discord application ID |
   | `TOKEN` | Yes | Discord bot token |
   | `PG_USER` | Yes | PostgreSQL user |
   | `PG_DATABASE` | Yes | PostgreSQL database |
   | `PG_PASSWORD` | Yes | PostgreSQL password |
   | `PG_PORT` | No | PostgreSQL port; defaults to `5432` |
   | `ADMINS` | Yes | Comma-separated Discord user IDs allowed to use owner commands |
   | `PATREON_TOKEN` | No | Enables Patreon synchronization when paired with a campaign ID |
   | `PATREON_CAMPAIGN_ID` | No | Patreon campaign identifier |
   | `TOPGG_AUTH` | No | Verifies Top.gg vote webhooks |
   | `TOPGG_TOKEN` | No | Enables Top.gg statistics posting |
   | `RANK_AUTH` | No | Verifies Rank.top webhooks and shop events |
   | `RANK_API_KEY` | No | Enables Rank.top statistics posting |
   | `OPENROUTER_API_KEY` | No | Enables AI prompt enhancement |
   | `RUNWARE_SOURCE` | No | Runware model source prefix |
   | `RUNWARE_API_KEY` | No | Enables image generation |
   | `GEMINI_API_KEY` | No | Google Gemini integration key |
   | `STAMPS_PORT` | No | Local stamp service port; defaults to `3001` |

5. Build the project:

   ```bash
   npm run build
   ```

6. Register the global slash commands for the configured Discord application:

   ```bash
   node slash.js
   ```

   Global command changes can take time to propagate through Discord. Running this script replaces the application's global command definitions with those declared in `slash.js`.

7. Start the bot:

   ```bash
   npm start
   ```

At startup, Camelot validates the required environment variables, creates missing runtime files under `Storage/`, and initializes the PostgreSQL schema.

## Development

Compile once without starting the bot:

```bash
npm run build
```

Watch TypeScript files and rebuild on changes:

```bash
npm run dev
```

Run a type check without writing build output:

```bash
npx tsc --noEmit
```

## Production with PM2

The included process definition runs `build/camelot.js`, enables automatic restarts, and gives Node an 8 GB heap limit:

```bash
npm run build
pm2 start ecosystem.config.js
```

After deploying source changes, rebuild before restarting the PM2 process.

## Optional services and ports

- Vote webhooks listen on port `3000` when Top.gg or Rank.top authentication is configured.
- The Rank.top shop webhook listens on port `3010` when `RANK_AUTH` is configured.
- The stamp service binds only to `127.0.0.1` and defaults to port `3001`.

Public webhook listeners should be placed behind HTTPS and an appropriately configured reverse proxy or firewall.

## Repository layout

```text
camelot.ts          Application entry point
postgres.ts         PostgreSQL schema and connection setup
slash.js            Global Discord command registration
events/             Discord gateway event handlers
handlers/           Startup services, integrations, and scheduled jobs
slashCommands/      Command implementations
Modules/            Game data, mechanics, rendering, and shared utilities
src/@types/         Local declarations for packages without suitable types
Storage/            Runtime state; generated locally and excluded from Git
build/              Compiled JavaScript; generated locally and excluded from Git
```

## Contributing

Bug reports, documentation improvements, and focused pull requests are welcome. Because Camelot is a public-source project rather than an open-source project, public access to the repository does not grant permission to reuse its code outside contributions made back to Camelot.

Before starting a substantial change, open an issue describing the problem, proposed solution, and any compatibility concerns. This avoids duplicated work and provides an opportunity to confirm that the change fits the project.

### Development workflow

1. Fork the repository and create a focused branch from the current default branch.
2. Install the locked dependencies with `npm ci`.
3. Copy `.env.example` to `.env` and use development-only credentials and data.
4. Make the smallest practical change that addresses the issue.
5. Verify that TypeScript compiles:

   ```bash
   npx tsc --noEmit
   npm run build
   ```

6. Manually test the affected Discord commands or background services with a development bot and database.
7. Open a pull request explaining what changed, why it changed, how it was tested, and any migration or deployment steps.

### Pull request guidelines

- Keep unrelated refactors and formatting changes out of the pull request.
- Follow the existing TypeScript style and preserve strict type checking.
- Update documentation and `.env.example` when configuration or behavior changes.
- Never include generated `build/` output, `node_modules/`, runtime `Storage/` files, production database contents, or real credentials.
- Avoid adding new dependencies unless the benefit and maintenance cost are explained.
- Include screenshots for user-facing visual changes when they help reviewers verify the result.
- Call out database schema changes, new Discord permissions or intents, public network listeners, and breaking command changes explicitly.

Contributors must have the right to submit everything included in their contribution. By submitting a contribution, you agree that it may be reviewed, modified, and incorporated into Camelot and distributed as part of the project under the repository's existing terms. This does not grant permission to publish or operate a separate copy of Camelot.

## Security and private data

Never commit any of the following:

- `.env` or API credentials
- Discord bot tokens or webhook authentication secrets
- PostgreSQL dumps or SQLite databases
- Files from `Storage/`
- User, guild, payment, vote, or moderation data

If a credential is committed, revoke or rotate it immediately. Deleting the file in a later commit is not sufficient because it remains available in Git history.

## Rights and attribution

Copyright © Camelot's authors. All rights reserved.

This repository does not provide a license to reproduce, redistribute, modify, host, or commercially use the project. Its public availability is for viewing, preservation, and discussion only. References to third-party franchises and services do not imply endorsement or ownership.
