import { useEffect, useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Server from "../modules/ServerConnector";
import user from "../modules/user";

// https://react-bootstrap.netlify.app/docs/components/modal/
// Vertically centered modal
export default function PostMaker({
  openPic,
  setOpenPic,
  percent,
  setCurrentPercent,
  PrevData,
}) {
  const [radioValue, setRadioValue] = useState("0");
  const [delayPictureSet, setDelayPictureSet] = useState(() => true);
  const [picturesSelected, setPicturesSelected] = useState({
    start: -1,
    end: -1,
  });
  const [recordedPercent, setRecordedPercent] = useState({
    start: -1,
    end: -1,
  });
  const textField = useRef(null);
  const title = useRef(null);

  // if you need the user use the currentUser var
  const [currentUser, setUser] = useState(null);
  useEffect(() => {
    async function fetchUser() {
      const userData = await user.getCurrentUser();
      setUser(userData);
    }
    fetchUser();
  }, []);

  const radios = [
    { name: "Start", value: "0" },
    { name: "End", value: "1" },
  ];

  useEffect(() => {
    if (radioValue === "0") {
      setRecordedPercent((prev) => ({ ...prev, start: percent }));
    } else setRecordedPercent((prev) => ({ ...prev, end: percent }));

    //console.log("precent",recordedPercent);
  }, [percent]);

  function submit() {
    const data = {
      title: title.current.value,
      text: textField.current.value || "",
      Percent1: recordedPercent.start,
      start: picturesSelected.start,
      Percent2: recordedPercent.end,
      end: picturesSelected.end,
      user: user,
    };
    console.log("submission data", data);
    if (data.text == null || data.title == "") {
      showError("Not enough data");
      return;
    }
    if (data.Percent1 == -1 || data.Percent2 == -1) {
      showError("Select end and beginning Pictures");
      return;
    }

    //decide if we're updating a post or creating a new one
    if (PrevData) {
      data._id = PrevData._id;
      Server.updatePost(data);
    } else {
      Server.sendPostToServer(data, undefined);
    }
  }

  function showError(Error) {
    console.error(Error);
  }

  /* Handles putting displaying the new picture attatched to the selection*/
  useEffect(() => {
    setDelayPictureSet(true);
    setOpenPic(
      radioValue === "0" ? picturesSelected.start : picturesSelected.end
    );
  }, [radioValue]);

  //handle if there's previous data
  useEffect(() => {
    if (PrevData) {
      setPicturesSelected((prev) => ({
        start: PrevData.start,
        end: PrevData.end,
      }));
      setRecordedPercent(() => ({
        start: PrevData.Percent1,
        end: PrevData.Percent2,
      }));
      console.log(recordedPercent);
    }
  }, []);

  /* This covers setting our actual picture parameters. We need to be cautious about overwriting
  user choices on changing parts, and so we have a delayer.
    */
  useEffect(() => {
    //console.log(picturesSelected);
    if (delayPictureSet === true) {
      setDelayPictureSet(false);
      return;
    }

    setPicturesSelected((prev) =>
      radioValue === "0"
        ? { ...prev, start: openPic }
        : { ...prev, end: openPic }
    );

    // console.log("setCurrentPercent",percent);
    // console.log("setpictureSelected",picturesSelected);
    // console.log("openPic",openPic);
  }, [openPic]);

  function getButtonStyleing(buttonName) {
    if (buttonName === "Start") {
      return picturesSelected.start === -1
        ? "outline-danger"
        : "outline-success";
    }
    if (buttonName === "End") {
      return picturesSelected.end === -1 ? "outline-danger" : "outline-success";
    }
    console.e("Error!");
  }

  return (
    <div className="PostForm">
      <Form action={submit}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Control
            as="textarea"
            defaultValue={PrevData ? PrevData.title : ""}
            className="enter-post-title"
            placeholder="Title..."
            rows={1}
            ref={title}
          />
          <Form.Control
            as="textarea"
            defaultValue={PrevData ? PrevData.text : ""}
            placeholder="Your adventure here..."
            rows={3}
            ref={textField}
          />
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
          <Button className="submit-button" type="submit">
            Post
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}
