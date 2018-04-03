var crudaction = require('./crudactions');
var geocode = require('./geocode');
var co = require('co');

exports.init = function (app) {

    app.post('/geocode', co.wrap(function* (req, res) {

        console.log(req.body.address)
        let loc = yield geocode.fullOnGeocode(req.body.address)
        res.send(loc);
    }));

    app.post('/participant_upsert', (req, res) =>
        crudaction.participant_upsert(
            req.body,
            function (rs) { res.send(rs); }
        ));

    app.post('/participant_get', (req, res) =>
        crudaction.participant_get(
            req.body,
            function (rs) { res.send(rs); }
        ));

    app.post('/eventparticipants_upsert', (req, res) =>
        crudaction.eventparticipants_upsert(
            req.body,
            function (rs) { res.send(rs); }
        ));


    app.post('/eventparticipants_get', (req, res) =>
        crudaction.eventparticipants_get(
            req.body,
            function (rs) { res.send(rs); }
        ));

    app.post('/account_upsert', (req, res) => {

        crudaction.account_upsert(
            req.body,
            function (rs) { res.send(rs); }
        )
    });

    app.post('/account_get', (req, res) => {

        crudaction.account_get(
            req.body,
            function (rs) {
                res.send(rs);
            }
        )
    });

    app.post('/authenticate', (req, res) => {

        crudaction.authenticate(
            req.body,
            function (rs) {
                res.send(rs);
            }
        )
    });

    app.post('/event_get', (req, res) =>
        crudaction.event_get(
            req.body,
            function (rs) { res.send(rs); }
        ));

    app.post('/events_get', (req, res) =>
        crudaction.events_get(
            req.body,
            function (rs) { res.send(rs); }
        ));

    app.post('/events_participant_get', (req, res) =>
        crudaction.events_participant_get(
            req.body,
            function (rs) { res.send(rs); }
        ));

    app.post('/event_upsert', (req, res) =>
        crudaction.event_upsert(
            req.body,
            function (rs) { res.send(rs); }
        ));

    app.post('/photos_get', (req, res) =>
        crudaction.photos_get(
            req.body,
            function (rs) { res.send(rs); }
        ));

    app.post('/photo_upsert', (req, res) =>
        crudaction.photo_upsert(
            req.body,
            function (rs) { res.send(rs); }
        ));
}