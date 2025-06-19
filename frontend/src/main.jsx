import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Podcast from "./pages/Podcast";
import Portfolio from "./pages/Portfolio";
import PostDetail from "./pages/PostDetails";
import PodcastDetail from "./pages/PodcastDetail";
import PortfolioDetail from "./pages/PortfolioDetail";
import  Contact from "./pages/Contact.jsx";
import { About } from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import Testimonies from "./pages/Testimonies.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
//  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {" "}
          <Route index element={<Home />} />{" "}
          <Route path="blog" element={<Blog />} />
          <Route path="podcast" element={<Podcast />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="blog/:slug" element={<PostDetail />} />
          <Route path="podcast/:slug" element={<PodcastDetail />} />
          <Route path="portfolio/:slug" element={<PortfolioDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="testimonies" element={<Testimonies />} />
        </Route>
      </Routes>
    </BrowserRouter>
 // </React.StrictMode>
);
