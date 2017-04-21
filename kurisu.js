//set up the discord client
const Discord = require("discord.js");
const client = new Discord.Client();
const exec = require('child_process').exec;
const fs = require('fs');

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
						fs.writeFile('updated.txt', '', (err)=>{
							if (err) throw err;
							console.log('Exiting...');
							process.exit(0);
						});
					}
				});
			});
	}
});

console.log('Starting up...');
fs.readFile('token.txt', 'utf8', (err, data) =>{
	console.log(data);
	if (!err){
		client.login(data.replace('\n', ''));
	}
});
