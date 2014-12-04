var yes = function () {
    return true;
};

Books.allow({
    insert: yes,
    update: yes,
    remove: yes
});
