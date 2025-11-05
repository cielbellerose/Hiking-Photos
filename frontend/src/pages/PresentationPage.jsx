import TrailNavbar from "../components/NavBar";

export default function PresentationPage() {
  console.log("Hello from React!");

  return (
    <>
      <TrailNavbar />
      <h1>Presentation Page</h1>
      <div className="contentContainer"></div>
    </>
  );
}
