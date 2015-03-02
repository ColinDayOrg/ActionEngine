var path = require('path');

var devLoc = path.join(__dirname, '..');
var jsLoc = path.join(devLoc, 'javascript_utility');
var jadeLoc = path.join(devLoc, 'jade_utility');

var file = require(path.join(jsLoc, 'file'));

var structureCompiler = require(path.join(jadeLoc, 'structureCompiler'));
var componentsCompiler = require(path.join(jadeLoc, 'componentsCompiler'));

var engine = require('./engine');
var engineLog = require('./log');

function gameLoc(name, type) {
  var loc = path.join(__dirname, '../../node_game_modules/' + name);
  if (type !== undefined)
    loc += '/' + type + '/';

  return loc;
}

function loadStructure(name, type) {
  return structureCompiler.compile(
      file.readJSONSync(gameLoc(name, type), 'structure').data);
}

function loadComponentsDir(dir, type) {
  var componentLoc = dir + '/' + type;

  return componentsCompiler.compile(
    file.getDirContents(componentLoc),
    componentLoc,
    path.join(__dirname, '../..'));
}

function loadComponents(name, type) {
  // Note: This needed to be assigned to a variable for some reason...
  var data = 
    loadComponentsDir(gameLoc(name, type), 'system') +
    loadComponentsDir(gameLoc(name, type), 'components');
  return data;
}

function loadRules(name) {
  return file.readJSONSync(gameLoc(name), 'rules').do;
}

function init(gameInfo) {
  gameInfo.structure = loadStructure(gameInfo.name, gameInfo.type);
  gameInfo.components = loadComponents(gameInfo.name, gameInfo.type);
  gameInfo.client = require(path.join(devLoc, gameInfo.type + '_game/client'));
  gameInfo.rules = loadRules(gameInfo.name);

  return engine.create(gameInfo.rules);
}

exports.init = init; 
