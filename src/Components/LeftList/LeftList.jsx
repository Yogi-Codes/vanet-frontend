import React, { useEffect } from 'react';
import './LeftList.css';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from "axios";
import Url from "./../../constants.js"






function LeftList(params) {
  const [cookies, setCookie] = useCookies(['user']);
  const [list, setlist] = useState([])
  const navigate = useNavigate()
  const {func} = params;
  useEffect(() => {
    axios.get(Url.server+"/users/all").then((res)=>{
      setlist(res.data)


    })

  }, [])
  return (
    <div className='leftList'>
      <div className='header'>
        <h1>Nearby :::</h1>
        <div
       
        onClick={async ()=>{
              await setCookie("user","");
              navigate("/")
            }}
         className='logout'>
            <h2></h2>
          </div>
          <div
       
       onClick={async ()=>{
           func(false)
           }}
        className='close'>
           <h2></h2>
         </div>
        
      </div>
      
      <div className='listContainer'>
        {list.map((item) => (
          <div 
           style={{display:cookies.user===item._id?'none':'block',cursor:'pointer'}}
          key={item._id} 
          onClick={()=>{
           navigate("/"+cookies.user+"/"+item._id+"/"+item.name)
          }}
          className='listItem'>
            <h2>{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeftList;
