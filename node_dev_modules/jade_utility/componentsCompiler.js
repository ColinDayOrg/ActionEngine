function compileComponent(location, name) {
  return '      include ' + location + '/' + name + '\r\n';
}

function compile(items, path, root) {
  var location = path;
  if (root)
    location = '../' + path.slice(root.length + 1);

  var compiledComponents = '';

  if (items.length !== 0) {
    compiledComponents +=   '    script\r\n';
    items.forEach(function(item){
      compiledComponents += compileComponent(location, item);
    });
  }
  
  return compiledComponents;
}

exports.compile = compile;
