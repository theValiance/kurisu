//set up the discord client
const Discord = require("discord.js");
const client = new Discord.Client();
const spawn = require('child_process').spawnSync;
const token = 'Mjg1NTkxNjU4MTY1NDM2NDE2.C9wPGQ.s7zsiACduR2oxmAzw9WMCw3t-ok';

client.on('ready', () => {
	console.log('Logged in as ${client.user.username}');
});

client.on('message', msg => {
	if (msg.content === 'update'){
		var sentMessage = msg.reply('Checking for updates...')
			.then((msg) =>{
				var gitProc = spawn('git pull origin');
			
				if (gitProc.stdout === 'Already up-to-date.'){
					msg.reply('Already up to date.');
				}
				else{
					process.exit(0);
				}
			});
	}
});

client.login(token);
