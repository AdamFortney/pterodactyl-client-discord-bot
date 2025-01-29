import { getEndpointData } from './pteroManager.js';

export async function getServerUsage(serverID) {
    // Requests the server hardware limits and current usage
    let resourcesData = (await getEndpointData(`/api/client/servers/${serverID}/resources`)).attributes;
    let serverData = (await getEndpointData(`/api/client/servers/${serverID}`)).attributes;

    // Sets CPU usage to percentage out of 100%
    let cpuPercent = Math.round(resourcesData.resources.cpu_absolute / (serverData.limits.cpu > 0 ? serverData.limits.cpu : 100) * 1000) / 10
    let cpuUsed = Math.round(resourcesData.resources.cpu_absolute)

    // Converts memory usage in bits to mebibytes
    let memoryUsed = Math.round((resourcesData.resources.memory_bytes / 1024 ) / 1048.576)
    let memoryPercent = Math.round((memoryUsed / (serverData.limits.memory > 0 ? serverData.limits.memory : 1024)) * 1000) / 10

    // Converts disk usage in bits to mebibytes
    let diskUsed = Math.round((resourcesData.resources.disk_bytes / 1024) / 1048.576)
    let diskPercent = Math.round((diskUsed / (serverData.limits.disk > 0 ? serverData.limits.disk : 1024)) * 1000) / 10

    // Converts miliseconds to uptime
    let uptimeDays = Math.floor(resourcesData.resources.uptime / 1000 / 60 / 60 / 24)
    let uptimeHours = Math.floor((resourcesData.resources.uptime / 1000 / 60 / 60) % 24)
    let uptimeMinutes = Math.floor((resourcesData.resources.uptime / 1000 / 60) % 60)
    let uptimeSeconds = Math.round((resourcesData.resources.uptime / 1000) % 60)

    //Formats data for return
    let usageData = {
        name: serverData.name,
        description: serverData.description,
        serverID: serverData.identifier,
        status: resourcesData.current_state,
        
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
            seconds: uptimeSeconds
        }

    }

    return usageData;
}