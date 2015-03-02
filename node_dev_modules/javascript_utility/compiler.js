function compileData(data) {
  if (data === undefined) 
    return '';

  var value = data.toString();
  if (value === '') 
    return '';

  if (typeof data === 'object')
    return '[' + value + ']';

  if (value.charAt(0) === '$')
    return "'" + value.slice(1) + "'";

  return value;
}

function compileList(items, parseFunc) {
  var compiledData = '';

  var first = true;
  if (items.length !== 0) {
    items.forEach(function(item) {

      var data = item;
      if (parseFunc !== undefined)
        data = parseFunc(item);

      if (data !== '') {
        if (!first) 
          compiledData += ', ';
        compiledData += data;
        first = false;
      }
    });
  }
  
  return compiledData;
}

function compileMember(action, name) {
  var value = compileData(action[name]);
  if (value === '')
    return '';

  return name + ": " + value;
}

function compileObject(action) {
  var items = [];
  for (item in action) {
    items.push(item);
  }

  var compiledData = compileList(
    items, 
    function(item) {
      return (function(action){
        return compileMember(action, item);
      })(action)
    }
  );
 
  return '{' + compiledData + '}';
}

exports.compileObject = compileObject;
