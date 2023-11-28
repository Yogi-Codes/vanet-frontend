import React from 'react'
import "./Chat.css"
import LeftList from '../LeftList/LeftList'
import ChatWindow from '../ChatWindow/ChatWindow'
import { useState } from 'react'

function Chat() {
  const [Show, setShow] = useState(true)
  return (
    <div className='main' >
  {Show? <LeftList func={setShow} />:<button
   onClick={()=>{setShow(true)}} 
   style={{
    position: 'absolute',
    top: '20px',  // Adjust this value to position the button as needed
    left: '50%',
    transform: 'translateX(-50%)',  // Center the button horizontally
    zIndex: 3
  }}
   >show</button>}

  
   <ChatWindow/>

    
    </div>
  )
}

export default Chat