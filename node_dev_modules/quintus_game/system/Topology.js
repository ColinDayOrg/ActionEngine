var Topology = {
  add: function(data) {
    var from = Stage.get(data.from);
    if (!from.connections)
      from.connections = [];
    from.connections.push({
      to: Stage.get(data.to),
      data: data.data
    });
  }
}
