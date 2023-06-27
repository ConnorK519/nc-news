const fs = require("fs/promises");

exports.readApiInfo = () => {
  return fs.readFile(`${__dirname}/../endpoints.json`, "utf-8").then((info) => {
    return info;
  });
};
