//set up the discord client and other constants
const Discord = require("discord.js");
const client = new Discord.Client();
const exec = require('child_process').exec;
const fs = require('fs');

//global vars
var token = '';
var masterId = 0;
var admins = []

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


//read private startup files
fs.readFile('masterId.txt', 'utf8', (err, data) =>{
	if (!err){
		masterId = data.replace('\n', '');
	}
});
fs.readFile('adminList.txt', 'utf8', (err, data) => {
	if (!err){
		admins = data.split('\n').pop();
	}
});
fs.readFile('token.txt', 'utf8', (err, data) =>{
	if (!err){
		token = data.replace('\n', '');
	}
});
