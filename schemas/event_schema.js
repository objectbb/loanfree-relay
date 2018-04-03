var mongoose = require('mongoose');

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

var teamSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
    },
    name: { type: String, required: true },
    timeStamp: { type: Date, default: Date.now, required: true }
}, { versionKey: false }, { timestamps: { createdAt: 'created_at' } });

var eventSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
    },
    _accountId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    name: { type: String, required: true },
    displayname: { type: String, required: true },
    description: { type: String, required: true },
    startdate: { type: Date, default: Date.now },
    enddate: { type: Date, default: Date.now },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
    coords: {
        type: [Number], // [<longitude>, <latitude>]
        index: '2d' // create the geospatial index
    },
    teams: [teamSchema],
    markers: [eventmarkerSchema],
    timeStamp: { type: Date, default: Date.now, required: true }
}, { versionKey: false }, { timestamps: { createdAt: 'created_at' } });

eventSchema.virtual('account', {
    ref: 'account',
    localField: '_accountId',
    foreignField: '_id',
    justOne: true
});

module.exports = mongoose.model('event', eventSchema);