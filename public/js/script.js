(function () {
    // ===== ALL OUR VUE CODE GOES IN HURR ===== //

    new Vue({
        // the method has an object as it's argument
        el: "#main",
        // which ELelement will have access to our Vue code.
        data: {
            // ====== ALL MY DATA ===== //
            name: "Jamie",
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
        },

        mounted: function () {
            // ====== HAPPENS AS SOON AS THE PAGE LOADS ===== //
            // this refers to the vue instance
            // it contains the data object from our Vue instance
            axios
                .get("/board")
                .then((res) => {
                    // we can preserve "this" from the Vue instance inside axios by using an arrow function here
                    // we could also save "this" to a variable before our axios call.
                    console.log("res.data from /board", res.data);
                    this.images = res.data;
                    // console.log(this.images);
                })
                .catch((err) => {
                    console.log(err);
                });
            // there must be a route the matches in the server (back-end)
        },

        methods: {
            // ====== ALL MY FUNCTIONS ===== //
            handleChange: function (e) {
                console.log("handling change!");
                console.log("file chosen: ", e.target.files[0]);
                this.file = e.target.files[0];
            },
            handleClick: function (e) {
                // formData is for sending FILES to the server
                // the other info is optional
                var formData = new FormData();
                formData.append("file", this.file);
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);

                axios
                    .post("/upload", formData)
                    .then((resp) => {
                        this.images.unshift(resp.data);
                        console.log("response! ", resp);
                    })
                    .catch((err) => {
                        console.log("err in POST: ", err);
                    });
            },
            // add functions to show the upload form (on mobile).
            // add functions to show information on hover.
        },

        // data is VERY IMPORTANT. It has key-value pairs inside.
        // any information we want to render onscreen should be added to data.
        // anything in data is REACTIVE. Vue keeps an eye on 'data', and updates the application accordingly
    });
})();