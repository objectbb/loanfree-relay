var mongoose = require('mongoose');
var event_schema = require('./event_schema');

var detailmarkerSchema = new mongoose.Schema({
    range: { type: Number, required: true },
    coords: {
        type: [Number],
        index: '2d',
    },
    timeStamp: { type: Date, default: Date.now, required: true }
}, { versionKey: false }, { timestamps: { createdAt: 'created_at' } });

var eventmarkerSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
    },
    name: { type: String, required: true },
    guid: { type: String, required: true },
    range: Number,
    coords: {
        type: [Number], // [<longitude>, <latitude>]
        index: '2d' // create the geospatial index
    },
    timeStamp: { type: Date, default: Date.now, required: true }
}, { versionKey: false }, { timestamps: { createdAt: 'created_at' } });

var markerSchema = new mongoose.Schema({
    marker: eventmarkerSchema,
    details: detailmarkerSchema,
    timeStamp: { type: Date, default: Date.now, required: true }
}, { versionKey: false }, { timestamps: { createdAt: 'created_at' } });

var participantSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
    },
    _accountId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    _eventId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    _teamId: { type: mongoose.Schema.Types.ObjectId, index: true },
    markers: [markerSchema],
    coords: {
        type: [Number],
        index: '2d',
        required: true
    },
    timeStamp: { type: Date, default: Date.now, required: true }
}, { toJSON: { virtuals: true } }, { versionKey: false }, { timestamps: { createdAt: 'created_at' } });


participantSchema.virtual('account', {
    ref: 'account',
    localField: '_accountId',
    foreignField: '_id',
    justOne: true
});

participantSchema.virtual('event', {
    ref: 'event',
    localField: '_eventId',
    foreignField: '_id',
    justOne: true
});

module.exports = mongoose.model('participant', participantSchema);