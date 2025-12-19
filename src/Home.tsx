import Hero from "./Hero";
import MovieRow from "./components/MovieRow";
import { getTrendingMovies, getTopRatedMovies } from "./api/tmbd";
import { enrichMoviesWithWatchData } from "./api/enrichMovies";
import { categories } from "./api/categories";


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

      {categories.map((cat) => (
        <MovieRow
          key={cat.queryKey}
          title={cat.title}
          queryKey={cat.queryKey}
          queryFn={cat.fetcher}
        />
      ))}

      <MovieRow
        title="Top Rated"
        queryKey="top-rated"
        queryFn={getTopRatedMovies}
      />
    </>
  );
}

export default Home;
