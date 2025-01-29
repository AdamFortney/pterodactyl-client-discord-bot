# Pterodactyl Discord
A Discord bot for managing your servers in Pterodactyl

## Usage
This bot uses the ClientAPI, so it can be used reguardless if you host the server or not!
This *should* work with other hosts that use pterodactyl as a base system.

### Server Control
`/control` will start the control menu.

After running the command, the server select dropdown will appear.
![Image of the server select menu](https://i.imgur.com/PIYgaJB.png)

After selecting a server, the control menu will appear with the server usage and action buttons.
![Image of the Discord server control menu](https://i.imgur.com/ny8m1P6.png)

The *Start* button will be availble when the server is offline and sends the start command.
The *Restart* button will be available when the server is running and sends the restart command.
The *Stop* button will send the power down command to the server.
A *Kill* button will become available after sending the shutdown command.
The *Refresh* button will pull an updated status and hardware usage.
The *Menu* button brings you back to the server select dropdown.

> [!CAUTION]
> Actions in the control menu can be used by anyone with access to the channel!!

### Console Command
`/command` will start the command menu, first opening to the server select menu.

After selecting a server, the command input menu will popup.
![Image of the Discord console command input menu](https://i.imgur.com/CncbsEe.png)

After submitting, the command will run on the server.

> [!NOTE]
> Actions for this command CANNOT be ran by other users, only the user who started the interaction.

## Setting up

### Creating a Discord bot
1. Go to [Discord Developer Portal](https://discord.com/developers/applications/) and click "New Application"
2. Navigate to the Installation page and set Install Link to "None"
2. Navigate to the OAuth2 page and put the client ID into your .env
3. Navigate to the Bot page and reset the token. Put the bot token issued into your .env
4. Still in the Bot page, uncheck "Public Bot"

### Getting Pterodactyl API Key
1. Navigate to your server management interface
2. Click on your profile icon to open Account Settings
3. Open the API Credentials page
4. Create a unique description 
5. Create the key and copy it into the .env
6. Enter the BASE of the URL to the server panel
    Example: https://panel.servers.com

> [!WARNING]
> DO NOT INCLUDE ANYTHING AFTER THE TLD (.com, .app, .net)
> Wrong: https://panel.servers.com/
> Wrong: https://panel.servers.com/servers
> Wrong: https://panel.servers.com/account/api
    

### Getting server ID
1. If not already, enable [Developer Mode](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID#h_01HRSTXPS5CRSRTWYCGPHZQ37H) in your Discord app
2. Right click on the server you would like to use and copy the ID of it into the .env

### Inviting the bot
1. Run the bot and open the link returned by the bot
2. Invite the bot to the server you copied the ID from earlier
3. Finally, restart the bot! You're done!

### Setting permissions (optional)
If you would like to limit what users have access to the commands.
1. Open the server settings
2. Open the Integrations page under the Apps category
3. Click manage next to the Bot you created

At the top, you can set global permissions which effects all commands.
To change permissions for each command, click on the command and set permissions there.