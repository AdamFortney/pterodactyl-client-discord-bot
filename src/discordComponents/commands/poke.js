import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('poke')
	.setDescription('Checks to see if the bot is alive.');

export async function execute(interaction) {
	await interaction.reply(`I'm alive!!`);
}