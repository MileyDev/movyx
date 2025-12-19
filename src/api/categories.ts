import { getHollyMovies, getKDramaShows, getMoviesByGenre } from "./tmbd";

export type CategoryType = "movie" | "tv";

export interface Category {
    title: string;
    queryKey: string;
    type: CategoryType;
    fetcher: () => Promise<any[]>;
}

export const categories: Category[] = [
    {
        title: "Action Movies",
        queryKey: "action-movies",
        type: "movie",
        fetcher: () => getMoviesByGenre(28),
    },
    {
        title: "Crime",
        queryKey: "crime-movies",
        type: "movie",
        fetcher: () => getMoviesByGenre(80),
    },
    {
        title: "Comedy Movies",
        queryKey: "comedy-movies",
        type: "movie",
        fetcher: () => getMoviesByGenre(35),
    },
    {
        title: "Hollywood Movies",
        queryKey: "hollywood",
        type: "movie",
        fetcher: () => getHollyMovies(),
    },
    {
        title: "Drama",
        queryKey: "drama-movies",
        type: "movie",
        fetcher: () => getMoviesByGenre(18),
    },
    {
        title: "K-Drama",
        queryKey: "k-drama",
        type: "tv",
        fetcher: () => getKDramaShows(),
    },
]