//set up the discord client
const var Discord = require("discord.js");
const var client = new Discord.Client();
const var spawn = require('child_process').spawn;
const var token = 'Mjg1NTkxNjU4MTY1NDM2NDE2.C9wPGQ.s7zsiACduR2oxmAzw9WMCw3t-ok';

client.on('ready', () => {
	console.log('Logged in as ${client.user.username}');
});

client.on('message', msg => {
	if (msg.content === 'update'){
		msg.reply('Checking for updates...')
			.then(() =>{
				var gitProc = spawn('git pull origin');
			
				//when there is some data output
				gitProc.stdout.on('data', (chunk) =>{
					console.log(chunk);
				});
			
				gitProc.on('close', (code) => {
					process.exit(0);	
				});
			});
	}
});

client.login(token);
