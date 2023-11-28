import React, { useState, useEffect } from 'react';
import './ChatWindow.css';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Url from '../../constants';
import MyMap from '../Map/Map';  // Import the correct Map component



function ChatWindow() {
  localStorage.setItem("called", 0);


  let { name, sender, reciever } = useParams();
  const [messages, setMessages] = useState([]);
  const [cookies] = useCookies(['user']);
  const [input, setinput] = useState("");
  const [x, setX] = useState(true);
  const [nearbyPoints, setNearbyPoints] = useState([]);


  useEffect(() => {
 
    const intervalId = setInterval(() => {
   
     axios.get("https://tiny-ruby-jackrabbit-belt.cyclic.app//getAllLocations").then((res)=>{
      
      if(nearbyPoints!=res.data){

        setX(false);
        
        setNearbyPoints(res.data);
       setTimeout(() => {
        if(res.data.length>0){
          setX(true)
        }
      
        
       }, 1);
      
      
   
      }

     })
    }, 5000);

   
    return () => {
 
      // clearInterval(intervalId);
      // console.log('Cleanup function executed.');
    };
  }, []);


 

  


  


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(Url.server + "/chats/" + sender + "/" + reciever);
  
       
        if(response.data!=messages){
          setMessages(response.data);

        }
      } catch (error) {
        console.error(error);
      }
    };

    const intervalId = setInterval(() => {
      fetchData();
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup function to clear the interval when the component unmounts

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sender, reciever]);

  function handleClick() {
    const newMessage = {
      text: input,
      sender: sender,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = messages.concat(newMessage);

    axios.post(`${Url.server}/chats`, {
      sender: sender,
      reciever: reciever,
      messages: updatedMessages
    }).then((res) => {
      console.log("mess", res);
      document.getElementById("inp").value = "";
    }).catch((error) => {
      console.error(error);
    });
  }

  return (
    <>
      <div className='chat-window'>
        <div className='chat-header'>
          Chat with {name} {"        - "} Location : {localStorage.getItem("Area")}
        </div>

        {x?<MyMap points={nearbyPoints} />:<div style={{
  height:"400px",
  width: "80%",
  float: "left",
  margin:"10px"
}}></div>}
   
 

        <div className='chat'>
          <div className='chat-messages' style={{ height: "10vh" }}>
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                <p style={{ backgroundColor: message.sender === cookies.user ? '#e0e0e0' : '#87CEEB' }}>
                  {message.text}
                </p>
              </div>
            ))}
          </div>
          <div className='chat-input'>
            <input
              id='inp'
              className='input'
              onChange={(e) => {
                setinput(e.target.value);
              }}
              type='text'
              placeholder='Type a message...'
            />
            <button
              onClick={() => {
                handleClick();
              }}
              className='button'>&rarr;</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatWindow;
