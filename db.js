const spicedPg = require("spiced-pg");

const db = spicedPg(
    // left hand side for heroku || right hand side for localhost //
    process.env.DATABASE_URL || "postgres:jharding@localhost/images"
);

module.exports.getImages = function () {
    const query = `SELECT * FROM images
                    ORDER BY id DESC
                    LIMIT 15;`;
    return db.query(query);
};

module.exports.addImage = function (url, username, title, description) {
    const query = `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4)
                    RETURNING id`;
    const params = [url, username, title, description];
    return db.query(query, params);
};

module.exports.getImageInfo = function (id) {
    const query = `SELECT *
                    FROM images
                    WHERE id = $1;`;
    const params = [id];
    return db.query(query, params);
};

module.exports.addComment = function (name, comment, id) {
    const query = `INSERT INTO comments (comment, username, image_id) VALUES ($1, $2, $3)
                    RETURNING comment, username, created_at;`;
    const params = [comment, name, id];
    return db.query(query, params);
};

module.exports.getComments = function (id) {
    const query = `SELECT id, username, comment, created_at
                    FROM comments
                    WHERE image_id = ${id}
                    ORDER BY id DESC;`;
    return db.query(query);
};

module.exports.getMoreImages = function (id) {
    const query = `SELECT url, title, id, (
                    SELECT id FROM images
                    ORDER BY id ASC
                    LIMIT 1
                    ) AS "lowestId" FROM images
                    WHERE id < $1
                    ORDER BY id DESC
                    LIMIT 9;`;
    const params = [id];
    return db.query(query, params);
};
