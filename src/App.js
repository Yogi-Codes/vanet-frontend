import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import Chat from "./Components/Chat/Chat"
import Signup from "./Components/Signup/Signup";
import Error from "./Components/Error/Error";
import { useEffect } from "react";
import Map from "./Components/Map/Map";
import MyMap from "./Components/Map/Map";



export default function App() {
  useEffect(() => {
    var result = document.getElementById("json-result");
    const Http = new XMLHttpRequest();
    function getLocation() {
        console.log("getLocation Called");
        var bdcApi = "https://api.bigdatacloud.net/data/reverse-geocode-client"

        navigator.geolocation.getCurrentPosition(
            (position) => {
                bdcApi = bdcApi
                    + "?latitude=" + position.coords.latitude
                    + "&longitude=" + position.coords.longitude
                    + "&localityLanguage=en";
                getApi(bdcApi);

            },
            (err) => { getApi(bdcApi); },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
    }
    getLocation();
    var bdcApi = "https://api.bigdatacloud.net/data/reverse-geocode-client"
    function getApi(bdcApi) {
        Http.open("GET", bdcApi);
        Http.send();
        Http.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
             
             var localityInfoRegex = /"locality": "(.*?)"/;
             var localityMatch = this.response.match(localityInfoRegex);
             console.log(localityMatch[1]);
             localStorage.setItem("Area",localityMatch[1])
            }
        };
    }
    const intervalId = setInterval(getLocation, 10000);

  return () => clearInterval(intervalId);
   
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Chat />} />
        <Route path="/:sender/:reciever/:name" element={<Chat />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Error />} />
    
 

      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);