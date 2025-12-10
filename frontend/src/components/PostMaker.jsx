import { useEffect, useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Server from "../modules/ServerConnector";
import user from "../modules/user";

export default function PostMaker({ openPic, setOpenPic, percent, PrevData }) {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textField = useRef(null);
  const title = useRef(null);

  const [currentUser, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await user.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
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
  }, [percent, radioValue]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (isSubmitting) return;

    if (!currentUser) {
      showError("Please log in to create a post");
      return;
    }

    const data = {
      title: title.current.value,
      text: textField.current.value || "",
      Percent1: recordedPercent.start,
      start: picturesSelected.start,
      Percent2: recordedPercent.end,
      end: picturesSelected.end,
      user: currentUser.username || currentUser.user?.username,
    };
    console.log("submission data", data);

    if (!data.title.trim()) {
      showError("Title is required");
      return;
    }

    if (!data.text.trim()) {
      showError("Text content is required");
      return;
    }

    if (data.Percent1 === -1 || data.Percent2 === -1) {
      showError("Please select both start and end pictures");
      return;
    }

    setIsSubmitting(true);
    try {
      //decide if we're updating a post or creating a new one
      if (PrevData) {
        data._id = PrevData._id;
        await Server.updatePost(data);
        console.log("✅ Post updated successfully");
        alert("Post updated successfully!");
        // reset
        if (title.current) title.current.value = "";
        if (textField.current) textField.current.value = "";
        setPicturesSelected({ start: -1, end: -1 });
        setRecordedPercent({ start: -1, end: -1 });
      } else {
        await new Promise((resolve, reject) => {
          Server.sendPostToServer(data, (success) => {
            if (success) {
              console.log("✅ Post created successfully");
              alert("Post created successfully!");
              // reset
              if (title.current) title.current.value = "";
              if (textField.current) textField.current.value = "";
              setPicturesSelected({ start: -1, end: -1 });
              setRecordedPercent({ start: -1, end: -1 });
              resolve();
            } else {
              reject(new Error("Failed to create post"));
            }
          });
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      showError("Failed to save post: " + (error.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  }

  function showError(Error) {
    console.error(Error);
    alert(Error);
  }

  /* Handles putting displaying the new picture attatched to the selection*/
  useEffect(() => {
    setDelayPictureSet(true);
    setOpenPic(
      radioValue === "0" ? picturesSelected.start : picturesSelected.end
    );
  }, [radioValue, picturesSelected.start, picturesSelected.end, setOpenPic]);

  //handle if there's previous data
  useEffect(() => {
    if (PrevData) {
      setPicturesSelected({
        start: PrevData.start,
        end: PrevData.end,
      });
      setRecordedPercent({
        start: PrevData.Percent1,
        end: PrevData.Percent2,
      });
      console.log(recordedPercent);
    }
  }, [PrevData]);

  /* This covers setting our actual picture parameters. We need to be cautious about overwriting
  user choices on changing parts, and so we have a delayer */
  useEffect(() => {
    if (delayPictureSet) {
      setDelayPictureSet(false);
      return;
    }

    setPicturesSelected((prev) =>
      radioValue === "0"
        ? { ...prev, start: openPic }
        : { ...prev, end: openPic }
    );
  }, [openPic, radioValue, delayPictureSet]);

  function getButtonStyling(buttonName) {
    if (buttonName === "Start") {
      return picturesSelected.start === -1
        ? "outline-danger"
        : "outline-success";
    }
    if (buttonName === "End") {
      return picturesSelected.end === -1 ? "outline-danger" : "outline-success";
    }
    console.error("Error in getButtonStyling");
    return "outline-secondary";
  }

  return (
    <div className="PostForm">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Control
            as="textarea"
            defaultValue={PrevData ? PrevData.title : ""}
            className="enter-post-title"
            placeholder="Title..."
            rows={1}
            ref={title}
            required
            disabled={isSubmitting}
          />
          <Form.Control
            as="textarea"
            defaultValue={PrevData?.text || ""}
            placeholder="Your adventure here..."
            rows={3}
            ref={textField}
            disabled={isSubmitting}
          />
          <ButtonGroup className="picture-toggles">
            {radios.map((radio, idx) => (
              <ToggleButton
                key={idx}
                id={`radio-${idx}`}
                type="radio"
                variant={getButtonStyling(radio.name)}
                name="radio"
                value={radio.value}
                checked={radioValue === radio.value}
                onChange={(e) => setRadioValue(e.currentTarget.value)}
                disabled={isSubmitting}
              >
                {radio.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
          <button
            className="accent-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Post"}
          </button>
        </Form.Group>
      </Form>
    </div>
  );
}
