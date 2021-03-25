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

module.exports.getImageInfo = function (url) {
    const query = `SELECT *
                    FROM images
                    WHERE url = $1;`;
    const params = [url];
    db.query(query, params);
};
