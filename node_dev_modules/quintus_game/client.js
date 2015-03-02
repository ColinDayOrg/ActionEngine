var path = require('path');
var fs = require('fs');
var jade = require('jade');

var jadeLoc = path.join(__dirname, '../jade_utility/');
var utility = require(jadeLoc + 'utility');
var componentCompiler = require(jadeLoc + 'componentsCompiler');

function render(structure, components, callback) {
  // NOTE: Relative path is easier than root, OK to say quintus here, this is a quintus client
  var systemData = fs.readdirSync('./node_dev_modules/quintus_game/system');
  var system = componentCompiler.compile(systemData, './quintus_game/system');

  fs.readFile(
    __dirname + '/game.jade', 
    'utf8', 
    function (err, data) {
      if (err) throw err;
      data = utility.replaceFirstTag('system', data, system);
      data = utility.replaceFirstTag('structure', data, structure);
      data = utility.replaceFirstTag('components', data, components);
      callback(jade.render(data, { filename: __dirname }));
    }
  );
}

exports.render = render;
