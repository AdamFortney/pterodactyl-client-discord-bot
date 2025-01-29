import { postEndpointData } from './pteroManager.js';

export async function sendPowerCommand(serverID, state) {
    let data = JSON.stringify({
        "signal": `${state}`
    })

    postEndpointData(`/api/client/servers/${serverID}/power`, `${data}`)
}

export async function sendServerCommand(serverID, command) {
    let data = JSON.stringify({
        "command": `${command}`
    })

    postEndpointData(`/api/client/servers/${serverID}/command`, `${data}`)
}

// Planned functions
// Backup management (create and delete)
//  Will not allow deletion of locked backups