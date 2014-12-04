Meteor.methods({

    addBookScan: function (bookId, coordinates) {
        var user = Meteor.user();
        if (!user) {
            return;
        }
        var scan = {
            userId: user._id,
            date: Date.now(),
            coordinates: coordinates
        };
        var selector = {
            _id: bookId
        };
        var modifier = {
            $push: {
                scans: scan
            }
        };
        Books.update(selector, modifier);
    }

});
