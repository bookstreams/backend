var CoordinatesSchema = new SimpleSchema({
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    }
});

var ScanSchema = new SimpleSchema({
    userId: {
        type: String
    },
    date: {
        type: Number
    },
    coordinates: {
        type: CoordinatesSchema
    }
});

var BookSchema = new SimpleSchema({
    title: {
        type: String
    },
    author: {
        type: String
    },
    isbn: {
        type: String,
        optional: true
    },
    coverPictureUrl: {
        type: String
    },
    scans: {
        type: [ScanSchema]
    }
});

Books = new Mongo.Collection("books");
Books.attachSchema(BookSchema);
