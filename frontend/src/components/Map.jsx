import map from "../resources/APPA_Map-1.png";
import mappify from "../modules/mappify";
import MapImageDot from "./MapImageDot";
import { useRef, useEffect, useState } from "react";

export default function Map({url,openPic,setOpenPic}) {
  const [mapDots,setMapDots] = useState([])
  const mapImg = useRef(null);
  const trail = useRef(null);
  //console.log("Starting Map componant for url", url);

  //convert the data in the JSON to real things on the page
  const processJson = (json) => {
    const convertertedCooodinates = json.staticTestCoodinates.map((data) => {
      const onMap = {};
      const length = trail.current.getTotalLength();
      const point = trail.current.getPointAtLength(length * (data.percent / 100));
      onMap.X = point.x;
      onMap.Y = point.y;
      onMap.ID = data.ID;
      onMap.url = data.url;
      console.log(map);
      return onMap;
    })    
    // console.log(convertertedCooodinates);
    setMapDots(convertertedCooodinates);
    //console.log(json.staticTestCoodinates)
  }
  //getAPIitems from URL
  useEffect(() => {
    fetch(url)
    .then(r => r.json())
    .then((data) => processJson(data));
  },[])
  

  function onClickHandlerDots(ID){
    if (openPic === ID){
      setOpenPic(-1); //no pic is showing
    } else {
      setOpenPic(ID); 
    }
  }

  const scale = .908
  return (
    //709.549 3355.049"
    <div className="map">
      <img ref={mapImg}  src={map}></img> 
      <svg  viewBox={`0 0 ${700.549 * scale} ${3652.86 * scale}`}>
        {/* <MapImageDot ID={1} X={200} Y={20} onClick={()=>{}}/> */}
        {mapDots.map((dot) => <MapImageDot openID={openPic} myID={dot.ID} key={dot.ID} X={dot.X} Y={dot.Y} url={dot.url} onClick={() => onClickHandlerDots(dot.ID)}/>)}
        <path
          ref={trail}
          transform="translate(-36,-20)"
          stroke="green"
          fill="none"
          strokeWidth="0"
          d={mappify.ATPath}
        ></path>
      </svg>
    </div>
  );
}
