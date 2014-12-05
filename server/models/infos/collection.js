var InfoSchema = new SimpleSchema({
    isbn: {
        type: String,
        index: true,
        unique: true
    },
    data: {
        type: Object,
        blackbox: true
    }
});

Infos = new Mongo.Collection("infos");
Infos.attachSchema(InfoSchema);
