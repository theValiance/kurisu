//set up the discord client
const Discord = require("discord.js");
const client = new Discord.Client();
const exec = require('child_process').exec;
const token = Mjg1NTkxNjU4MTY1NDM2NDE2.C9wPGQ.s7zsiACduR2oxmAzw9WMCw3t-ok;

client.on('ready', () => {
	console.log('Logged in as ${client.user.username}!');
});

client.on('message', msg => {
	if (msg.content === 'update'){
		msg.reply('Checking for updates...');
		exec('git pull origin', function(error, stdout, stderr){});
		process.exit();
	}
}

client.login(token);
