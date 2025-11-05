import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import AddPostModal from "./components/AddPostModal.jsx";
import NewPostsPage from "./pages/NewPostsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import TrailEditPage from "./pages/TrailEditPage.jsx";
import PresentationPage from "./pages/PresentationPage.jsx";
import "../index.css";
const root = document.getElementById("root");

//Adding a react DOM to handle routing

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <StrictMode>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<TrailEditPage />} />
        <Route path="/new" element={<NewPostsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/view" element={<PresentationPage />} />
      </Routes>
    </StrictMode>
  </BrowserRouter>
);
