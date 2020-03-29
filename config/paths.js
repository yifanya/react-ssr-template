const path = require("path");

const getPositionParh = str => path.join(__dirname, str);

module.exports = {
	appSrc: getPositionParh("../src/index.tsx"),
	appHtml: getPositionParh("../public/index.html"),
	appBuild: getPositionParh("../build")
}