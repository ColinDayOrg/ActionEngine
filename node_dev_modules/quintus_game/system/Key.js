var Key = {
  dispatch: function(event) {
    if (event.type === 'keydown')
      ++Selection.currentPath;
  }
}

document.body.onkeydown = function(e) {
  Key.dispatch(e);
}
