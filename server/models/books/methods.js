var getInfoId = function (isbn) {
    var info = Infos.findOne({
        isbn: isbn
    });
    if (info) {
        return info._id;
    }
    var gbApiBaseUrl = "https://www.googleapis.com/books/v1/volumes";
    var req = HTTP.get(gbApiBaseUrl, {
        params: {
            q: "isbn+" + isbn,
            key: process.env.GB_API_KEY
        }
    });
    var data = JSON.parse(req.content).items[0];
    var infoId = Infos.insert({
        isbn: isbn,
        data: data
    });
    return infoId;
};


Meteor.methods({

    insertBook: function (isbn, qrCode, coordinates) {
        var user = Meteor.user();
        if (!user) {
            throw Meteor.Error("login-required", "Login required");
        }
        var infoId;
        try {
            infoId = getInfoId(isbn);
        } catch (e) {
            throw new Meteor.Error("book-info-retrieval", "Could not retireve book info");
        }
        // TODO
        // We should have a list of whitelisted qrCodes, and check
        // the user provided one against it, so that we can enforce
        // qrCodes pointing to http://bookstreams.org
        try {
            Books.insert({
                userId: user._id,
                infoId: infoId,
                qrCode: qrCode,
                scans: [{
                    userId: user._id,
                    date: Date.now(),
                    coordinates: coordinates
                }]
            });
        } catch (e) {
            if (Books.find({qrCode: qrCode}).count() === 1) {
                throw new Meteor.Error("book-duplicate-qrcode", "This QRCode has already been used");
            } else {
                throw new Meteor.Error("book-validation-error", "Bad format");
            }
        }
    },

    addBookScan: function (qrCode, coordinates) {
        var user = Meteor.user();
        if (!user) {
            throw Meteor.Error("login-required", "Login required");
        }
        var scan = {
            userId: user._id,
            date: Date.now(),
            coordinates: coordinates
        };
        var selector = {
            $and: [
                // The qrCode matches
                {
                    qrCode: qrCode
                },
                // The book has never been scanned by this user
                {
                    scans: {
                        $not: {
                            $elemMatch: {
                                userId: user._id
                            }
                        }
                    }
                }
            ]
        };
        var modifier = {
            $push: {
                scans: scan
            }
        };
        var updatedBooks = Books.update(selector, modifier);
        if (updatedBooks === 0) {
            if (Books.find({qrCode: qrCode}).count() === 1) {
                throw new Meteor.Error("book-already-scanned", "You already scanned this book");
            } else {
                throw new Meteor.Error("book-does-not-exist", "The book does not seem to exist");
            }
        }
    }

});
