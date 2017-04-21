var exec = require('child_process').exec;
var cmd = 'git pull origin';

exec(cmd, function(error, stdout, stderr) {
  // command output is in stdout
});
