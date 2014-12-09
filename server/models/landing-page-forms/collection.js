var LandingPageFormSchema = new SimpleSchema({
    email: {
        type: String
    },
    origin: {
        type: String,
        optional: true
    }
});

LandingPageForms = new Mongo.Collection("landing-page-forms");
LandingPageForms.attachSchema(LandingPageFormSchema);
