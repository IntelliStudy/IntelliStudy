import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { File, FilePond } from 'react-filepond';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

import 'filepond/dist/filepond.min.css';

const CourseDashboard = () => {
  const { currentUser } = useContext(UserContext);
  const [files, setFiles] = useState<File[]>([]);
  const [fileCount, setFileCount] = useState(0);

  useEffect(() => {
    setFileCount(files.length);
  }, [files]);

  const handleSubmit = async () => {
    // Appends file blob object to formData for subission to BE
    if (fileCount > 0) {
      const formData = new FormData();
      files.forEach((currFile) => {
        formData.append('files', currFile.file, currFile.filename);
      });

      formData.forEach((file) => {
        console.log(file);
      });

      // Send post request to Cloud Function with Files
      try {
        console.log(import.meta.env.VITE_CLOUD_FUN_BASE_PATH);
        const response = await axios.post(
          `${import.meta.env.VITE_CLOUD_FUN_BASE_PATH}/fileUpload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        // If cloud function POST request succeeds, update 'uploadedFiles' field in DB
        if (response.status === 200) {
          // Update document in Firebase only if the POST request succeeds
          await setDoc(
            doc(db, 'users', currentUser!.uid),
            {
              uploadedFiles: true,
            },
            { merge: true }
          );
          console.log('Response:', response);
        } else {
          console.error('Failed to upload files. Status:', response.status);
        }
      } catch (error) {
        console.error('Error sending files:', error);
      }
    }
    // Handle no files uploaded
    else {
      setDoc(
        doc(db, 'users', currentUser!.uid),
        {
          uploadedFiles: false,
        },
        { merge: true }
      );
      console.log('No files to submit');
    }
  };

  return (
    <>
      <h1>Course Dashboard</h1>
      <FilePond
        files={files}
        onupdatefiles={setFiles}
        allowMultiple={true}
        maxFiles={2}
        name="files"
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />
      <div>
        <Link to={'/quiz'}>
          <button onClick={handleSubmit}>Generate Quiz</button>
        </Link>
      </div>
    </>
  );
};

export default CourseDashboard;
