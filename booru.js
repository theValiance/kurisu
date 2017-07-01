//script file for interacting with booru apis
var request = require('request');

var timeout = 5000;

exports.gelbooru = function(){
	var url = `https://gelbooru.com/index.php?page=dapi&s=post&json=1&q=index&limit=1&tags=rating:safe+score:>=40&pid=${Math.floor((Math.random() * 9995)+1)}`;
	var opts = {
		url : url,
		timeout : timeout
	};
	
	return new Promise((resolve, reject) =>{
		request(opts, function (err, res, body) {
			if (err) {
				console.dir(err);
				reject(err);
			}
			resolve(`https:${JSON.parse(body)[0]["file_url"]}`);
		});
	});
};
