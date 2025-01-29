import { SlashCommandBuilder, ComponentType } from 'discord.js';
import { serverSelectMenu } from '../interactions/serverSelect.js';
import { serverActionMenu } from '../interactions/quickControl.js';

// Creates command in list
export const data = new SlashCommandBuilder()
    .setName('control')
    .setDescription('Control Game Server');


// Command action when executed
export async function execute(interaction) {

    // Gets serverSelectMenu dropdown
    const selectMenu = await serverSelectMenu(interaction);
    
    // Replys to command with the dropdown menu
    const serverSelect = await interaction.reply({
        content: '',
        components: [selectMenu],
        embeds: [{title: "Which server would you like to manage?"}],
        withResponse: true,
    });

    // Waits for response or timeout after 120s
	try { const selectResponse = await serverSelect.resource.message.awaitMessageComponent({ componentType: ComponentType.StringSelect, time: 120_000 });
    
    // Passes the rest of the command off to the quickControl action menu
    let selectedServer = selectResponse.values[0];
    serverActionMenu(selectResponse, selectedServer);

    // Catch error or timeout
    } catch { await interaction.editReply({ content: '', components: [], embeds: [{title: "Interaction timed out."}] })}
    
}
