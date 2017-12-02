"use strict";

//required files
var Discord = require("discord.js");
var exec = require('child_process').exec;
var fs = require('fs');
//var booru = require('./booru');
var ytdl = require('ytdl-core');

//global variables
var config = {};
var client = new Discord.Client();

function preadFile(fileName, encoding) { //wraps fs.readFile as a Promise for consistency [may change function name in the future]
	return new Promise((resolve, reject) => {
		fs.readFile(fileName, encoding, (err, data) => {
			if (!err) {
				resolve(data);
			}
			else {
				reject(err);
			}
		});
	});
}

function fetchServerConfig(id, callback){
	return new Promise((resolve, reject) => {
		fs.readFile(`s${id}.json`, 'utf8', (err, data) => {
			if (!err){
				resolve(JSON.parse(data));
			}
			else{
				reject();
			}
		});
	});
}

function saveServerConfig(id, setting, value, callback){ //this function still needs to be updated
	return new Promise((resolve, reject) => {
		fs.readFile(`s${id}.json`, 'utf8', (err, data) => {
			if (!err){
				var obj = JSON.parse(data);
				obj[setting] = value;
				fs.writeFile(`s${id}.json`, JSON.stringify(obj), 'utf8');
				resolve();
			}
			else{
				reject();
			}
		});
	});
	
}

function botMentioned(guild, suppressGlobals, suppressRoles){
	return function(item){
		if ((item == `<@!${client.user.id}>`) || (item == `<@${client.user.id}>`)){
			return true;
		}
		else if((!suppressGlobals) && ((item == "@everyone") || (item == "@here"))){
			return true;
		}
		else if(!suppressRoles && (guild != null)){
			//if guild.me.roles
		}
		return false;
	};
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.username}`);
});

client.on('disconnect', () => {
	console.log('Connection lost, restarting.');
	process.exit(1);
});

client.on('guildMemberAdd', (member) => {
	member.guild.defaultChannel.send(`Let's all welcome <@${member.user.id}> to the server!`);
});

client.on('message', (msg) => {
	console.log(`${msg.author.username}: ${msg}`);
	var wordArray = msg.content.split(" ");
	var command = "";
	var index = 0;
	if (msg.channel.type == "group" || msg.channel.type == "text"){ //if not directly messaged, require/search for an @mention
		if (msg.channel.type == "text"){
			var index = wordArray.findIndex(botMentioned(msg.guild, false, false));
		}
		else if (msg.channel.type == "group"){
			var index = wordArray.findIndex(botMentioned(null, false, false));
		}
		if (index != -1) {
			command = wordArray[index + 1];
			//command scrubbing goes here
		}
		else{
			//bot was not mentioned
		}
	}
	else if (msg.channel.type == "dm"){ //direct message assumes command attempt, no need for @mention
		command = wordArray[0];
		//command scrubbing goes here
	}
	if (command == 'update'){
		msg.channel.send('Checking for updates...')
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
								var version = data.slice(0, startPos);
								msg.edit(`Updated to version **${version}**`)
									.then((msg) =>{
										var changelist = data.slice(startPos+1, endPos-1);
										msg.channel.send("```" + `${changelist}` + "```")
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
		msg.channel.send(`I have been online for ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds and ${millis} milliseconds.`);
	}
	else if (command == 'source'){
		msg.channel.send('You can find an up-to-date copy of my source code at https://github.com/theValiance/kurisu');
	}
	else if (command == 'restart'){
		msg.channel.send('Restarting...')
		process.exit();
	}
	else if (command == 'help'){
		msg.channel.send('This is a placeholder command. It will be used to provide a command list as well as command specialized help.');
	}
	/*
	else if (command == 'gelbooru'){
		booru.gelbooru().then((data) => {
			msg.channel.send(data);
		});
	}
	*/
	else if (command == 'youtube'){
    		if (msg.member.voiceChannel) {
			msg.member.voiceChannel.join()
			.then(connection => { // Connection is an instance of VoiceConnection
				const url = wordArray[index+2];
				if (ytdl.validateURL(url)){
					connection.on('error', (err) => {
						console.log(err);
					});
					const streamOptions = {seek: 0, volume: 1 };
					const stream = ytdl(url, {filter : 'audioonly'});
					const dispatcher = connection.playStream(stream, streamOptions);
					dispatcher.on('end', () => {
						msg.member.voiceChannel.leave();
					});
					dispatcher.on('error', (err) => {
						console.log(err);
					});
				}
				else{
					console.log("Invalid URL!");
				}
        		})
			.catch((err) => {
				console.log(err);
			});
		}
	}
});


//load configuration settings from file and connect the bot to discord
preadFile("config.json", "utf8")
	.then((file) => {
		config = JSON.parse(file);
		if (config["admins"].indexOf(config["masterID"]) == -1){
			config["admins"].push(config["masterID"]);
		}
		console.log(`Master ID: ${config['masterID']}`);
		console.log(`Admins: ${config['admins']}`);
		client.login(config['token'])
			.then((res)=>{
				console.log(res);
			})
			.catch((res)=>{
				console.log(`Client login error, reason: ${res}`);
				process.exit(1);
			});
	});
