import axios from "axios";

const apiKey = import.meta.env.VITE_TMDB_KEY;

export const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: apiKey,
    language: "en-US",
  },
});

export const getTrendingMovie = async () => {
  const res = await tmdb.get("/trending/movie/week");
  return res.data.results[0] ?? null;
};

export const getTopRatedMovies = async () => {
  const res = await tmdb.get("/movie/top_rated");
  console.log(res.data.results);
  return Array.isArray(res.data.results) ? res.data.results : null;
};

export const getTrendingMovies = async () => {
  const res = await tmdb.get("/trending/movie/week");
  return Array.isArray(res.data.results) ? res.data.results : [];
};

export const getMovieDetails = async (id: number) => {
  const res = await tmdb.get(`/movie/${id}`, {
    params: { append_to_response: "credits,videos" },
  });
  return res.data;
};
