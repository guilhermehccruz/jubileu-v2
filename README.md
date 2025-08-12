# jubileu-v2

This is my personal bot, mainly used to listen to music with my friends on discord.

This project uses typescript, discordx, docker and lavalink.

## Installing

### Set environment variables

Create a `.env` file based on `.env.example` and fill its variables

### Install dependencies

Run `pnpm i`

### Initiate docker

#### Start lavalink

Run `docker compose up lavalink -d`

#### Start the bot

The bot can be ran directly with `pnpm start:dev` or with docker `docker compose up bot -d`
