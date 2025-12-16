import { getWatchProviders } from "./tmbd";
import { getCustomWatchlink } from "./tmbd";

export const enrichMoviesWithWatchData = async (movies: any[]) => {
  return Promise.all(
    movies.map(async (movie) => {
      const providers = await getWatchProviders(movie.id);
      const tmdbLink = providers?.US?.link;

      const customLink = await getCustomWatchlink(movie.title);

      return {
        ...movie,
        watchLink: tmdbLink || null,
        customWatchLink: customLink || null,
        hasCustomLink: Boolean(customLink),
      };
    })
  );
};
