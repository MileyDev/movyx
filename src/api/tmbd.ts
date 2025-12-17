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
  console.log(res.data.results[0]);
  return res.data.results[0] ?? null;
};

export const getTopRatedMovies = async () => {
  const res = await tmdb.get("/movie/top_rated");

  return Array.isArray(res.data.results) ? res.data.results : null;
};

export const getTrendingMovies = async () => {
  const res = await tmdb.get("/trending/movie/week");
  console.log(res.data.results);
  return Array.isArray(res.data.results) ? res.data.results : [];
};

export const getMovieDetails = async (id: number) => {
  const res = await tmdb.get(`/movie/${id}`, {
    params: { append_to_response: "credits,videos" },
  });
  console.log(res.data);
  return res.data;
};

export const getWatchProviders = async (movieId: number) => {
  const res = await tmdb.get(`/movie/${movieId}/watch/providers`);
  return res.data.results ?? {};
};

export const getCustomWatchlink = async (title: string) => {

  const mockLinks: Record<string, string> = {
    "Fight Club": "https://example.com/watch/fight-club",
    "The Running Man": "https://lok-lok.cc/spa/videoPlayPage/movies/the-running-man-KZ7eC7vXhF7?id=6434037434316997728&type=/movie/detail&lang=en",
  };

  return mockLinks[title] ?? null;
}