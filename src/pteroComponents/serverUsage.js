import { getEndpointData } from './pteroManager.js';

export async function getServerUsage(serverID) {
    // Sends the requests for server hardware limits and current usage
    let serverData = (await getEndpointData(`/api/client/servers/${serverID}`)).data.attributes;
    let resourceGetRequest = serverData.status == null ? (await getEndpointData(`/api/client/servers/${serverID}/resources`)).data : undefined;
    
    // If server isnt locked (installing, suspended, transferring)
    if (resourceGetRequest != undefined) {
        let resourcesData = resourceGetRequest.attributes;
        // Sets CPU usage to percentage out of 100%
        var cpuPercent = Math.round(resourcesData.resources.cpu_absolute / (serverData.limits.cpu > 0 ? serverData.limits.cpu : 100) * 1000) / 10
        var cpuUsed = Math.round(resourcesData.resources.cpu_absolute)

        // Converts memory usage in bits to mebibytes
        var memoryUsed = Math.round((resourcesData.resources.memory_bytes / 1024 ) / 1048.576)
        var memoryPercent = Math.round((memoryUsed / (serverData.limits.memory > 0 ? serverData.limits.memory : 1024)) * 1000) / 10

        // Converts disk usage in bits to mebibytes
        var diskUsed = Math.round((resourcesData.resources.disk_bytes / 1024) / 1048.576)
        var diskPercent = Math.round((diskUsed / (serverData.limits.disk > 0 ? serverData.limits.disk : 1024)) * 1000) / 10

        // Converts miliseconds to uptime
        var uptimeDays = Math.floor(resourcesData.resources.uptime / 1000 / 60 / 60 / 24)
        var uptimeHours = Math.floor((resourcesData.resources.uptime / 1000 / 60 / 60) % 24)
        var uptimeMinutes = Math.floor((resourcesData.resources.uptime / 1000 / 60) % 60)
        var uptimeSeconds = Math.round((resourcesData.resources.uptime / 1000) % 60)
        var uptimeRaw = resourcesData.resources.uptime

        // Sets the current state when server isnt locked
        var serverStatus = resourcesData.current_state
        var serverLocked = false
    }
    else {
        // Sets all fields to 0
        var cpuPercent = 0
        var cpuUsed = 0
        var memoryUsed = 0
        var memoryPercent = 0
        var diskUsed = 0
        var diskPercent = 0
        var uptimeDays = 0
        var uptimeHours = 0
        var uptimeMinutes = 0
        var uptimeSeconds = 0
        var uptimeRaw = 0
        // Changes status
        if (serverData.status != null) {
            var serverStatus = serverData.status
        }  else {
            var serverStatus = 'unknown'
        }
        var serverLocked = true
    }


    //Formats data for return
    let usageData = {
        name: serverData.name,
        description: serverData.description,
        serverID: serverData.identifier,
        status: serverStatus,
        locked: serverLocked,
        
        cpu: {
            percent: cpuPercent,
            used: cpuUsed,
            limit: serverData.limits.cpu,
        },

        memory: {
            percent: memoryPercent,
            used: memoryUsed,
            limit: serverData.limits.memory,
        },

        disk: {
            percent: diskPercent,
            used: diskUsed,
            limit: serverData.limits.disk,
        },
        
        uptime: {
            days: uptimeDays,
            hours: uptimeHours,
            minutes: uptimeMinutes,
            seconds: uptimeSeconds,
            uptime: uptimeRaw
        }

    }

    return usageData;
}