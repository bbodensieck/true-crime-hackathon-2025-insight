import ReactPlayer from 'react-player';
//import { Player, ControlBar } from 'video-react';
import './App.css';
import VideoPlayer from './VideoPlayer';


function App() {
  //const [count, setCount] = useState(0) /*Zählvariable für den Button*/

  // const playerRef = useRef(null);
  // /*const VIDEO = {
  //   src: 'assets/PXL_20250222_123802359.mp4',
  //   type:'video/mp4'
  //  };*/
  

  return (
    <>
      <h1>Videoanalyse</h1>

      <div>
        <VideoPlayer />
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
