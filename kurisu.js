//set up the discord client
const Discord = require("discord.js");
const client = new Discord.Client();
const exec = require('child_process').exec;
const token = 'Mjg1NTkxNjU4MTY1NDM2NDE2.C9wPGQ.s7zsiACduR2oxmAzw9WMCw3t-ok';

client.on('ready', () => {
	console.log(`Logged in as ${client.user.username}`);
});

client.on('message', msg => {
	if (msg.content === 'update'){
		var sentMessage = msg.reply('Checking for updates...')
			.then((msg) =>{
				var gitProc = exec('git pull origin', (error, stdout, stderr) => {
					if (error) {
    						console.error(`exec error: ${error}`);
    						return;
  					}
  					console.log(`stdout: ${stdout}`);
  					console.log(`stderr: ${stderr}`);
					if (stdout === 'Already up-to-date.\n'){
						msg.reply('Already up to date.');
					}
					else{
						process.exit(0);
					}
				});
			});
	}
});

console.log('Starting up...');
client.login(token);
