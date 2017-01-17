const express = require('express');

const app = express();

let port = process.env.PORT || 3000


app.use(express.static(__dirname + '/public'));











app.listen(port, () => {
    console.log('Server listening on Port:',port);
})