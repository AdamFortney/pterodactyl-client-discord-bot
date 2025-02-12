import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { getEndpointData } from '../../pteroComponents/pteroManager.js'
import "dotenv/config";

export async function serverSelectMenu() {
    // Gets a list of servers
    let serverList = (await getEndpointData('/api/client/')).data

    // Start Menu builder
    const select = new StringSelectMenuBuilder()
        .setCustomId('server')
        .setPlaceholder('Make a selection!');

    // Adds in each option from the serverList
    for (let item in serverList.data) {
        let currentServer = serverList.data[item];
        select.addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel(`${(currentServer.attributes.name).length < 1 ? 'Nameless Server' : `${currentServer.attributes.name}`}`)
                .setDescription(`${(currentServer.attributes.description).length < 1 ? 'Server Missing Description' : `${currentServer.attributes.description}`}`)
                .setValue(currentServer.attributes.identifier)
        )
    };

    // Creates the select menu row and passes it out
    const selectMenu = new ActionRowBuilder()
        .addComponents(select);
    return selectMenu;
}