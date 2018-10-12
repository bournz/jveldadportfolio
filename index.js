var express = require('express');
var app = express();
var config = require('./config/config.js');
var path = require('path');
var email = require('./email.js');
var bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get('/index', function(req, res) {
    res.redirect('/');
});

app.get('/about', function(req, res) {
    res.sendFile(path.join(__dirname, '/views/about.html'));
});

app.get('/contact', function(req, res) {
    res.sendFile(path.join(__dirname, '/views/contact.html'));
});

app.post('/mail', function(req, res){
    console.log('req.body', req.body);
    if(req.body && req.body.email) {
        email(req.body, function(result){
            console.log('result', result);
            res.send((result.err === null) ? 'thankyou' : 'error');
        });
    } else {
        res.send('error');
    }
})

app.listen(config.PORT, function(){
    console.log('Listening to localhost port', config.PORT);
    // email();
});
