import { useEffect, useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Server from "../modules/ServerConnector"

// https://react-bootstrap.netlify.app/docs/components/modal/
// Vertically centered modal
export default function PostMaker({openPic,setOpenPic,percent,setCurrentPercent}) {
  const [radioValue, setRadioValue] = useState("0");
  const [delayPictureSet,setDelayPictureSet] = useState(() => true);
  const [picturesSelected,setPicturesSelected] = useState({"start": -1,"end":-1});
  const textField = useRef(null);
  const user = "debug"; //TODO : UPDATE TO GET USER
  const radios = [
    { name: 'Start', value:"0"},
    { name: 'End', value:"1"},
  ];


  function submit(){
    const data = {
        "text": textField.current.value || "",
        "Percent1": picturesSelected.start,
        "Percent2" : picturesSelected.end,
        "user" : user
    }
    if (data.text == null){
      showError("Not enough data")
      return
    }
    if((data.endPicID == -1) || data.startPicID == -1){
      showError("Select end and beginning Pictures");
      return
    }
    Server.sendPostToServer(data,undefined);
  }

  function showError(Error){
    console.e(Error);
  }



    /* Handles putting displaying the new picture attatched to the selection*/
  useEffect(() => {
    setDelayPictureSet(true);
    setOpenPic((radioValue === "0" ? picturesSelected.start : picturesSelected.end));
  },[radioValue])


  /* This covers setting our actual picture parameters. We need to be cautious about overwriting
  user choices on changing parts, and so we have a delayer.
    */
  useEffect(() => {
    console.log(picturesSelected);
    if (delayPictureSet === true) {
        setDelayPictureSet(false);
        return
    }
    console.log("setting picture at percent",percent);
    setPicturesSelected((prev) => ((radioValue === "0") ?
        {...prev ,start:percent} :
        {...prev ,end:percent}))

  },[openPic])

  function getButtonStyleing(buttonName){
    if (buttonName === "Start"){
        return (picturesSelected.start === -1) ? 'outline-danger' : 'outline-success';
    } 
    if (buttonName === "End"){
        return (picturesSelected.end === -1) ? 'outline-danger' : 'outline-success';
    }
    console.e("Error!");
  }


  return (
    <div className="PostForm">
        <Form action={submit} >
            <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
            >
                <Form.Label>Enter Post</Form.Label>
                <Form.Control as="textarea" placeholder="Your adventure here..." rows={3} ref={textField} />
                <ButtonGroup className="picture-toggles">
                    {radios.map((radio, idx) => (
                        <ToggleButton 
                            key={idx}
                            id={`radio-${idx}`}
                            type="radio"
                            variant={getButtonStyleing(radio.name)}
                            name="radio"
                            value={radio.value}
                            checked={radioValue === radio.value}
                            onChange={(e) => setRadioValue(e.currentTarget.value)}
                        >
                        {radio.name}
                        </ToggleButton>
                    ))}
                </ButtonGroup>
                <Button className="submit-button" type="submit">Post</Button>
            </Form.Group>
        </Form>
    </div>
  );
}
