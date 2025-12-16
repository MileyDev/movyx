import Hero from "./Hero";
import MovieRow from "./components/MovieRow";
import { getTrendingMovies, getTopRatedMovies } from "./api/tmbd";
import { useState } from "react";
import MovieDetail from "./MovieDetail";

function Home() {
    const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

    if (selectedMovieId)
        return (
            <MovieDetail
                movieId={selectedMovieId}
                onBack={() => setSelectedMovieId(null)}
            />
        );

    return (
        <>
            <Hero />
            <MovieRow
                title="Trending Now"
                queryKey="trending-week"
                queryFn={getTrendingMovies}
                onCardClick={(id) => setSelectedMovieId(id)} />
            <MovieRow
                title="Top Rated"
                queryKey="top-rated"
                queryFn={getTopRatedMovies}
                onCardClick={(id) => setSelectedMovieId(id)}
            />
        </>
    )
}

export default Home;