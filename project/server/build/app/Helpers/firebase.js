"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notify = void 0;
const lodash_1 = __importDefault(require("lodash"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
function verifyFCMToken(fcmToken) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(secret),
    });
    return firebase_admin_1.default.messaging().send({
        token: fcmToken,
    }, true);
}
async function notify(devices, data) {
    try {
        console.log(data);
        console.log(devices, 'devices');
        lodash_1.default.each(devices, async (device) => {
            verifyFCMToken(device.device_id)
                .then(async (result) => {
                console.log(result, 'valid');
                var payload = {
                    token: device.device_id,
                    notification: {
                        title: 'title',
                        body: 'body',
                    },
                    data: {
                        score: '850',
                        time: '2:45',
                    },
                };
                firebase_admin_1.default
                    .messaging()
                    .send(payload)
                    .then((response) => {
                    console.log('Successfully sent message:', response);
                })
                    .catch((error) => {
                    console.log('Error sending message:', error);
                });
            })
                .catch((err) => {
                console.log('ERROR', err);
            });
        });
    }
    catch (exception) {
        console.log('exception');
    }
}
exports.notify = notify;
const secret = {
    type: 'service_account',
    project_id: 'test-notification-515c9',
    private_key_id: '3ef5b0b74a3a3ef6cdce67bbc879fd8ef32ece37',
    private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCq12yrCoXWZmOf\nWfQaHqg9N0c3Ki4kdVZU1AYkw2bwZ+26EAX8Zjb2eB5LTZGKgBhKnsgt0I55HCS1\noPUbBlxuxK+XMP6/ajmNig168mjK4Fw+WGkpopqwowUllMsyPwvy/FMd0k1RtwLx\nyf/W4QNNwiDFSz7QEAFgDfVK48WTYnFTZtpeTVpBgqN5zyFeLr9XN2I2sXjmnvGw\nQ5HylhxvVjLq4s5yQHiY+NuKXb+JyBUWtF72KcJl1Gcmw6xi7aD8UjythN1pvupm\nRcCF4tLHDfocdE5pigxeNyvt6g18BY5AFYktUr5FqLfF8ti34JvAp7sSmTePNUvg\nP19KAC0rAgMBAAECggEAOxWU+hSCFBPGKYLZNr1ajw1SnmQCoE5KZL0NQOKpc8Rl\nxb8r6s5I/PWu+HkjuCQ0An6mmZ2y4HTYx04a5tVM22w/lAj4Waf5rpdLsTUsA9oT\nXOaDvEgFusgujABJRB/k2Izmi/5DCltCc+/aAO1CEL7uSX2MBDY824UIS/W5S46j\nJi3FhSSXHeztrdMT9zybn93aOyp/s4a8hHc+B3Vt3o71POpZ/9hr1D5Q1QaRoLj6\nROsl98/V1r7l7aMsdIpfcWvIjfYxUUR1DP7DGhP4wHSl8RjD/eH5Lw/ZoHb19TNN\nRQKmLe+0k0B8i/SAFKDHsDZ8m1e8PriYtuis9DQmXQKBgQDqyH0X/rkqMW5SMGM2\n/OyOZ4iBfIBwPHp9NzBmgKvVUiPZz/cuDFytu7x/51BYnHxtZq4d6h4pi+3EVkT/\nJQ7Mw5O+bQVCo6Gm8SrS4p3zOdt/hp6j/tFxVoUHKx/7MSujBBYe8MEum/fA3Svs\nf1J8612443IxP4qCv3ZV+bkKPQKBgQC6R7MC+W8atFCohL/sF9kLcw7DWX651rB8\ndL2M4F3RoHFqEMm+UMCvwUv0gEy36YtkH7aGref9JDv7gACDjmGIDADVNnRlp8YN\ntN2qK7JmXauTfMIQD9VD38Y9ibR3L6Ugt4Xqb6T/zYGNNtKoU7hxmc230mKdT35t\nLBY+KyJThwKBgBUpWvUVtXTTHcF0sQycwWmYdVpOcXksSlIM7mTexh4lGCwirYHO\nBXB3Umco3zoNaL2nmpwBpRRTk2u15uQkX/Ae1Ks+QlIeU4yrghOd72Sj21/kL1pS\ntmgDx1u9DFXkua0oyiGhy5e64RrWFIZtd27g/AKVJY7Azmg4f58CMiZ1AoGBAKjA\nT1EAekAs3WzsZZkRuZP/tX4O0xizfsogT58RmqxOtq+pabm5GfWeHJrwp49sSNR5\nTjcP0Duo2ZXqzYxgLca7aP2+CRAWPvsnwC9qyoCllstTl9JJJaAJVmNlHlFinirX\nVr+cSFNb7mLpKUlIHqz68jv2oVN1MkjgSX4kQUJ9AoGBAJCSmjNfjSnjA7UYWiLr\nITyMkGiCS2OT4pklrGf7IwkiKE4oROR8eKGZJ7RzXjXj9o27GWqWF3Qsmy1LK8Xq\nH+z8Mo1LaB5j9BszZkIFuwu3tvcZMVGSH6meNVOVQM/etRe3KlapzTypnRNHQYfG\n9uz5azdtqRxrAFKHnN2d8suT\n-----END PRIVATE KEY-----\n',
    client_email: 'firebase-adminsdk-ilsoq@test-notification-515c9.iam.gserviceaccount.com',
    client_id: '106434308156608384659',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ilsoq%40test-notification-515c9.iam.gserviceaccount.com',
};
//# sourceMappingURL=firebase.js.map