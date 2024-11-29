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
