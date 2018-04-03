const m = require('mongodb')

exports.upsert = function (model, payload, fn, filter) {

    var where = (filter) ? filter : m.ObjectId(payload._id);

    model.findOne(where, (err, doc) => {
        const item = (doc) ? Object.assign(doc, payload) : new model(payload);

        return item.save((err, doc) => {
            if (err) {
                console.log(err);
                fn(err);
            }
            fn(doc);
        });
    })

}