// import axios from 'axios';
// import { serverTimestamp } from 'firebase/firestore';
// import { useContext, useEffect, useState } from 'react';
// import { File, FilePond } from 'react-filepond';
// import { UserContext } from '../App';

// import {
//   addDoc,
//   collection,
//   doc,
//   limit,
//   onSnapshot,
//   orderBy,
//   query,
//   setDoc,
// } from 'firebase/firestore';
// import { db } from '../firebase/firebase';

// import 'filepond/dist/filepond.min.css';

// const CourseDashboard2 = () => {
//   const { currentUser } = useContext(UserContext);
//   const [files, setFiles] = useState<File[]>([]);
//   const [fileCount, setFileCount] = useState(0);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [quiz, setQuiz] = useState<string>('');

//   useEffect(() => {
//     setFileCount(files.length);
//   }, [files]);

//   useEffect(() => {
//     const requestQuery = query(
//       collection(db, 'users', currentUser!.uid, 'quizzes'),
//       orderBy('createdAt', 'desc'),
//       limit(1)
//     );
//     console.log(requestQuery);
//     // const quizQuery = currentUser ? query(collection(db, "users", currentUser.uid, "requests"), orderBy('createdAt', 'desc'), limit(1)) : '';

//     const unsubscribe = onSnapshot(
//       requestQuery,
//       (snapshot: { docChanges: () => any[] }) => {
//         snapshot.docChanges().forEach((snapshot) => {
//           console.log('data', snapshot.doc.data());

//           setLoading(snapshot.doc.data().loading);

//           if (loading == false) {
//             if (snapshot.doc.data().success === false) {
//               alert('Failed to generate quiz.');
//             } else {
//               setQuiz(snapshot.doc.data().quiz);
//             }
//           }
//         });
//       }
//     );

//     return () => {
//       unsubscribe();
//     };
//   }, []);

//   const quizFormat = () => {
//     if (quiz !== '') {
//       // setQuiz(quiz.replace(/^```json\s*|\s*```$/g, ''));
//       const extract = quiz.replace(/^```json\s*|\s*```$/g, '');
//       const parsedQuiz = JSON.parse(extract);
//       console.log(parsedQuiz, typeof parsedQuiz);

//       const renderOptions = (options: any) => {
//         const optionKeys = Object.keys(options);
//         return optionKeys.map((key) => (
//           <li key={key}>
//             {key}: {options[key]}
//           </li>
//         ));
//       };

//       return quiz !== '' ? (
//         <div style={{ textAlign: 'center' }}>
//           <h1>Quiz</h1>
//           {parsedQuiz.quiz.questions.map((question: any, index: number) => (
//             <div key={index}>
//               <p style={{ fontSize: '25px' }}>{question.question}</p>
//               <ul>{renderOptions(question.options)}</ul>
//               <br />
//               <b>Answer: {question.options[question.answer]}</b>
//               <br />
//               <br />
//             </div>
//           ))}
//         </div>
//       ) : (
//         ''
//       );
//     }
//   };

//   const onGenerate = (uid: string) => {
//     const quizzesRef = collection(db, 'users', `${uid}`, 'quizzes');
//     addDoc(quizzesRef, {
//       loading: true,
//       createdAt: serverTimestamp(),
//     });
//   };

//   const handleSubmit = async () => {
//     alert('File Uploaded Successfully');
//     // Appends file blob object to formData for subission to BE
//     if (fileCount > 0) {
//       const formData = new FormData();
//       files.forEach((currFile) => {
//         formData.append('files', currFile.file, currFile.filename);
//       });

//       formData.forEach((file) => {
//         console.log(file);
//       });

//       // Send post request to Cloud Function with Files
//       try {
//         console.log(import.meta.env.VITE_CLOUD_FUN_BASE_PATH);
//         const response = await axios.post(
//           `${import.meta.env.VITE_CLOUD_FUN_BASE_PATH}/fileUpload`,
//           formData,
//           {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//           }
//         );

//         // If cloud function POST request succeeds, update 'uploadedFiles' field in DB
//         if (response.status === 200) {
//           // Update document in Firebase only if the POST request succeeds
//           await setDoc(
//             doc(db, 'users', currentUser!.uid),
//             {
//               uploadedFiles: true,
//             },
//             { merge: true }
//           );
//           console.log('Response:', response);
//         } else {
//           console.error('Failed to upload files. Status:', response.status);
//         }
//       } catch (error) {
//         console.error('Error sending files:', error);
//       }
//     }
//     // Handle no files uploaded
//     else {
//       setDoc(
//         doc(db, 'users', currentUser!.uid),
//         {
//           uploadedFiles: false,
//         },
//         { merge: true }
//       );
//       console.log('No files to submit');
//     }
//   };

//   return (
//     <>
//       <h1>Course Dashboard</h1>
//       <FilePond
//         files={files}
//         onupdatefiles={setFiles}
//         allowMultiple={true}
//         maxFiles={2}
//         name="files"
//         labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
//       />
//       <div>
//         <button onClick={handleSubmit}>Upload</button>
//         {currentUser && (
//           <button onClick={() => onGenerate(currentUser.uid)}>
//             Generate Quiz
//           </button>
//         )}
//         {loading ? (
//           <div style={{ textAlign: 'center', fontSize: '20px' }}>
//             Generating quiz...
//           </div>
//         ) : (
//           <div>{quizFormat()}</div>
//         )}
//       </div>
//     </>
//   );
// };

// export default CourseDashboard2;
