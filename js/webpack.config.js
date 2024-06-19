const path = require('path'); 

module.exports = { 
    entry: { 
        content: './popup.js'
    }, 
    output: { 
        filename: 'pdf.js', 
        path: path.resolve(__dirname, 'dist')
    }
}