// import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import * as Busboy from 'busboy';
import { onRequest } from 'firebase-functions/v2/https';

// export const fileUpload = onDocumentUpdated('users/{userId}', (event) => {
//   if (event.data !== undefined) {
//     const newValue = event.data.after.data();
//     const oldValue = event.data.before.data();

//     if (newValue.uploadedFiles === true && oldValue.uploadedFiles !== true) {
//       console.log('Files uploaded cloud function');
//     }
//   }
// });

export const fileUpload = onRequest({ cors: true }, async (req, res) => {
  const bb = Busboy({ headers: req.headers });

  bb.on('file', (name: string, file, info) => {
    const { filename, encoding, mimeType } = info;
    console.log(
      `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
      filename,
      encoding,
      mimeType
    );
    file
      .on('data', (data) => {
        console.log(`File [${name}] got ${data?.length} bytes`);
      })
      .on('close', () => {
        console.log(`File [${name}] done`);
      });
  });
  bb.on('field', (name, val, info) => {
    console.log(`Field [${name}]: value: %j`, val);
  });
  bb.on('close', () => {
    console.log('Done parsing form!');
    res.status(200).send({ message: 'Done parsing form!' });
  });

  bb.end(req.body);
});
