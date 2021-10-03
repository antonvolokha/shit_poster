import * as admin from 'firebase-admin';
import {firestore} from 'firebase-admin';
import Timestamp = firestore.Timestamp;

const images = admin.firestore().collection('images');

export const isSended = async (image: string): Promise<boolean> => {
    return (await images.where('image', '==', image).get()).docs.length > 0;
}

export const save = (image: string) => {
    images.add(
        {
            image: image,
            created: Timestamp.now()
        }
    );
}
