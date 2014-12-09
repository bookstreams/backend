Router.route("/landing-page-form", {where: "server"})
    .post(function () {
        LandingPageForms.insert(this.request.body);
        this.response.writeHead(200);
        this.response.end();
    });
