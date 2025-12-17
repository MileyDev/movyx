import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import MovieDetail from "./MovieDetail";
import Header from "./components/Header";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:movieId" element={<MovieDetail />} />
      </Routes>
    </>
  );
}
