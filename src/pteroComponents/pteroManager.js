import "dotenv/config";

const panelURL = process.env.pteroURL;
const panelAPI = process.env.pteroAPI;

export async function postEndpointData(endpoint, body) {
    try {
        const response = await fetch(`${panelURL}${endpoint}`, {
            method: "POST",
            body: (body),
            headers: {
                "Authorization": `Bearer ${panelAPI}`,
                "Content-Type": "application/json",
                "Accept": "Application/vnd.pterodactyl.v1+json"
            },
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        //let data = await response.json();
        //return data;
    }
    catch (error) {
        console.error(error.message)
    }
}

export async function getEndpointData(endpoint) {
    try {
        const response = await fetch(`${panelURL}${endpoint}`, {
            headers: {
                "Authorization": `Bearer ${panelAPI}`,
                "Content-Type": "application/json",
                "Accept": "Application/vnd.pterodactyl.v1+json"
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        let data = await response.json();
        return data;
    }
    catch (error) {
        console.error(error.message)
    }
}