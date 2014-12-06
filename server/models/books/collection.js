var CoordinatesSchema = new SimpleSchema({
    latitude: {
        type: Number,
        decimal: true
    },
    longitude: {
        type: Number,
        decimal: true
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
    userId: {
        type: String
    },
    infoId: {
        type: String
    },
    qrCode: {
        type: String,
        index: true,
        unique: true
    },
    scans: {
        type: [ScanSchema]
    }
});
BookSchema.messages({
    notUnique: "qrCode already taken"
});

Books = new Mongo.Collection("books");
Books.attachSchema(BookSchema);
