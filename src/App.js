import logo from './logo.svg';
import {useEffect, useState} from 'react';
import {jwtDecode as jwt_decode}from 'jwt-decode';
import Heads from './components/header'
import './App.css';

const CLIENT_ID = "979867492503-ammrj7c12beo51f4k80nnfbmho85akkr.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/drive";

function App() {
  const [ user, setUser ] = useState({});
  const [ tokenClient, setTokenClient ] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfText, setPdfText] = useState("");
  const [question, setQuestion] = useState("");
  const [formId, setFormId] = useState("");


  const onFileChange = event => {
    setSelectedFile(event.target.files[0]);
  };

  const onFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    const response = await fetch('http://localhost:8000/uploadfile/', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    setPdfText(result.create_forms);
    setQuestion(result.questions)
    console.log('File uploaded successfully:', result);
  };

  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    var userObject = jwt_decode(response.credential);
    console.log(userObject);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
  }

  function handleSignOut(event) {
    setUser({});
    document.getElementById("signInDiv").hidden = false;
  }

  function createDriveFile() {
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

        if(tokenResponse && tokenResponse.access_token) {
          const response = await fetch(`https://forms.googleapis.com/v1/forms?key=AIzaSyDuUfQjqwoBGrd4EAvUdDNUR4v3bFpnRCA`, {  // body
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${tokenResponse.access_token}`
            },
            body: pdfText
          })
          const data = await response.json();
          console.log('Form created:', data);
          setFormId(data.formId);
          fetch(`https://forms.googleapis.com/v1/forms/${data.formId}:batchUpdate?key=AIzaSyDuUfQjqwoBGrd4EAvUdDNUR4v3bFpnRCA`, {  // body
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${tokenResponse.access_token}`
            },
            body: question
          })
        }
      }
    }));

    google.accounts.id.prompt();
  }, [pdfText, question]);

  return (
    <div className="App">
      <Heads />
      <div id="signInDiv"></div>
      { Object.keys(user).length != 0 &&
        <button onClick={(e) => handleSignOut(e)}>Sign Out</button>
      }
      { user &&
        <div>
          <img src={user.picture}></img>
          <h3>{user.name}</h3>
          <input type="submit" onClick={createDriveFile} value="Create form"></input>
          <input type="file" onChange={onFileChange} />
          <button onClick={onFileUpload}>Upload!</button>
        </div>
      }
    </div>
  );
}

export default App;
