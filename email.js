var nodemailer = require('nodemailer');
var googleapi = require('googleapis').google;
var OAuth2 = googleapi.auth.OAuth2;
var config = require('./config/config.js');

function MyMailer(data, cb) {
    var oauth2Client = new OAuth2(
        config.CLIENT_ID,
        config.CLIENT_SECRET,
        config.REFRESH_TOKEN
    );
    oauth2Client.setCredentials({
        refresh_token: config.REFRESH_TOKEN
    });
    var accessToken = oauth2Client.refreshAccessToken().then(function(res){
        return res.credentials.access_token;
    });

    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: "OAuth2",
            clientId: config.CLIENT_ID,
            clientSecret: config.CLIENT_SECRET,
        }
    });
    var plainText = 'from:'+data.email+' message:'+data.message;
    var htmlFormat = '<p><strong>Email</strong><br>'+
        data.email+'</p>'+
        '<p><strong>Message</strong><br>'+
        data.message+'</p>';
    var mailOptions = {
        from: config.APP_EMAIL,
        to: 'jemo.veldad@hotmail.com',
        subject: "Contact Me",
        text: plainText,
        html: htmlFormat,
        auth: {
            user: config.APP_EMAIL,
            refreshToken: config.REFRESH_TOKEN,
            accessToken: accessToken,
            expires: 1484314697598
        }
    };
    console.log('sending email...');
    transporter.sendMail(mailOptions, function(error, info){
        console.log('sending email...', error, info);
        error ? console.log(error) : console.log(info);
        transporter.close();
        cb({err: error, response: info});
    });

}



module.exports = MyMailer;
