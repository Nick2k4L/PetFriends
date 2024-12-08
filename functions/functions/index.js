const admin = require('firebase-admin');
const functions = require('firebase-functions');
const { onSchedule } = require('firebase-functions/scheduler');

admin.initializeApp();

exports.purgeUnverifiedUsers = onSchedule('every 5 minutes', async (event) => {
  try {
    const now = Date.now(); // Current timestamp in milliseconds
    const fiveMinutesAgo = now - 5 * 60 * 1000; // Five minutes ago in milliseconds

    let nextPageToken; // Used for pagination
    let deletedCount = 0;

    do {
      // List users in batches of 1000 (Firebase Admin limit)
      const result = await admin.auth().listUsers(1000, nextPageToken);

      for (const user of result.users) {
        const { uid, emailVerified, metadata } = user;
        const createdAt = new Date(metadata.creationTime).getTime();

        // Check if the user is unverified and created more than 5 minutes ago
        if (!emailVerified && createdAt < fiveMinutesAgo) {
          await admin.auth().deleteUser(uid);
          console.log(`Deleted unverified user: ${uid}`);
          deletedCount++;
        }
      }

      nextPageToken = result.pageToken; // Set the next page token for iteration
    } while (nextPageToken);

    console.log(`Finished purging unverified users. Total deleted: ${deletedCount}`);
    return `Purged ${deletedCount} unverified users`;
  } catch (error) {
    console.error("Error purging unverified users:", error);
    throw new functions.https.HttpsError('internal', 'Failed to purge unverified users.');
  }
});

exports.purgeMap = functions.pubsub.schedule('every 5 minutes').onRun(async (context) => {
  try {
    const now = Date.now(); 
    const snapshot = await db.collection('parks').get(); // Fetch all pins from 'parks' collection

    let deletedCount = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const { timestamp, duration } = data; // Assuming 'timestamp' is in Firestore Timestamp format
      const expirationTime = timestamp.toMillis() + duration * 60 * 1000; // Calculate expiration time in ms

      if (now > expirationTime) {
        await db.collection('parks').doc(doc.id).delete(); // Delete expired pin
        console.log(`Deleted expired map pin: ${doc.id}`);
        deletedCount++;
      }
    }

    console.log(`Finished purging expired map pins. Total deleted: ${deletedCount}`);
    return `Purged ${deletedCount} expired map pins.`;
  } catch (error) {
    console.error('Error purging map pins:', error);
    throw new functions.https.HttpsError('internal', 'Failed to purge expired map pins.');
  }
});