import React from 'react';
import { FaBars, FaPencilAlt } from 'react-icons/fa';
import { MdDeleteForever } from "react-icons/md";

const SideBar = ({ chats, setActiveChatId, createNewChat, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-64 h-full bg-gray-800 text-white z-50 p-6 shadow-lg">
      <button onClick={onClose} className="absolute top-6 right-4 text-xl">
        <FaBars />
      </button>
      <button onClick={createNewChat} className="mb-6">
        <FaPencilAlt className='text-2xl' />
      </button>
      <h1 className="text-lg px-5 font-bold">Chats</h1>
      <ul className="mt-4 space-y-2">
        {chats.map((chat) => (
          <li
            key={chat.id}
            onClick={() => setActiveChatId(chat.id)}
            className="cursor-pointer px-4 py-2 bg-slate-500 rounded-md hover:bg-slate-600"
          >
            {chat.chatMessages[0]?.text?.slice(0, 20) || 'New Chat'}
            <MdDeleteForever className='absolute right-[38px] top-[147px] text-xl text-slate-800' />
          </li>
        ))}
      </ul>
    </div>
  );
};


export default SideBar;
