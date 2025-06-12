import React from 'react'
import { FaBars, FaPencilAlt } from "react-icons/fa";
import { FiChevronDown, FiRefreshCcw } from "react-icons/fi";

function Header({onToggleSidebar, onClick}) {


  return (
    <header >
<div className="fixed top-0 left-0 right-0 w-full bg-gray-00 text-white flex items-center top- px-12 py-5 z-20 shadow-md">
      {/* Left side */}
      <div className="flex items-center gap-x-6">
        <div className='relative group'>
        <button onClick={onToggleSidebar}>
        <FaBars className="text-xl" />
        </button>
        <span className='absolute text-nowrap left-2 top-full mt-2 bg-gray-00 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity'>
            Side Bar
        </span>
        </div>
        <div className='relative group'>
        <button onClick={onClick}>
        <FaPencilAlt className=" text-xl" />
        </button>
        <span className='absolute text-nowrap left-2 top-full mt-2 bg-gray-00 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity'>
            New Page
        </span>
        </div>
        </div>
      {/* Middle section */}
      <div>
        <div className="top-3 absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <span className="text-2xl font-semibold">Campaign</span>
          <FiChevronDown className="text-sm" />
        </div>
      </div>

      {/* Right side */}
      <div className="absolute right-1 transform -translate-x-1/2 flex items-center gap-5">
      <div className='relative group'>
      <button onClick={onClick} className='relative group'>
        <FiRefreshCcw className="text-xl" />
        </button>
        <span className='absolute text-nowrap left-2 top-full mt-2 bg-gray-00 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity'>
            Refresh
        </span>
        </div>
        
      </div>
    </div>
    </header>
  )
}

export default Header