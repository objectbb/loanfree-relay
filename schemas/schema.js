var mongoose = require('mongoose');

var detailmarkerSchema = new mongoose.Schema({
    range: { type: Number, required: true },
    coords: {
        type: [Number],
        index: '2d',
    },
    timeStamp: { type: Date, default: Date.now, required: true }
});

var markerSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
    },
    details: detailmarkerSchema,
    timeStamp: { type: Date, default: Date.now, required: true }
});

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
        index: '2d'
    },
    timeStamp: { type: Date, default: Date.now, required: true }
}, { toJSON: { virtuals: true } });


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

var accountSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true
    },
    email: { type: String, required: true, unique: true },
    name: {
        first: { type: String, required: true },
        last: { type: String, required: true },
    },
    authorization: { type: String, required: true, enum: ['ROUTEMAKER', 'ROUTEMANAGER', 'PARTICIPANT'] },
    authenticated: { type: String, required: true, default: false },
    timeStamp: { type: Date, default: Date.now, required: true }
}, { toJSON: { virtuals: true } });


var eventmarkerSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
    },
    name: { type: String, required: true },
    range: Number,
    coords: {
        type: [Number], // [<longitude>, <latitude>]
        index: '2d' // create the geospatial index
    },
    timeStamp: { type: Date, default: Date.now, required: true }
});

var teamSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
    },
    name: { type: String, required: true },
    timeStamp: { type: Date, default: Date.now, required: true }
});

var eventSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
    },
    _accountId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    name: { type: String, required: true },
    displayName: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    coords: {
        type: [Number], // [<longitude>, <latitude>]
        index: '2d' // create the geospatial index
    },
    teams: [teamSchema],
    markers: [eventmarkerSchema],
    timeStamp: { type: Date, default: Date.now, required: true }
});

eventSchema.virtual('account', {
    ref: 'account',
    localField: '_accountId',
    foreignField: '_id',

    justOne: true
});


var Account = mongoose.model('account', accountSchema);
var Event = mongoose.model('event', eventSchema);
var Participant = mongoose.model('participant', participantSchema);