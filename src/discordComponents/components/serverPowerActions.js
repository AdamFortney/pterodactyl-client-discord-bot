import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js"

// Constructs the power button row depeding on server state
export function powerActionRow(serverData) {
    const start = new ButtonBuilder()
    if (serverData.status == 'offline' || serverData.locked == true) {
        start.setCustomId('start')
        start.setLabel('Start')
        start.setStyle(ButtonStyle.Success)
        start.setDisabled(serverData.locked)
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
        stop.setDisabled(serverData.locked)
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