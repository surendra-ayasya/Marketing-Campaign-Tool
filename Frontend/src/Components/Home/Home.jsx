import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaMicrophone } from 'react-icons/fa';

const Home = ({ chatMessages = [], updateChatMessages }) => {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null); // ✅ Track uploaded file
  const [headingVisible, setHeadingVisible] = useState(true);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const timeoutRef = useRef(null);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages(chatMessages);
  }, [chatMessages]);

  useEffect(() => {
    if (JSON.stringify(messages) !== JSON.stringify(chatMessages)) {
      updateChatMessages(messages);
    }
  }, [messages]);

  useEffect(() => {
    updateChatMessages(messages);
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const appendBotResponse = (messageId) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const aiMessage = {
        id: messageId + 1,
        text: 'Hi! How may I help you today?',
        sender: 'ai',
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 700);
  };

  const callFlaskImageAPI = async (prompt, imageFile) => {
    try {
      console.log("🔥 Sending request to Flask...");
      const formData = new FormData();
      formData.append('prompt', prompt);
      if (imageFile) formData.append('image', imageFile);

      const response = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('✅ Flask API response:', data);
      return data.generated_image_url || null;
    } catch (error) {
      console.error('❌ Error calling Flask API:', error);
      return null;
    }
  };

 const handleSendMessage = async (msg) => {
  if (msg.trim() || imagePreview) {
    setHeadingVisible(false);

    // Always try to send prompt and optional image
    const newUserMessage = {
      id: messages.length + 1,
      text: msg.trim() || null,
      image: imagePreview || null,
      sender: 'user',
    };

    // Add user's message
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const flaskImage = await callFlaskImageAPI(msg, uploadedFile); // uploadedFile may be null — that's okay

      if (flaskImage) {
        const aiResponse = {
          id: newUserMessage.id + 1,
          text: 'Here is the generated image:',
          image: flaskImage,
          sender: 'ai',
        };
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        const errorMessage = {
          id: newUserMessage.id + 1,
          text: '❌ Image generation failed. Please check your prompt or try again.',
          sender: 'ai',
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const fallbackMessage = {
        id: newUserMessage.id + 1,
        text: '⚠️ Something went wrong while contacting the image generator.',
        sender: 'ai',
      };
      setMessages((prev) => [...prev, fallbackMessage]);
      console.error("❌ Error in handleSendMessage:", error);
    }

    // Cleanup input and file
    setText('');
    setImagePreview(null);
    setUploadedFile(null);
    fileInputRef.current.value = '';
  }
};


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSendMessage(text);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
      setUploadedFile(file); // ✅ Store file
      console.log('Image uploaded:', file.name);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in your browser');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setText((prev) => prev + ' ' + spokenText);
    };

    recognition.start();
  };

  return (
    <div className="flex flex-col items-center max-h-screen overflow-hidden">
      {/* Scrollable Message Container */}
      <div className="flex flex-col w-screen max-w-7xl h-screen pt-28 pb-32 pr-72 pl-56 overflow-hidden">
        {headingVisible && (
          <h1 className="text-3xl font-bold text-center absolute top-96 left-1/2 transform -translate-x-1/2">
            What can I help with?
          </h1>
        )}

        <div className="flex-1 overflow-y-auto bg-gray- rounded-lg p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs sm:max-w-sm lg:max-w-md p-4 rounded-xl shadow-md ${message.sender === 'user'
                  ? 'bg-gray-600 text-white rounded-br-none'
                  : 'bg-gray-400 text-black rounded-bl-none'
                  }`}
              >
                {message.text && (
                  <p className="text-sm sm:text-base">{message.text}</p>
                )}
                {message.image && (
                  <img
                    src={message.image}
                    alt="Uploaded"
                    className="mt-2 max-h-48 rounded shadow"
                  />
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area (Footer) */}
      <div className="fixed bottom-0 left-0 w-full bg-gray shadow-lg p-4 flex justify-center">
        <div className="max-w-3xl w-full bg-[#2e2e2e] rounded-3xl px-6 py-4 shadow-lg">
          <input
            type="text"
            placeholder="Ask anything"
            className="w-full bg-transparent text-white placeholder-gray-400 outline-none text-lg"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-48 rounded shadow-md"
              />
            </div>
          )}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <button onClick={() => fileInputRef.current.click()} className="text-xl" title="Upload Image">
                <FaPlus />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <div className="flex items-center gap-4">
              <button onClick={startListening} title="Voice input">
                <FaMicrophone className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
