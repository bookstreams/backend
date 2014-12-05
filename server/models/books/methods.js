var getInfoId = function (isbn) {
    var info = Infos.findOne({
        isbn: isbn
    });
    if (info) {
        return info._id;
    }
    var isbndbBaseUrl = [
        "http://isbndb.com/api/v2/json/",
        process.env.ISBNDB_API_KEY,
        "/book/"
    ].join("");
    var data = HTTP.get(isbndbBaseUrl + isbn).data;
    return Infos.insert({
        isbn: isbn,
        data: data
    });
};


Meteor.methods({

    insertBook: function (isbn, qrCode) {
        var user = Meteor.user();
        if (!user) {
            return;
        }
        Books.insert({
            userId: user._id,
            infoId: getInfoId(isbn),
            qrCode: qrCode,
            scans: []
        });
    },

    addBookScan: function (qrCode, coordinates) {
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
            qrCode: qrCode
        };
        var modifier = {
            $push: {
                scans: scan
            }
        };
        Books.update(selector, modifier);
    }

});
