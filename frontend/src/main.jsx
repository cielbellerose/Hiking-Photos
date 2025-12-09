import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import NewPostsPage from "./pages/NewPostsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import TrailEditPage from "./pages/TrailEditPage.jsx";
import PresentationPage from "./pages/PresentationPage.jsx";
import PostListPage from "./pages/PostListPage.jsx";

import "../index.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <StrictMode>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<TrailEditPage />} />
        <Route path="/new" element={<NewPostsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/view" element={<PresentationPage />} />
        <Route path="/viewPost/:user" element={<PostListPage />} />
      </Routes>
    </StrictMode>
  </BrowserRouter>
);
