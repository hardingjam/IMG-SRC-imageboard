(function () {
    // ===== ALL OUR VUE CODE GOES IN HURR ===== //
    Vue.component("image-component", {
        template: "#image-info", // references the script id
        props: ["id"],
        data: function () {
            return {
<<<<<<< HEAD
                imageUrl: "",
                username: "",
                title: "",
                description: "",
                date: "",
                time: "",
=======
                name: "Jamie",
                imageUrl: "",
                username: "",
                timestamp: "",
                title: "",
                description: "",
>>>>>>> 1b2d6431024d24aca4b24b0bf373d609242ed2df
            };
        },

        mounted: function () {
            //happens when component is rendered
            // the value of doSomething comes from the <component>
<<<<<<< HEAD
            console.log("props: ", this.id);
            // axios.get with params "image" + propname
            axios.get("/image/" + this.id).then((res) => {
                const {
                    url,
                    username,
                    title,
                    description,
                    created_at,
                } = res.data;
                console.log(created_at);

                this.imageUrl = url;
                this.username = username;
                this.title = title;
                this.description = description;
                this.date = created_at.slice(0, 10);
                this.time = created_at.slice(11, 19);
            });
=======
            console.log("props: ", this.doSomething);
            // axios.get with params "image" + propname
>>>>>>> 1b2d6431024d24aca4b24b0bf373d609242ed2df
        },

        methods: {
            closeModal: function () {
                console.log(
                    "Clicked to close, emitting an event from the component"
                );
                this.$emit("close");
                // emits a custom event.
            },
<<<<<<< HEAD
=======
            changeName: function () {
                this.name = "Carolina";
            },
>>>>>>> 1b2d6431024d24aca4b24b0bf373d609242ed2df
        },
    });

    new Vue({
        // the method has an object as it's argument
        el: "#main",
        // which ELelement will have access to our Vue code.
        data: {
            // ====== ALL MY DATA ===== //
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            imageId: null,
<<<<<<< HEAD
=======
            dynamicProps: "Here's the props from this.data",
>>>>>>> 1b2d6431024d24aca4b24b0bf373d609242ed2df
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
                const chosenFile = e.target.files[0];
                this.file = chosenFile;

                const textField = document.getElementById("filename");
                textField.innerHTML = chosenFile.name;
                const icon = document.getElementById("fileicon");
                icon.classList.add("file-chosen");
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
                        this.clearAll();
                    })
                    .catch((err) => {
                        console.log("err in POST: ", err);
                        window.alert(
                            "This image is too large, please choose another."
                        );
                        this.clearAll();
                    });
            },
<<<<<<< HEAD

            clearAll: function () {
                console.log("clearing all!");
                const inputs = document.querySelectorAll("input");
                const textField = document.getElementById("filename");
                textField.innerHTML = "";
                inputs.forEach((input) => {
                    input.value = "";
                });
                const icon = document.getElementById("fileicon");
                icon.classList.remove("file-chosen");
            },

            previewImage: function () {
                console.log("preview that shit");
            },

            closePopUp: function () {
                this.imageId = null;
=======
            closeMePlease: function () {
                console.log("closeMePlease fired from parent.methods");
>>>>>>> 1b2d6431024d24aca4b24b0bf373d609242ed2df
            },

            // add functions to show the upload form (on mobile).
        },

        // data is VERY IMPORTANT. It has key-value pairs inside.
        // any information we want to render onscreen should be added to data.
        // anything in data is REACTIVE. Vue keeps an eye on 'data', and updates the application accordingly
    });
})();
