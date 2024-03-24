import React, { useState, useEffect } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import '../Main/Main.css';
import CircularProgress from '@mui/material/CircularProgress';
import GoogleMap from './GoogleMap';

const button_theme = createTheme({
  palette: { primary: { main: '#ffffff' }, text: { primary: '#141428' } },
});

async function getDoctors() {
    const response = await fetch('http://localhost:5000/doctors');
    const doctors = await response.json();
    return doctors;
}

function ChatboxComponent() {
  const [messages, setMessages] = useState([]);
  const [fixedMessage, setFixedMessage] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [inputEntered, setInputEntered] = useState(false);
  const [initialSlide, setInitialSlide] = useState(true);

  useEffect(() => {
    getDoctors().then((data) => {
      setDoctors(data);
    });
  }, []);

  useEffect(() => {
    const slideTimeout = setTimeout(() => {
      setInitialSlide(false);
    }, 1000); 
    return () => clearTimeout(slideTimeout);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const userMessage = event.target.msg.value;
  
    event.target.reset();
    setInputEntered(true);
    sendMessageToBackend(userMessage);
  };
  
  const sendMessageToBackend = async (message) => {
    try {
      const userMessage = {
        from: 'user',
        text: message,
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setIsLoading(true);
      
      if(message.includes('eye')){
        document.getElementById('doctors').innerHTML = 'Paul Meyer, O.D<br></br>Brian Atkins, OD<br></br>Tiffany K. Monahan, OD<br></br>Bailey Patricia OD' 
      }
      const response = await fetch('http://localhost:5000/entrance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
  
      if (!response.ok) {
        throw Error('Request to backend failed');
      }
    
      const data = await response.json();
  
      const aiMessage = {
        from: 'ai',
        text: data.ai_message,
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
  
      setAiResponse(data.ai_message);
    } catch (error) {
      console.error('Error sending message to the backend:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="chatbox">
        
      <link href="https://fonts.cdnfonts.com/css/arkhip" rel="stylesheet"></link>
      <div className={`left-box ${initialSlide ? 'slide-in' : ''}`}>
        {!inputEntered && (
            <div class="information">
                <div class="txt">
                You can tell me things like <bold>"I am having back pain"</bold>, and I will assess your situation.
                <br></br>
                <br></br>
                To the left, I have displayed the <bold>closest doctors to you based on your symptoms (e.g. Cardiologists for heart-related issues)</bold>
                </div>
            </div>
            )}
            {!inputEntered && (
            <div class="information-right">
                <div class="txt-2">
                <bold>Note, we are not a replacement for a doctor nor an official diagnosis software. We are meant to assist you in your health.</bold>
                </div>
            </div>
            )}

        <div className="transparent">
          <div className="transparent-name">medicAI</div>
        </div>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="input-container">
            <input className="input" type="text" name="msg" placeholder="Enter Message Here" required />
            <a>
              <ThemeProvider theme={button_theme}>
                <Button className="button" variant="contained" type="submit" disabled={isLoading}>
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                </Button>
              </ThemeProvider>
            </a>
          </div>
        </form>
        
        <div className="messages">
            {messages.map((message, index) => (
                <div className={`message-container ${message.from}`}>
                <div
                    className={`message-box ${message.from} ${message.from === 'ai' ? 'ai-message' : ''}`}
                    style={{ whiteSpace: 'pre-line' }}
                >
                    {message.text}
                </div>
                </div>
            ))}
        </div>

        </div>
        <div className={`right-top-box ${initialSlide ? 'slide-in-2' : ''}`}>
            <div class='headline'>DOCTORS NEAR YOU</div>
            <div id = "doctors">
                Joshua H Altman, MD<br></br><br></br>
                Grabove Donald E MD<br></br><br></br>
                Timothy Elder, MD<br></br><br></br>
                Jason Zaremski, MD 
            </div>
        </div>

        <div className={`right-bottom-box ${initialSlide ? 'slide-in' : ''}`}>
            <div class='headline'>DOCTOR MAP</div>
            <div class = 'map'>
                <GoogleMap />
            </div>
        </div>
    </div>
  );
}

export default ChatboxComponent;
