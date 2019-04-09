const path = require('path');

// Exports the path of the main module where this application has been started
// which in this case is the app.js
module.exports = path.dirname(process.mainModule.filename);