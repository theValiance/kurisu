//set up the discord client
const Discord = require("discord.js");
const client = new Discord.Client();
const exec = require('child_process').exec;
const token = 'Mjg1NTkxNjU4MTY1NDM2NDE2.C9wPGQ.s7zsiACduR2oxmAzw9WMCw3t-ok';

client.on('ready', () => {
	console.log('Logged in as ${client.user.username}');
});

client.on('message', msg => {
	if (msg.content === 'update'){
		msg.reply('Checking for updates...')
			.then(() =>{
				exec('git pull origin', (error, stdout, stderr) =>{
					console.log('stdout: ${stdout}');
					console.log('stderr: ${stderr}');
					if (error !== null){
						console.log('exec error: ${error}');	
					}
				});
			})
			.then(() =>{
				process.exit(0);
		});
	}
});

client.login(token);
