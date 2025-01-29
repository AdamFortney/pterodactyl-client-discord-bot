import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { getServerUsage } from '../../pteroComponents/serverUsage.js'
import { sendPowerCommand } from '../../pteroComponents/serverCommands.js';
import { serverSelectMenu } from '../interactions/serverSelect.js';
import "dotenv/config";

// Function called by control.js for server control
export async function serverActionMenu(interaction, selectedServer, manualState){

    // Creates reply content from functions
    let serverData = await getServerUsage(selectedServer);

    // Server state overwrite to counter the slow response of the api
    let stateOverwrite = false
    if (!manualState) {}
    else if (new Date().getTime() >= Number(manualState.time) + 25 * 1000) {}
    else if (manualState.state == 'stop' && serverData.status != 'offline') {
        serverData.status = 'stopping'
        stateOverwrite = true
    } 
    else if (manualState.state == 'kill' && serverData.status != 'offline') {
        serverData.status = 'offline'
        serverData.uptime.days = 0
        serverData.uptime.hours = 0
        serverData.uptime.minutes = 0
        serverData.uptime.seconds = 0
        stateOverwrite = true
    }
    else if (manualState.state == 'start' && serverData.status == 'offline') {
        serverData.status = 'starting'
        stateOverwrite = true
    };

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
    try { const actionResponse = await serverAction.resource.message.awaitMessageComponent({ time: 600_000 });
    
    // If 'menu' button > change to select menu
    if (actionResponse.customId == 'menu') { controlSelectMenu(actionResponse) } 

    // If server action button, run server action and refresh the menu
    else if (actionResponse.customId != 'reload') {
        await sendPowerCommand(selectedServer, actionResponse.customId)
        
        let commandState = {
            state: `${actionResponse.customId}`,
            time: `${new Date().getTime()}`
        }
        //commandState.time = new Date().toLocaleString();
        serverActionMenu(actionResponse, selectedServer, commandState); 
    }
    
    // If other button (applies to 'reload' button) only refresh menu
    else { 
        if (stateOverwrite) {serverActionMenu(actionResponse, selectedServer, manualState)} else {serverActionMenu(actionResponse, selectedServer)}
    };

    // Catch error or timeout
    } catch { await interaction.editReply({ content: '', components: [], embeds: [{title: "Interaction timed out."}] }); }

}

async function controlSelectMenu(interaction) {

    // Retrieves select menu item
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
    } catch { await interaction.editReply({ content: '', components: [], embeds: [{title: "Interaction timed out."}] }); }
}

function serverUsageEmbed(serverData) {
    let color = 0xB3B3B3;
    switch(serverData.status) { 
        case 'running': 
            color = 0x1DB522; 
            break; 
        case 'offline': 
            color = 0xB3B3B3; 
            break;
        case 'stopping':
            color = 0xE03A3A; 
            break;
        case 'starting':
            color = 0x3A45E0; 
            break;
        default:
            break;
    }

    let uptime = ''
    uptime += serverData.uptime.days > 0 ? `${serverData.uptime.days}d ` : ``
    uptime += serverData.uptime.hours > 0 ? `${serverData.uptime.hours}h ` : ``
    uptime += serverData.uptime.minutes > 0 ? `${serverData.uptime.minutes}m ` : ``
    uptime += serverData.uptime.seconds > 0 ? `${serverData.uptime.seconds}s` : ``
    if (uptime.length == 0) {
        uptime = 'Offline'
    }

    const usageEmbed = {
        color: color,
        title: `${((serverData.name).length > 27) ? `${(serverData.name).slice(0,26)}...` : `${serverData.name}`}`,
        description: `--------------------------------------`,
        url: `${process.env.pteroURL}/server/${serverData.serverID}`,
        fields: [
            {
                name: `State`,
                value: `${serverData.status.replace(/^./, char => char.toUpperCase())}`,
                inline: true,
            },
            {
                name: `Uptime`,
                value: `${uptime}`,
                inline: true,
            },
            {
                name: `CPU - ${serverData.cpu.percent}%`,
                value: `\`\`\`${hardwareUsageBar((serverData.cpu.percent + 2))}\`\`\``,
                inline: false,
            },
            {
                name: `RAM - ${serverData.memory.used}MB/${(serverData.memory.limit < 1 ? 'Unlimited' : `${serverData.memory.limit}MB`)}`,
                value: `\`\`\`${hardwareUsageBar(serverData.memory.percent)}\`\`\``,
                inline: false,
            }
        ],
    }

    return usageEmbed
}

function hardwareUsageBar(percent) {
    let fill = Math.round((percent / 100) * 22) > 22 ? 22 : Math.round((percent / 100) * 22)
    let bar = '['
    for (let i = 0; i < fill; i++) {
        bar += '■'
    }
    for (let i = 22; i > fill; i--) {
        bar +=' '
    }
    bar += ']'

    return bar
}

function powerActionRow(serverData) {
    const start = new ButtonBuilder()
    if (serverData.status == 'offline') {
        start.setCustomId('start')
        start.setLabel('Start')
        start.setStyle(ButtonStyle.Success)
    } else {
        start.setCustomId('restart')
        start.setLabel('Restart')
        start.setStyle(ButtonStyle.Success)
    }

    const stop = new ButtonBuilder()
    if (serverData.status != 'stopping') {
        stop.setCustomId('stop')
        stop.setLabel('Stop')
        stop.setStyle(ButtonStyle.Danger)
    } else {
        stop.setCustomId('kill')
        stop.setLabel('Kill')
        stop.setStyle(ButtonStyle.Danger)
    }

    const reload = new ButtonBuilder()
        .setCustomId('reload')
        .setLabel('Reload')
        .setStyle(ButtonStyle.Primary)

    const menu = new ButtonBuilder()
        .setCustomId('menu')
        .setLabel('Menu')
        .setStyle(ButtonStyle.Secondary)

    // Creates action row
    const actionRow = new ActionRowBuilder()
        .addComponents(start, stop, reload, menu)

    return actionRow
}