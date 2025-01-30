import { postEndpointData } from './pteroManager.js';

export async function sendPowerCommand(serverID, state) {
    let data = JSON.stringify({
        "signal": `${state}`
    })

    const requestStatus = await postEndpointData(`/api/client/servers/${serverID}/power`, `${data}`)
    if (requestStatus) { return requestStatus }
    console.log(`Sent power command ${state} to server with ID ${serverID}`)
}

export async function sendServerCommand(serverID, command) {
    let data = JSON.stringify({
        "command": `${command}`
    })

    console.log(`Sending console command "${command}" to server with ID ${serverID}`)
    const requestStatus = postEndpointData(`/api/client/servers/${serverID}/command`, `${data}`)
    return requestStatus;
}

// Planned functions
// Backup management (create and delete)
//  Will not allow deletion of locked backups