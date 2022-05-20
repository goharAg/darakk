// require all *.js files in current directory
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const schemas = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach((file) => {
    const schema = require(path.join(__dirname, file));
    schemas[schema.name] = schema;
  });

module.exports = schemas;
