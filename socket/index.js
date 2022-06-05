module.exports = (io) => {

  io.on('connection', socket => {

    console.log('new connection');

    socket.on('join', async (room, name) => {
      let members = await io.in(room).fetchSockets();
      if (members.length < 2) {
        socket.join(room);
        socket.to(room).emit('new', name);
        socket.to(room).emit('getdata', socket.id);
        console.log('joined ' + name);
      }
      else {
        io.to(socket.id).emit('sendCheck', false);
      }
    });

    socket.on('sendData', (id, name, playerList) => {
      socket.to(id).emit('sendData', name, playerList)
    })

    socket.on('setGame', (room, state) => {
      socket.to(room).emit('setGame', state)
    })

    socket.on('move', (i, j, room) => {
      socket.to(room).emit('move', i, j)
    })

    socket.on('disconnect', () => console.log('disconnected'));

  })
}