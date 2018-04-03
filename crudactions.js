const m = require('mongodb')
var Participant = require('./schemas/participant_schema');
var Account = require('./schemas/account_schema');
var Event = require('./schemas/event_schema');
var Photo = require('./schemas/photo_schema');
var dbcrud = require('./dbcrud');

exports.participant_get = function (payload, fn) {

    var query = Participant.
    findOne(payload).
    select('-__v').
    lean().
    populate('account').
    populate('event').
    populate('team').
    exec(function (err, json) {
        if (err) return console.log(err);
        console.log(json);
        fn(json);
    });
}

exports.participant_upsert = function (payload, fn) {
    dbcrud.upsert(Participant, payload, fn);
}

exports.eventparticipants_upsert = function (payload, fn) {

    Account.insertMany(payload.accounts, { ordered: false },
        (err, docs) => {

            console.log('crudactions --> eventparticipants_upsert docs ', docs)
            if (!docs) docs = []

            if (err) {
                console.log('crudactions --> eventparticipants_upsert err ', err)

                if (err.writeErrors)
                    docs.push(err.writeErrors.map((item) => item.op))
                else
                    console.log('crudactions --> err ', err)
            }

            console.log('crudactions --> eventparticipants_upsert docs.accounts ', docs)

            if (payload.accounts.length === 1) {

                console.log('crudactions --> payload.accounts.length  ', payload.accounts.length)

                Account.
                findOne({ email: payload.accounts[0].email }).
                select('_id').
                exec(function (err, json) {
                    if (err) return console.log(err);

                    dbcrud.upsert(Participant, Object.assign({},
                        payload.participant, { _accountId: json._id }), fn);

                    //fn(json);
                });
            } else {

                if (!docs || (docs && docs.length === 0)) {
                    const msg = JSON.stringify(payload);
                    console.log(msg);
                    return fn(msg);
                }

                var prts = docs.map((item) => Object.assign({},
                    payload.participant, { _accountId: item.id }))


                console.log('crudactions --> prts -->  ', prts)

                Participant.insertMany(prts, { ordered: false }, (err, docs) => {


                    console.log('crudactions --> insertMany -->  ', prts)

                    if (err) {
                        console.log(err);
                        fn(err);
                    }
                    fn(docs);
                })
            }
        })
}

exports.eventparticipants_get = function (payload, fn) {

    var query = Participant.
    find(payload).
    select('-__v').
    lean().
    populate('account').
    populate('event').
    populate('team').
    exec(function (err, json) {
        if (err) return console.log(err);
        console.log(json);
        fn(json);
    });
}

exports.account_upsert = function (payload, fn) {
    dbcrud.upsert(Account, payload, fn);
}

exports.account_get = function (payload, fn) {

    var query = Account.
    find(payload).
    select('-__v').
    lean().
    exec(function (err, json) {
        if (err) return console.log(err);
        fn(json);
    });
}

exports.authenticate = function (payload, fn) {

    var query = Account.
    findOne(payload).
    select('-__v').
    lean().
    exec(function (err, json) {
        if (err) return console.log(err);
        fn(json);
    });
}

exports.events_get = function (payload, fn) {
    var query = Event.
    find(payload).
    select('-__v').
    lean().
    exec(function (err, json) {
        if (err) return console.log(err);
        fn(json);
    });
}

exports.events_participant_get = function (payload, fn) {
    var query = Participant.
    find(payload).
    populate('event').
    select('_eventId').
    lean().
    exec(function (err, json) {
        if (err) return console.log(err);
        fn(json);
    });
}

exports.event_get = function (payload, fn) {
    var query = Event.
    findOne(payload).
    select('-__v').
    lean().
    exec(function (err, json) {
        if (err) return console.log(err);
        fn(json);
    });
}

exports.event_upsert = function (payload, fn) {
    dbcrud.upsert(Event, payload, fn);
}

exports.photos_get = function (payload, fn) {
    var query = Photo.
    find(payload).
    select('-__v').
    lean().
    exec(function (err, json) {
        if (err) return console.log(err);
        fn(json);
    });
}

exports.photo_upsert = function (payload, fn) {
    dbcrud.upsert(Photo, payload, fn);
}