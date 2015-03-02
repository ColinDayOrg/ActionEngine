var path = require('path');
var fs = require('fs');

function readJSONSync(location, file) {
  var file = path.join(location + '/' + file + '.json');
  var data = fs.readFileSync(file, 'utf8');
  return JSON.parse(data);
};

function getDirContents(path) {
  return fs.readdirSync(path);
}

exports.readJSONSync = readJSONSync;
exports.getDirContents = getDirContents;
