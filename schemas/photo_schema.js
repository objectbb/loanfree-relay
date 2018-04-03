var mongoose = require('mongoose');

var photoSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
    },
    _eventId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    participant: { type: mongoose.Schema.Types.Mixed, required: true },
    photoURLFirebase: { type: String, required: true },
    timeStamp: { type: Date, default: Date.now, required: true }
}, { versionKey: false }, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('photo', photoSchema);