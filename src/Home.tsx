import Hero from "./Hero";
import MovieRow from "./components/MovieRow";
import { getTrendingMovies, getTopRatedMovies } from "./api/tmbd";
import { enrichMoviesWithWatchData } from "./api/enrichMovies";


function Home() {
  return (
    <>
      <Hero />

      <MovieRow
        title="Trending Now"
        queryKey="trending-week"
        queryFn={getTrendingMovies}
      />

      <MovieRow
        title="Available to Watch"
        queryKey="available-to-watch"
        queryFn={async () => {
          const movies = await getTrendingMovies();
          return enrichMoviesWithWatchData(movies);
        }}
        availableOnly
      />

      <MovieRow
        title="Top Rated"
        queryKey="top-rated"
        queryFn={getTopRatedMovies}
      />
    </>
  );
}

export default Home;
