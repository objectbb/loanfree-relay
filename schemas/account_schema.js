var mongoose = require('mongoose');

var accountSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true
    },
    email: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    authorization: { type: String, required: true, enum: ['ROUTEMAKER', 'ROUTEMANAGER', 'PARTICIPANT'] },
    authenticated: { type: String, required: true, default: false },
    _createdById: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    timeStamp: { type: Date, default: Date.now, required: true }
}, { toJSON: { virtuals: true } }, { versionKey: false }, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('account', accountSchema);