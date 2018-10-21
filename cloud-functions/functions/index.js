const functions = require('firebase-functions');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const databaseUrl = "XXXXX";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: databaseUrl
});
exports.createBooking = functions.firestore
    .document('details/{detail}')
    .onCreate((snap) => {
        const data = snap.data();
        const id = snap.id;
        return admin.firestore().collection('bookings').doc(id).set({date: data.date});
    });
exports.deleteBooking = functions.firestore
    .document('details/{detail}')
    .onDelete((snap) => {
        const id = snap.id;
        return admin.firestore().collection('bookings').doc(id).delete();
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
