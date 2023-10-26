const FileStream = require('fs');
const fs = require("fs");

module.exports = {
    FileService: function () {
        return {
            readJsonFileAsync: function (path) {
                return new Promise((resolve, reject) => {
                    fs.readFile(path, "utf-8", (err, data) => {
                        if (err) {
                            reject(err)
                        }
                        resolve(JSON.parse(data));
                    });
                });
            }
        }
    }
}