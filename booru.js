//script file for interacting with booru apis
var request = require('request');
var xml2js = require('xml2js');

var parser = new xml2js.Parser();
var url = 'https://gelbooru.com/index.php?page=dapi&s=post&q=index&limit=1&tags=rating:safe+score:>=40';
var timeout = 10000;
var opts = {
	url : url,
	timeout : timeout
};

exports.gelbooru = function(){
	return new Promise((resolve, reject) =>{
		request(opts, function (err, res, body) {
			if (err) {
				console.dir(err);
				reject(err);
			}
			parser.parseString(body, function(err, result){
				resolve(result['posts']['post'][0]['$']['file_url'].replace('\n', ''));
			});
		});
	});
};
