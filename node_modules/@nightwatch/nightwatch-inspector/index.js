#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
  
module.exports = {
  crxfile: function() {
    const stream = fs.readFileSync(path.join(__dirname, 'dist/extension.crx'));
    
    return new Buffer.from(stream).toString('base64');
  }()
};
