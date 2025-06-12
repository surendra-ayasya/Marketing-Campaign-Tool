import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header/Header";
import SideBar from './Components/Header/SideBar';
import Home from './Components/Home/Home';

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [chats, setChats] = useState([]); //State to manage chats
  const [activeChatId, setActiveChatId] = useState(null); //State to manage active chat
  


  const createNewChat = () => {
    const newChat = {
      id: Date.now(), //To use timestamp as unique ID. 
      chatMessages: []
    };
    setChats((prev) => [newChat, ...prev]); // new chat will added to the top and previous chats will be pushed down
    setActiveChatId(newChat.id); //Set the new chat as active 
  };

  const updateMessages = (chatId, newMessages) => { //Takes chatId and updated chat messages
    setChats((prevChats)=> 
      prevChats.map((chat) => //iterate through previous chats 
      chat.id === chatId ? {...chat, chatMessages: newMessages } : chat //If chatId matches, update messages, else return the chat as is
  )
    );
  };

   const currentChat = chats.find((c) => c.id === activeChatId); //Find the current active chat based on activeChatId

  return (
    <Router>
      <div className="flex flex-2">
        {showSidebar && (
        <SideBar 
        chats ={chats} //Pass chats to sidebar
        setActiveChatId={setActiveChatId} //Pass setActiveChatId to sidebar
        createNewChat={createNewChat} //Pass createNewChat to sidebar
        onClose={() => setShowSidebar(false)} 
          /> 
          )}
        <div className="flex-1 pt-24">
          <Header onToggleSidebar={() => setShowSidebar(prev => !prev)} 
            onClick={createNewChat} // Pass createNewChat to Header
            />
          <div className="p-6">
            <Routes>
              <Route path="/" element={
                <Home
                chatMessages={currentChat?.chatMessages || []} // Pass current chat messages or empty array if no chat is active to Home
                updateChatMessages={(newMessages) => {
  if (currentChat) updateMessages(currentChat.id, newMessages);
}} // Pass updateMessages function to Home
                />
                } 
                />
              
            </Routes>
          </div>
        </div>
      </div>


    </Router>
  );
}

export default App;
