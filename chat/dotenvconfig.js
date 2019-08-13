const fs = require("fs");
let path = '.env';
if (!process.env.NODE_ENV && fs.existsSync(path)) {
  require('dotenv').config({
		path: path
  });
}