export default function MapImageDot({ X, Y, onClick, url, myID, openID }) {
  const dotStyle = {
    cx: X,
    cy: Y,
  };

  // ensure full url
  const getValidUrl = () => {
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("/")) {
      return url;
    }
    return `/user_data/${url}`;
  };

  const validUrl = getValidUrl();
  const pictureStyle = {
    position: "absolute",
    top: `${Y}px`,
    left: `${X}px`,
    transform: "translate(-50%, -100%)",
    zIndex: 10,
  };

  return (
    <>
      <circle className="Dot" style={dotStyle} onClick={onClick} />
      {myID === openID && validUrl && (
        <foreignObject>
          <img
            style={pictureStyle}
            src={validUrl}
            className="photos"
            alt="Trail photo"
          />
        </foreignObject>
      )}
    </>
  );
}
