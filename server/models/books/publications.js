Meteor.publish("myBooks", function () {

    var self = this;

    if (!self.userId) {
        return;
    }

    var selector = {
        $or: [
            // User inserted the book
            {
                userId: self.userId
            },
            // User scanned the book
            {
                scans: {
                    $elemMatch: {
                        userId: self.userId
                    }
                }
            }
        ]
    };

    var handle = Books.find(selector).observeChanges({
        added: function (id, fields) {
            var info = Infos.findOne({
                _id: fields.infoId
            });
            fields.data = info.data;
            self.added("books", id, fields);
        },
        changed: function () {
            // Think about it
        },
        removed: function (id) {
            self.removed("books", id);
        }
    });
    self.ready();
    self.onStop(function () {
        handle.stop();
    });

});
