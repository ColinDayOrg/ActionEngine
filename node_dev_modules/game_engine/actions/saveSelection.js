function saveSelection(instance, action, data) {
  instance.addToSelection(action.name, data.id);
}

module.exports = saveSelection;
