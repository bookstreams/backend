Meteor.publish("myBooks", function () {
    if (!this.userId) {
        return;
    }
    var selector = {
        $elemMatch: {
            userId: this.userId
        }
    };
    return Books.find(selector);
});
