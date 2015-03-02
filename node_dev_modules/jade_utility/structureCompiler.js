var path = require('path');
var compiler = require(path.join(__dirname, '../javascript_utility/compiler'));

function compileClientItem(item, parent) {
  if (item.client === undefined) return '';
  var data = compiler.compileObject(item.client);
  if (parent === undefined)
    return '      var ' + item.name + ' = ' + data + ';\r\n';
  else
    return '      ' + parent + '.' + item.name + ' = ' + data + ';\r\n';
}

function compile(items) {
  var clientStructure = compileClientItem({name: 'Structure', client: {}});
  if (items.length !== 0) {
    items.forEach(function(item){
      clientStructure += compileClientItem(item, 'Structure');
    });
  }

  return clientStructure;
}

exports.compile = compile;
