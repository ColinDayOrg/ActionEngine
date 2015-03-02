function noLog() {}
function checkLog(test, func) {
  if (test)
    return func;
  return noLog;
}

function clientRequest(request) {
  console.log('  <<<<<<<<<<<<<<<<<<<<<<<<<< Client Request: %s', request);
}

function serverResponse(response) {
  console.log('  >>>>>>>>>>>>>>>>>>>>>>>>>> ServerResponse: %s\n', response);
}

function clientData(name, data) {
  console.log('-- %s ---------------------------', name);
  var clientData = data.actions;
  if (clientData === undefined)
    console.log('NO DATA');
  else
    clientData.forEach(function(action) {
      console.log('%s.%s ->', action.component, action.action, action.data);
    });
  console.log('+++ pending action: ', data.pendingAction);
}

function addToSelection(name, id) {
  console.log('  <<+ [Saving selection: %s, %s]', name, id);
}

function removeFromSelection(name) {
  console.log('  <<x [Removing selection: %s]', name);
}

function selection(selection) {
  console.log(selection);
}

function stack(method, data) {
  console.log('= ' + method + ' ==========================================');
  if (method === 'pop')
    return;
  
  data.forEach(function(item, index) {
    var actions = '  actions: ';
    item.actions.forEach(function(action, index) {
      var text = action.action;
      if (item.current == index)
        text = '[' + text + ']'; 
      actions += text + ' ';
    });
    console.log(actions);

    var controls = '  control: ';
    for (var name in item.control) 
      controls += name + ' ';
    if (controls !== '  control: ')
      console.log(controls);

    if (item.after)
      console.log('  after: true');
    if (item.count)
      console.log('  count: %d', item.count);
    if (index < data.length - 1)
      console.log('----------------------------------------------');
   });
  console.log('');
}

function pendingAction(action) {
  console.log('### set pending action: %s', action);
}

var logClientData = false;
var logSelection = false;
exports.clientRequest = checkLog(logClientData, clientRequest); 
exports.serverResponse = checkLog(logClientData, serverResponse); 
exports.clientData = checkLog(logClientData, clientData);
exports.addToSelection = checkLog(logSelection || logClientData, addToSelection);
exports.removeFromSelection = checkLog(logSelection || logClientData, removeFromSelection);

exports.selection = checkLog(logSelection, selection); 

var logStack = false;
exports.stack = checkLog(logStack, stack);
exports.pendingAction = checkLog(logStack, pendingAction);
