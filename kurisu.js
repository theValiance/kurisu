"use strict";

//set up the discord client and other constants
const Discord = require("discord.js");
const client = new Discord.Client();
const exec = require('child_process').exec;
const fs = require('fs');

//global vars
var token = '';
var masterID = 0;
var admins = [];
var commandIndicator = '!';

function messageContainsMention(message, mentioned){ //requires an ID to check for (<@id> for users, <#id> for channels, <@!id> for bots)
	return ((message.content.search('<@' + mentioned + '>') != -1) || (message.content.search('<#' + mentioned + '>') != -1) || (message.content.search('<@!' + mentioned + '>') != -1));
}

function pullCommand(string){
	var start = string.indexOf(commandIndicator);
	if (start != -1){
		var i = (start + 1);
		while ((i < string.length) && (string.charAt(i) != ' ')){
			i++;
		}
		return string.slice(start + 1, i);
	}
	else{
		return -1;
	}
}

function fetchServerData(){
	return 0;
}

function fetchServerSetting(){
	return 0;
}

function updateServerSetting(){
	return 0;
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.username}`);
});

client.on('disconnect', () => {
	console.log('Connection lost, restarting.');
	process.exit(1);
});

client.on('guildMemberAdd', (member) => {
	console.log('New member connected.');
});

client.on('message', (msg) => {
	var command = pullCommand(msg.content);
	console.log(`${msg.author.username}: ${msg}`);
	if (command == 'update'){
		msg.channel.sendMessage('Checking for updates...')
			.then((msg) =>{
				var gitProc = exec('git pull origin', (error, stdout, stderr) => {
					if (error) {
						console.error(`exec error: ${error}`);
						return;
					}
					console.log(`stdout: ${stdout}`);
					console.log(`stderr: ${stderr}`);
					if (stdout === 'Already up-to-date.\n'){
						msg.edit('Already up to date.');
					}
					else{
						fs.readFile('CHANGELIST', 'utf8', (err, data) =>{
							if (!err){
								var startPos = data.indexOf('{');
								var endPos = data.indexOf('}');
								version = data.slice(0, startPos);
								msg.edit(`Updated to version **${version}**`)
									.then((msg) =>{
										var changelist = data.slice(startPos+1, endPos-1);
										msg.channel.sendMessage("```" + `${changelist}` + "```")
											.then(()=>{
												process.exit(0);
											});
									});
							}
						});	
					}
				});
			});
	}
	else if (command == 'uptime'){
		var uptime = client.uptime;
		var millis = (uptime % 1000);
		var seconds = (((uptime - millis) / 1000) % 60);
		var minutes = (((((uptime - millis) / 1000) - seconds) / 60) % 60);
		var hours = (((((((uptime - millis) / 1000) - seconds) / 60) - minutes) / 60) % 24);
		var days = ((((((((uptime - millis) / 1000) - seconds) / 60) - minutes) / 60) - hours) / 24);
		msg.channel.sendMessage(`I have been online for ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds and ${millis} milliseconds.`);
	}
	else if (command == 'source'){
		msg.channel.sendMessage('You can find an up-to-date copy of my source code at https://github.com/theValiance/kurisu');
	}
	else if (command == 'help'){
		msg.channel.sendMessage('This is a placeholder command. It will be used to provide a command list as well as command specialized help.');
	}
});


//read private startup files
fs.readFile('masterId.txt', 'utf8', (err, data) =>{
	if (!err){
		masterID = data.replace('\n', '');
		console.log(`Master ID: ${masterID}`);
	}
});
fs.readFile('adminList.txt', 'utf8', (err, data) => {
	if (!err){
		admins = data.split('\n');
		admins.pop();
		console.log(`Admins: ${admins}`);
	}
});
fs.readFile('token.txt', 'utf8', (err, data) =>{
	if (!err){
		token = data.replace('\n', '');
		console.log(`Token: ${token}`);
		client.login(token)
			.then((string)=>{
				console.log(string);
			});
	}
});
