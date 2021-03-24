const spicedPg = require("spiced-pg");

const db = spicedPg(
    // left hand side for heroku || right hand side for localhost //
    process.env.DATABASE_URL || "postgres:jharding@localhost/images"
);

module.exports.getImages = function () {
    const query = `SELECT * FROM images
                    ORDER BY id DESC;`;
    return db.query(query);
};

module.exports.addImage = function (url, username, title, description) {
    const query = `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4)`;
    const params = [url, username, title, description];
    return db.query(query, params);
};
