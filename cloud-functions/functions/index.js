const functions = require('firebase-functions');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const nodemailer = require('nodemailer');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

let mailing;
let transporter;
try {
    mailing = require('./mailing.js');
    transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
            user: mailing.sender.email,
            pass: mailing.sender.password
        }
    });
} catch (e) {
    mailing = null;
}

exports.createBooking = functions.firestore
    .document('details/{detail}')
    .onCreate((snap) => {
        const data = snap.data();
        if (mailing) {
            const mailOptions = {
                from: mailing.sender.email,
                to: mailing.receiver,
                subject: 'New reservation',
                html: '<p style="font-size: 16px;">' + data.name + ' has made a reservation:</p>' +
                    'Date: ' + data.date + '<br> ' +
                    'Phone: ' + data.phone + '<br> '
            };
            transporter.sendMail(mailOptions);
        }
    });

exports.createToken = functions.https.onRequest((req, res) => {
    const corsFn = cors();
    corsFn(req, res, function () {
        const uid = req.body.data.code;
        admin.firestore().collection('details').where('code', '==', uid).get().then(data => {
            if (data.empty) return res.send({success: false});
            return admin.auth()
                .createCustomToken(uid)
                .then(customToken => {
                    return res.send({success: true, customToken: customToken});
                })
                .catch(() => {
                    return res.send({success: false});
                });
        });
    });
});
