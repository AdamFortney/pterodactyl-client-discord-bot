import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, ComponentType } from 'discord.js';
import { serverSelectMenu } from '../components/serverSelect.js';
import { getServerUsage } from '../../pteroComponents/serverUsage.js'
import { sendPowerCommand } from '../../pteroComponents/serverCommands.js';
import { powerActionRow } from '../components/serverPowerActions.js';
import { serverUsageEmbed } from '../components/usageEmbed.js';
import "dotenv/config";

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

    
    } catch { 
        try { 
            // Catch error or timeout
            await interaction.editReply({ content: '', components: [], embeds: [{title: "Interaction timed out."}]})
        } catch(error) {
            // Catch reply error and log
            if(error.rawError.message == 'Unknown Message') {console.log('Unable to find message')}
            else {console.log('An unknown error occured: ' + error)};
        }
    }
    
}

// Main action menu
async function serverActionMenu(interaction, selectedServer, manualState){

    // Creates reply content from functions
    let serverData = await getServerUsage(selectedServer);

    // Server state overwrite to counter the slow response of the api
    let stateOverwrite = false
    if (!manualState) {}
    else if (serverData.uptime.uptime != manualState.time) {}
    else if (manualState.state == 'stop') {
        serverData.status = 'stopping'
        stateOverwrite = true
    } 
    else if (manualState.state == 'kill') {
        serverData.status = 'offline'
        serverData.uptime.days = 0
        serverData.uptime.hours = 0
        serverData.uptime.minutes = 0
        serverData.uptime.seconds = 0
        stateOverwrite = true
    }
    else if (manualState.state == 'start') {
        serverData.status = 'starting'
        stateOverwrite = true
    } else if (manualState.state == 'restart') {
        serverData.status = 'starting'
        stateOverwrite = true
    }

    // Gets interaction components
    const actionRow = powerActionRow(serverData)
    const usageEmbed = serverUsageEmbed(serverData)

    // Replaces message with updated server action
    const serverAction = await interaction.update({
        content: ``,
        embeds: [usageEmbed],
        components: [actionRow],
        withResponse: true,
    })

    // Waits for action or timeout after 600s (10m)
    try { const actionResponse = await serverAction.resource.message.awaitMessageComponent({ time: 120_000 });
    
    // If 'menu' button > change to select menu
    if (actionResponse.customId == 'menu') { controlSelectMenu(actionResponse) } 

    // If server action button
    else if (actionResponse.customId != 'reload') {
        // Run server action
        await sendPowerCommand(selectedServer, actionResponse.customId)
        
        // Set manual server state
        let commandState = {
            state: `${actionResponse.customId}`,
            time: serverData.uptime.uptime
        }

        // Refresh action menu
        serverActionMenu(actionResponse, selectedServer, commandState); 
    }
    
    // If other button (applies to 'reload' button) only refresh menu
    else { 
        if (stateOverwrite) {serverActionMenu(actionResponse, selectedServer, manualState)} else {serverActionMenu(actionResponse, selectedServer)}
    };

    // Catch error or timeout
    } catch {
    try { 
        // Catch error or timeout
        await interaction.editReply({ content: '', components: [], embeds: [{title: "Interaction timed out."}]})
    } catch(error) {
        // Catch reply error and log
        if(error = 'Unknown Message') {console.log('Unable to find message')}
        else {console.log('An unknown error occured: ' + error)};
    }
}

}

// Return to server select function
async function controlSelectMenu(interaction) {

    // Retrieves select menu items
    const selectMenu = await serverSelectMenu(interaction)

    // Updates the interaction with the menu
    const serverSelect = await interaction.update({
        content: '',
        components: [selectMenu],
        embeds: [{title: "Which server you would like to manage?"}],
        withResponse: true,
    });

    // Wait for response and performs action
    try { const selectResponse = await serverSelect.resource.message.awaitMessageComponent({ componentType: ComponentType.StringSelect, time: 120_000 });
        
    // Passes the rest of the command back off to the control action menu
    let selectedServer = selectResponse.values[0];
    serverActionMenu(selectResponse, selectedServer);

    // Catch error or timeout
    } catch {
    try { 
        // Catch error or timeout
        await interaction.editReply({ content: '', components: [], embeds: [{title: "Interaction timed out."}]})
    } catch(error) {
        // Catch reply error and log
        if(error.rawError.message == 'Unknown Message') {console.log('Unable to find message')}
        else {console.log('An unknown error occured: ' + error)};
    }
}
}