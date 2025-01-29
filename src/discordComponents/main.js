import "dotenv/config";
import fs from 'fs';
import { Client, Collection, Events, GatewayIntentBits, REST, Routes } from 'discord.js';
import { deployCommands } from "./deploy-commands.js";

// Starts bot
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`)
})

// Authenticates with token
client.login(process.env.botToken);

// Runs deploy command script to update slash commands
deployCommands();

// Imports discord command files for running commands
client.commands = new Collection();
const commandFiles = fs.readdirSync(`./src/discordComponents/commands/`).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = await import(`./commands/${file}`);
	const { data, execute } = command;
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if (data && execute) {
		client.commands.set(data.name, { data, execute });
	} else {
		console.log(`The command at ./commands/${file} is missing a required property.`);
	};
};

// Discord command listener and execution
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try { await command.execute(interaction); } 
	catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		};
	};
});