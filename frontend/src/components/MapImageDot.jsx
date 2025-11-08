/*This is a dot that positions itself on the map It takes an X and Y position to place
itself. It's also passed an Onclick to handle opening and closing the picture that's
attatched to it
*/
export default function MapImageDot({X,Y,onClick,url,myID,openID}) {
    //console.log(X,Y,url);
    const dotStyle =  {
        postition:"Absolute",
        cx:X,
        cy:Y,
        }
    const pictureStyle = {
      top: Y,
      left: X
    }

  return (
    <>
      <circle
        className="Dot"
        style={dotStyle}
        onClick={onClick}
      />
        {(myID === openID) ? 
        <foreignObject>
                <img style={pictureStyle} src={url} className="photos"></img>
        </foreignObject>
        :
        <div></div>}
      
    </>
  );
}
