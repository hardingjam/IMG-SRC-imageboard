const spicedPg = require("spiced-pg");

const db = spicedPg(
    // left hand side for heroku || right hand side for localhost //
    process.env.DATABASE_URL || "postgres:jharding@localhost/images"
);

module.exports.getImages = function () {
    const query = `SELECT * FROM images
                    ORDER BY id DESC
                    LIMIT 9;`;
    return db.query(query);
};

module.exports.addImage = function (url, username, title, description) {
    const query = `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4)
                    RETURNING id`;
    const params = [url, username, title, description];
    return db.query(query, params);
};

module.exports.getId = function () {
    const query = `SELECT id
                    FROM images 
                    ORDER BY id DESC 
                    LIMIT 1;`;
    return db.query(query);
};

module.exports.getImageInfo = function (id) {
    const query = `SELECT *
                    FROM images
                    WHERE id = $1;`;
    const params = [id];
    return db.query(query, params);
};

module.exports.addComment = function (comment, name) {
    const query = `INSERT INTO comments (comment, username) VALUE ($1, $2)
                    RETURNING id;`;
    const params = [comment, name];
    return db.query(query, params);
};
