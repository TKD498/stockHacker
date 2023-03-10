// Dependencies
var http = require('http');
var request = require('request');
var express = require('express');

var app = express();
const redirect_uri = process.env.REDIRECT_URI;

/* 
Callback endpoint the TDA app uses.
To understand more about how the API authenticates, see this link.
https://developer.tdameritrade.com/content/simple-auth-local-apps
*/

app.get('/', (req, res) => {
    res.send(`CLICK THIS LINK TO START THE PROCESS https://auth.tdameritrade.com/auth?response_type=code&redirect_uri=${process.env.REDIRECT_URI}&client_id=${process.env.CLIENT_ID}%40AMER.OAUTHAP`)
})
app.get('/auth', (req, res) => {
    var authRequest = {
        url: 'https://api.tdameritrade.com/v1/oauth2/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            'grant_type': 'authorization_code',
            'access_type': 'offline',
            'code': req.query.code, // get the code from url
            'client_id': process.env.CLIENT_ID + "@AMER.OAUTHAP", // this client id comes from config vars
            'redirect_uri': redirect_uri
        }
    };

    // make the post request
    request(authRequest, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // parse the tokens
            var authReply = JSON.parse(body);
            // to check it's correct, display it
            res.json(authReply);
        }
    });
});
app.get('/stock', (req, res) => {
    res.send(process.env.ACCESS_token)
})

// start server
var httpServer = http.createServer(app);
var port = process.env.PORT || 8080;
httpServer.listen(port, () => {
    console.log(`Listening at ${port}`);
});