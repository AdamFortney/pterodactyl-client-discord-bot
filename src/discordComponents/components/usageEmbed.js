// Generates the JSON for the server usage embed
export function serverUsageEmbed(serverData) {
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

// Makes the hardware usage bar for use in the embed
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