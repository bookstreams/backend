Accounts.onCreateUser(function (options, user) {
    // Assign the proposed name
    if (options.profile) {
        user.profile = {
            name: options.profile.name,
        };
    }
    // If the user logged in with facebook, assign this optionals properties
    if (user.services.facebook) {
        user.profile.pictureUrl = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=normal";
    }
    return user;
});
