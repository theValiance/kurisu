//script file for interacting with booru apis
var request = require('request');
var xml2js = require('xml2js');

var parser = new xml2js.Parser();

var timeout = 10000;


exports.gelbooru = function(){
	var url = `https://gelbooru.com/index.php?page=dapi&s=post&q=index&limit=1&tags=rating:safe+score:>=40&pid=${Math.floor((Math.random() * 9995)+1)}`;
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
			parser.parseString(body, function(err, result){
				resolve(`https:${result['posts']['post'][0]['$']['file_url'].replace('\n', '')}`);
			});
		});
	});
};
