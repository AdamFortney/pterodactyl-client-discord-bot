import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ComponentType } from 'discord.js';
import { serverSelectMenu } from '../interactions/serverSelect.js';
import { sendServerCommand } from '../../pteroComponents/serverCommands.js';

// Creates command in list
export const data = new SlashCommandBuilder()
    .setName('command')
    .setDescription('Send a command to the server console');

// Command action when executed
export async function execute(interaction) {

    // Gets serverSelectMenu dropdown
    const selectMenu = await serverSelectMenu();
    const serverSelect = await interaction.reply({
        content: '',
        components: [selectMenu],
        embeds: [{title: "Which server would you like to command?"}],
        withResponse: true,
    });

    // Waits for response or timeout after 120s
    try { const selectResponse = await serverSelect.resource.message.awaitMessageComponent({ componentType: ComponentType.StringSelect, filter: (i => i.user.id === interaction.user.id), time: 120_000 });
    
    // After server select, replace dropdown
    interaction.editReply({
        content: '',
        components: [],
        embeds: [{title: "Waiting for command..."}],
        withResponse: true,
    });

    // Send popup for command input and wait for response
    const modalResponse = await commandPopup(selectResponse);

    // Get the input values from popup
    let selectedServer = selectResponse.values[0];
    let submittedCommand = modalResponse.fields.getTextInputValue('consoleCommand');

    // Send command to server
    sendServerCommand(selectedServer, submittedCommand)

    // Respond to the user confirming action
    await modalResponse.update({
        content: ``,
        embeds: [{title: `Ran command: ${submittedCommand}`}],
        components: [],
        ephemeral: true,
    });

    // Catch error or timeout
    } catch { await interaction.editReply({ content: '', components: [], embeds: [{title: "Interaction timed out."}] })}
    
}

async function commandPopup(interaction) {
    // Creates the modal popup menu
    const commandMenu = new ModalBuilder()
        .setCustomId('serverCommandMenu')
        .setTitle('Console Command');

    // Creates the command input field
    const commandInput = new TextInputBuilder()
        .setCustomId('consoleCommand')
        .setLabel('What command would you like to run?')
        .setStyle(TextInputStyle.Short);
    const commandInputRow = new ActionRowBuilder()
        .addComponents(commandInput);
    
    // Adds the components and sends the popup to the user
    commandMenu.addComponents(commandInputRow)
    await interaction.showModal(commandMenu)

    // Modal submission
    try {
        // Creates filter for this event
        const filter = i => i.customId === 'serverCommandMenu' && i.user.id === interaction.user.id;

        // Waits for event submission and return it through function
        const modalSubmission = await interaction.awaitModalSubmit({ filter, time: 180000 });
        return modalSubmission;
    } 
    catch {
        await interaction.editReply({ content: '', embeds: [{title: 'Submission timed out.'}] });
        console.log('Server command aborted. Submission timed out or failed');
    }
}