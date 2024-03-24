import React, { useState, useEffect } from 'react';
import './Main.css';
import { Link } from 'react-router-dom';
import ChatboxComponent from '../react-components/ChatboxComponent';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [transcriptLog, setTranscriptLog] = useState([]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not available in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let stopTimeout = null;

    recognition.onresult = (event) => {
      clearTimeout(stopTimeout);
      const transcriptFromSpeech = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setTranscript(transcriptFromSpeech);
      setTranscriptLog(prevLog => [...prevLog, transcriptFromSpeech]);

      stopTimeout = setTimeout(() => {
        recognition.stop();
      }, 2000);
    };

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setTranscriptLog([]);
    };

    recognition.onend = () => {
      setIsListening(false);
      clearTimeout(stopTimeout);
      console.log("Sending to backend:", transcript);
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      clearTimeout(stopTimeout);
      recognition.stop();
    };
  }, [isListening]);

  // Text-to-Speech Function
  const speak = (text) => {
    if (text !== '') {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  // return (
  //   <div style={{
  //     display: 'flex',
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     height: '50vh'
  //   }}>
  //     <div style={{
  //       width: '1px', 
  //       height: '1px',
  //       display: 'flex',
  //       justifyContent: 'center',
  //       alignItems: 'center',
  //       color: 'blue', 
  //       fontSize: '20px', 
  //     }}>
  //     </div>
  //   </div>
  // );
 

  return (
    <div className='App'>
      <header className="App-header">
        <link href="https://fonts.cdnfonts.com/css/arkhip" rel="stylesheet"></link>
        <div className = "schedule-box"></div>
        <div className = "left-side-box"></div>
        <div className = "left-side-bottom-box"></div>
        <button className="microphone" onClick={() => setIsListening(prevState => !prevState)}>
          {isListening ? 'STOP RECORDING' : 'RECORD VOICE'}
        </button>
      </header>
    </div>
  );
}

export default App;
