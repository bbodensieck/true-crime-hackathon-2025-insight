import { useState } from 'react';
import React, { useRef } from 'react';
import ReactPlayer from 'react-player';
//import { Player, ControlBar } from 'video-react';
import reactLogo from './assets/react.svg';
import Button from '@mui/material/Button';

import Robin from './assets/Robin.mp4'

import viteLogo from '/vite.svg';
import './App.css';


function App() {
  //const [count, setCount] = useState(0) /*Zählvariable für den Button*/

  const playerRef = useRef(null);
  /*const VIDEO = {
    src: 'assets/PXL_20250222_123802359.mp4',
    type:'video/mp4'
   };*/
  

  return (
    <>
      <h1>Videoanalyse</h1>

      <div>
      
      <ReactPlayer
                className='react-player fixed-bottom'
                playing={true}
                url="assets/PXL_20250222_123802359.mp4"
                height='500px'
                width='800px'
                controls={true}
      />

      </div>

      

      <div className="card">
        <p className="Transcript">
          Transscript des Videos
          
        </p>
        
      </div>
      <p className="read-the-docs">
        Klick auf die Chapters zum abspielen
      </p>
    </>
  )
}
export default App
