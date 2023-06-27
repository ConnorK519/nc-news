const fs = require("fs").promises;

exports.readApiInfo = () => {
  return fs.readFile(`${__dirname}/../endpoints.json`, "utf-8", (err, data) => {
    if (err) {
      throw err;
    } else {
      return data;
    }
  });
};
