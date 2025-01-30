import "dotenv/config";

const panelURL = process.env.pteroURL;
const panelAPI = process.env.pteroAPI;

export async function getEndpointData(endpoint) {
    try {
        // Fetch data from endpoint
        var response = await fetch(`${panelURL}${endpoint}`, {
            headers: {
                "Authorization": `Bearer ${panelAPI}`,
                "Content-Type": "application/json",
                "Accept": "Application/vnd.pterodactyl.v1+json"
            }
        });


        // If request failure throw console error
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        };

        // Adds response data to return variable
        let data = { 
            response: response,
            data: await response.json(),
        };
        return data;
    }
    catch (error) {
        console.log('Failed fetching data to pterodactyl endpoint');
        console.error(error.message);
        let data = { 
            response: response,
            data: undefined
        };
        return data;
    }
}

export async function postEndpointData(endpoint, body) {
    try {
        // Post data to endpoint
        var response = await fetch(`${panelURL}${endpoint}`, {
            method: "POST",
            body: (body),
            headers: {
                "Authorization": `Bearer ${panelAPI}`,
                "Content-Type": "application/json",
                "Accept": "Application/vnd.pterodactyl.v1+json"
            },
        });
        
        // If request failure throw console error
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        };
        
        return response;
    }
    catch (error) {
        console.log('Failed posting data from pterodactyl endpoint.');
        console.error(error.message);
        return response;
    }
}