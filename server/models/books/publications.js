Meteor.publish("myBooks", function () {

    var self = this;

    if (!self.userId) {
        return;
    }

    var selector = {
        scans: {
            $elemMatch: {
                userId: self.userId
            }
        }
    };

    var aggregateBookInfo = function (infoId) {
        return infoId && Infos.findOne({
            _id: infoId
        }).data;
    };

    var aggregateUsersData = function (scans) {
        return scans && scans.map(function (scan) {
            var user = Meteor.users.findOne({
                _id: scan.userId
            });
            scan.user = {
                _id: user._id,
                name: user.profile.name,
                pictureUrl: user.profile.pictureUrl
            };
            return scan;
        });
    };

    var handle = Books.find(selector).observeChanges({
        added: function (id, fields) {
            fields.info = aggregateBookInfo(fields.infoId);
            fields.scans = aggregateUsersData(fields.scans);
            self.added("books", id, fields);
        },
        changed: function (id, fields) {
            fields.info = aggregateBookInfo(fields.infoId);
            fields.scans = aggregateUsersData(fields.scans);
            self.changed("books", id, fields);
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
