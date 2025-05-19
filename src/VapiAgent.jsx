import React, { useState, useRef } from 'react';
import { Paper, Typography, Box, IconButton } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

const VapiAgent = () => {
  const [messages, setMessages] = useState([
    { from: 'agent', text: 'Hello! How can I help you today?' }
  ]);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setMessages((msgs) => [...msgs, { from: 'user', text: transcript }]);
      // Call your backend instead of Vapi SDK
      try {
        const response = await fetch('http://localhost:3001/api/vapi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: transcript })
        });
        const data = await response.json();
        const agentReply = data.reply || data.message || 'Sorry, I did not understand that.';
        speak(agentReply);
        setMessages((msgs) => [...msgs, { from: 'agent', text: agentReply }]);
      } catch (error) {
        speak('Sorry, there was an error.');
        setMessages((msgs) => [...msgs, { from: 'agent', text: 'Sorry, there was an error.' }]);
      }
    };

    recognition.onend = () => setListening(false);

    recognition.start();
    setListening(true);
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    recognitionRef.current && recognitionRef.current.stop();
    setListening(false);
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new window.SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 420, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Patient Support Companion
      </Typography>
      <Box sx={{ minHeight: 200, mb: 2 }}>
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              textAlign: msg.from === 'user' ? 'right' : 'left',
              my: 1
            }}
          >
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                px: 2,
                py: 1,
                borderRadius: 2,
                bgcolor: msg.from === 'user' ? 'primary.main' : 'grey.200',
                color: msg.from === 'user' ? 'primary.contrastText' : 'text.primary'
              }}
            >
              {msg.text}
            </Box>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <IconButton
          color={listening ? 'error' : 'primary'}
          onClick={listening ? stopListening : startListening}
          size="large"
        >
          {listening ? <StopIcon /> : <MicIcon />}
        </IconButton>
      </Box>
      <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'center' }}>
        {listening ? 'Listening...' : 'Tap the microphone to speak'}
      </Typography>
    </Paper>
  );
};

export default VapiAgent;