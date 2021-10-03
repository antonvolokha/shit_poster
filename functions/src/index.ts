import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp(functions.config().firebase);
} else {
    admin.app();
}

// eslint-disable-next-line max-len
import * as ShitPosterSchedule from './Presentation/Schedule/ShitPosterSchedule';

exports.shitPoster = ShitPosterSchedule;
