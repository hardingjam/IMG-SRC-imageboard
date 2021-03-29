(function () {
    // ===== ALL OUR VUE CODE GOES IN HURR ===== //

    Vue.component("replies-component", {
        template: "#comment-replies-box",
        props: ["commentId"],
        data: function () {
            return {
                replies: [],
                username: "",
                reply: "",
            };
        },
        mounted: function () {
            var self = this;
            console.log("props", self.commentId);
            return function () {
                axios.get("/replies/" + self.commentId).then((res) => {
                    self.replies = res.data;
                });
            };
        },
    });

    Vue.component("comments-component", {
        template: "#comments-box",
        props: ["id"],
        data: function () {
            return {
                comments: [], //already posted
                username: "", // input fields
                newComment: "",
                commentId: null,
            };
        },
        mounted: function () {
            var self = this;
            console.log(self.commentId);
            axios.get("/comments/" + self.id).then((res) => {
                self.comments = res.data;
            });
        },

        methods: {
            checkComment: function () {
                const commenter = document.getElementById("commenter");
                const commentText = document.getElementById("comment-text");

                console.log("checking comment");

                if (this.username && this.newComment) {
                    console.log("comment is valid");
                    commenter.classList.remove("required");
                    commentText.classList.remove("required");
                    return true;
                }

                if (!this.username) {
                    commenter.classList.add("required");
                }

                if (!this.newComment) {
                    commentText.classList.add("required");
                }
            },

            postComment: function () {
                if (this.checkComment())
                    axios
                        .post("/comment", {
                            name: this.username,
                            comment: this.newComment,
                            id: this.id,
                        })
                        .then((res) => {
                            const { username, comment, created_at } = res.data;
                            const date = created_at.slice(0, 10);
                            const time = created_at.slice(11, 19);
                            const addComment = {
                                comment: comment,
                                username: username,
                                created_at: `${time} on ${date}`,
                            };
                            console.log("new comment", addComment);
                            this.comments.unshift(addComment);
                            this.username = "";
                            this.newComment = "";
                        })
                        .catch((err) => {
                            console.log("made an error", err);
                        });
            },
        },
    });

    Vue.component("image-component", {
        template: "#image-info", // references the script id
        props: ["id"], // this is :id in the HTML
        data: function () {
            return {
                imageUrl: "",
                username: "",
                title: "",
                description: "",
                date: "",
                time: "",
            };
        },

        mounted: function () {
            //happens when component is rendered
            // the value of doSomething comes from the <component>

            // axios.get with params "image" + propname
            axios.get("/image/" + this.id).then((res) => {
                const {
                    url,
                    username,
                    title,
                    description,
                    created_at,
                } = res.data;

                this.imageUrl = url;
                this.username = username;
                this.title = title;
                this.description = description;
                this.date = created_at.slice(0, 10);
                this.time = created_at.slice(11, 19);
            });
        },

        watch: {
            // a watcher will watch for any props that change in value
            id: function () {
                console.log("id has changed");
            },
        },

        methods: {
            closeModal: function () {
                console.log(
                    "Clicked to close, emitting an event from the component"
                );
                this.activeModal = false;
                location.hash = "";
                this.$emit("close");

                // emits a custom event.
            },
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
            moreImagesExist: true,
            finalId: null,
            lowestId: null,
            errors: [],
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
                    this.lowestId = this.images[this.images.length - 1].id;
                    // console.log(this.images);
                })
                .catch((err) => {
                    console.log(err);
                });
            addEventListener("hashchange", () => {
                this.imageId = location.hash.slice(1);
            });

            document
                .getElementById("get-more-button")
                .addEventListener("click", () => {
                    console.log("clicked for more images");
                    this.getMoreImages();
                });
        },

        methods: {
            // ====== ALL MY FUNCTIONS ===== //

            checkForm: function () {
                console.log("checking form");

                if (this.title && this.username && this.description) {
                    this.errors = [];
                    return true;
                }

                this.errors = [];

                if (!this.title) {
                    this.errors.push("Please enter a title");
                }

                if (!this.description) {
                    this.errors.push("Please add a description");
                }

                if (!this.username) {
                    this.errors.push("Username required");
                }
            },

            getMoreImages: function () {
                axios
                    .get("/moreimages/" + this.lowestId)
                    .then((res) => {
                        console.log("res", res);
                        this.finalId = res.data[0].lowestId;
                        this.images.push(...res.data);
                        this.lowestId = res.data[res.data.length - 1].id;
                        if (this.lowestId == this.finalId) {
                            this.moreImagesExist = false;
                        }
                    })
                    .catch((err) => {
                        console.log("error in GET /moreimages", err);
                    });
            },

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
                if (this.checkForm()) {
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
                            //this instance does not work.
                            this.username = "";
                            this.title = "";
                            this.description = "";
                            document.querySelector('input[type="file"]').value =
                                "";
                            const icon = document.getElementById("fileicon");
                            icon.classList.remove("file-chosen");
                            const textField = document.getElementById(
                                "filename"
                            );
                            textField.innerHTML = "";
                        })
                        .catch((err) => {
                            console.log("err in POST: ", err);
                            window.alert(
                                "Either no file was selected, or selected file is too large (>2MB). Please choose another."
                            );
                            this.clearAll();
                        });
                } else {
                    console.log(this.errors);
                }
            },

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
                this.errors = [];
            },

            previewImage: function () {
                console.log("preview that shit");
            },

            closePopUp: function () {
                this.imageId = null;
                location.hash = "";
            },
        },

        // data is VERY IMPORTANT. It has key-value pairs inside.
        // any information we want to render onscreen should be added to data.
        // anything in data is REACTIVE. Vue keeps an eye on 'data', and updates the application accordingly
    });
})();
