import logo from './logo.svg';
import {useEffect, useState} from 'react';
import {jwtDecode as jwt_decode}from 'jwt-decode';
import Heads from './components/header'
import Foots from './components/footer';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './components/home';

import Loading from './components/loading';
import './loading.css';

const CLIENT_ID = "979867492503-ammrj7c12beo51f4k80nnfbmho85akkr.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/drive";

function Start() {
  const [ user, setUser ] = useState({});
  const [ tokenClient, setTokenClient ] = useState({});
  const [ selectedFile, setSelectedFile ] = useState(null);
  const [ pdfText, setPdfText ] = useState("");
  const [ question, setQuestion ] = useState("");
  const [ formId, setFormId ] = useState("");

  const [uploadStatus, setUploadStatus] = useState('');
  const [dragging, setDragging] = useState(false);

  const [textInput, setTextInput] = useState('');
  const [response, setResponse] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(false);
  const [GOOGLE_API_KEY, setGoogle] = useState('');


  const handleDragOver = (event) => {
    event.preventDefault();
    if (!dragging) {
      setDragging(true);
    }
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const files = event.dataTransfer.files;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    console.log('Files:', files);
    // Simulate file upload success
    setTimeout(() => {
      setUploadStatus(`Successfully uploaded ${files.length} file(s)`);
    }, 1000);
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    handleFiles(files);
  };


  const onFileChange = event => {
    setSelectedFile(event.target.files[0]);
    setTimeout(() => {
      setUploadStatus(`Successfully uploaded file`);
    }, 1000);
  };

  const onFileUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    if (textInput) {
      formData.append('text', textInput);
    }

    const response = await fetch('http://localhost:8000/uploadfile/', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    const filename = new FormData();
    filename.append('text', result.pdf_name);

    const vector = await fetch(`http://localhost:8000/vector?name=${result.pdf_name}`);

    const lol = await vector.json();

    setPdfText(lol.form_name);
    setQuestion(lol.questions);
    setGoogle(lol.google_api_key);

    console.log('File uploaded successfully:', lol);
    setLoading(false);
    setMessage('Готов к созданию формы');
  };

  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    var userObject = jwt_decode(response.credential);
    console.log(userObject);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
  }

  const createDriveFile = async() => {
    tokenClient.requestAccessToken();
  }

  useEffect(() => {
    /* global google */
    const google = window.google;
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large" }
    );

    setTokenClient(
      google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES, 
      callback: async (tokenResponse) => {
        console.log(tokenResponse);
        console.log(pdfText);
        console.log(question);

        if(tokenResponse && tokenResponse.access_token) {
          const response = await fetch(`https://forms.googleapis.com/v1/forms?key=${GOOGLE_API_KEY}`, {  // body
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${tokenResponse.access_token}`
            },
            body: `{"info":{"title": ${pdfText}}}`
          })
          const data = await response.json();
          console.log('Form created:', data);
          await setFormId(data.formId);
          await fetch(`https://forms.googleapis.com/v1/forms/${data.formId}:batchUpdate?key=${GOOGLE_API_KEY}`, {  // body
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${tokenResponse.access_token}`
            },
            body: `{"requests":[{"updateSettings":{"settings":{"quizSettings":{"isQuiz":true}},"updateMask":"quizSettings.isQuiz"}}]}`
          })
          await setResponse(`https://docs.google.com/forms/d/${data.formId}/edit`);
        
          await fetch(`https://forms.googleapis.com/v1/forms/${data.formId}:batchUpdate?key=${GOOGLE_API_KEY}`, {  // body
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${tokenResponse.access_token}`
            },
            body: question
          })
          setResponse(`https://docs.google.com/forms/d/${data.formId}/edit`);
        }
      }
    }));

    google.accounts.id.prompt();
  }, [pdfText, question, GOOGLE_API_KEY]);


  return (
    <div className="App">
      <Heads />
      <div className="flex flex-col items-center justify-between p-4 m-7">
        <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
          <div
              id="dropzone"
              className={`dropzone p-8 text-center border-2 border-dashed rounded-lg transition-colors ${dragging ? 'bg-gray-100' : 'bg-white'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <p className="mb-4 text-lg font-semibold text-gray-700">Drag & Drop your files here</p>
              <p className="text-sm text-gray-500">or click to select files</p>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                multiple
                onChange={onFileChange}
              />
          </div>
          {uploadStatus && (
              <div className="mt-4 p-2 text-green-700 bg-green-100 border border-green-400 rounded">
                {uploadStatus}
              </div>
          )}
        </div>  
        <div>
            <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Напишите свои предпочтения для формы" className="flex-1 p-2 m-5 border border-gray-200 rounded-l-lg" />
            <button className="m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50" onClick={onFileUpload}>Загрузить!</button>
            {loading ?                 <div><div className='flex items-center justify-center'>
      <div className="spinner"></div>
      </div>
      <div className='flex items-center justify-center'>
      <p className="loading-text text-sm">Получаем ответ от ИИ</p>
    </div> </div> : <div id="ready">{message}</div>}
        </div>
        <input className="my-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50" type="submit" onClick={createDriveFile} value="Создать форму"></input>        
        <p>Google Forms link: </p>{response && <p><a href={response} className='underline text-cyan-500'>{response}</a></p>}
      </div>
      <Foots />
    </div>
  );
}

export default Start;