var crudaction = require('./crudactions');

exports.init = function (io) {
    io.on('connection', function (socket) {

        socket.on('room', function (room) {
            socket.join(room);
        });

        socket.on('eventparticipants_get', function (payload, fn) {
            crudaction.eventparticipants_get(payload, fn)
        });

        socket.on('eventparticipant_upsert', function (payload, fn) {
            socket.in(payload._eventId).emit('eventparticipant_update_coords', payload);
            crudaction.participant_upsert(payload, fn)
        });

        socket.on('photo_broadcast', function (payload, fn) {
            socket.in(payload._eventId).emit('photo_broadcast', payload);
            console.log('photo_upsert --> ', payload)
        });

        socket.on('event_broadcast', function (payload, fn) {
            console.log('event_broadcast --> ', payload)
            socket.in(payload._id).emit('event_broadcast', payload);

        });

    });
}