// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Import your components for routing
import Home from "./pages/Home.jsx";
import Blog from "./pages/Blog.jsx";
// import Podcast from "./pages/Podcast.jsx";
import Portfolio from "./pages/Portfolio.jsx";
// import PostDetail from "./components/PostDetail.jsx";  Assuming you have these
// import PodcastDetail from "./components/PodcastDetail.jsx"; // Assuming you have these
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import Testimonies from "./pages/Testimonies.jsx";
import PortfolioDetail from "./pages/PortfolioDetail.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode> // <-- MAKE SURE THIS LINE IS COMMENTED OUT
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="blog" element={<Blog />} />
          <Route path="podcast" element={<Podcast />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="blog/:slug" element={<PostDetail />} />
          <Route path="podcast/:slug" element={<PodcastDetail />} />
          <Route path="portfolio/:slug" element={<PortfolioDetail />} /> {/* YOUR ROUTE */}
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="testimonies" element={<Testimonies />} />
        </Route>
      </Routes>
    </BrowserRouter>
  // </React.StrictMode> // <-- MAKE SURE THIS LINE IS COMMENTED OUT
);