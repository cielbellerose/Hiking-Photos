/*This is a dot that positions itself on the map It takes an X and Y position to place
itself. It's also passed an Onclick to handle opening and closing the picture that's
attatched to it
*/
export default function MapImageDot({ID,X,Y,onClick}) {
    const style =  {
        postition:"Absolute",
        top:{X},
        left:{Y},
        backgroundColor:"red"
        }

  return (
      <circle
        style={style}
        onClick={()=>{onClick(ID)}}
      />
  );
}
