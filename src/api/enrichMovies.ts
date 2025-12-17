import { getCustomWatchLink } from "./movyx";

export const enrichMoviesWithWatchData = async (movies: any[]) => {
  return Promise.all(
    movies.map(async (movie) => {
      const custom = await getCustomWatchLink(movie.id);

      return {
        ...movie,
        hasCustomLink: !!custom,
        customWatchLink: custom?.url ?? null,
        watchProvider: custom?.provider ?? null,
      };
    })
  );
};

