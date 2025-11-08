import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

// https://react-bootstrap.netlify.app/docs/components/modal/
// Vertically centered modal
export default function PostMaker({openPic,setOpenPic}) {
  const [radioValue, setRadioValue] = useState("0");
  const [delayPictureSet,setDelayPictureSet] = useState(() => true);
  const [picturesSelected,setPicturesSelected] = useState({"start": -1,"end":-1});
  const radios = [
    { name: 'Start', value:"0"},
    { name: 'End', value:"1"},
  ];



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
    console.log("setting picture");
    setPicturesSelected((prev) => ((radioValue === "0") ?
        {...prev ,start:openPic} :
        {...prev ,end:openPic}))

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
        <Form >
            <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
            >
                <Form.Label>Enter Post</Form.Label>
                <Form.Control as="textarea" placeholder="Your adventure here..." rows={3} />
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
