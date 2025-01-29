import { REST, Routes } from 'discord.js';
import "dotenv/config";
import fs from 'fs';

export async function deployCommands(){
    const commands = [];
    try { 
        const commandFiles = fs.readdirSync(`./src/discordComponents/commands/`).filter(file => file.endsWith('.js')); 
        for (const file of commandFiles) {
            const command = await import(`./commands/${file}`);
            const { data, execute } = command
            if (data && execute) {
                commands.push(data.toJSON());
            } else {
                console.log(`The command at ./commands/${file} is missing a required property.`);
            };
        };
    }
    catch (error) { console.log('Failed retrieving files from the "commands" directory.'); console.error(error); };

    const rest = new REST().setToken(process.env.botToken);

    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
            const data = await rest.put(
                Routes.applicationGuildCommands(process.env.botClientID, process.env.botServerID),
                { body: commands },
            );
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) { console.log('Is the bot in the server?'); console.log(`Invite link: https://discord.com/oauth2/authorize?client_id=${process.env.botClientID}&permissions=0&scope=bot%20applications.commands`); }
    })();
}