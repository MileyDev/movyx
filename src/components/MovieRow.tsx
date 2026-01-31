import { Box, Center, Heading, HStack, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";
import posthog from "posthog-js";

interface Props {
  title: string;
  queryKey: string;
  queryFn: () => Promise<any[]>;
  availableOnly?: boolean;
}

export default function MovieRow({
  title,
  queryKey,
  queryFn,
  availableOnly,
}: Props) {
  const { data = [], isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn,
  });

  const movies = availableOnly
    ? data.filter((m: any) => m.customWatchLink)
    : data;

  const navigate = useNavigate();

  const handleClick = (movieId: number, mediaType: string) => {
    navigate(mediaType === "tv" ? `/tv/${movieId}` : `/movie/${movieId}`);
    posthog.capture("movie_card_clicked", { movieId });
  };

  if (isLoading) {
    return (
      <Box px={10} py={8}>
        <Center><Spinner border="4px" color="red.500" /></Center>
      </Box>
    );
  }
  if (!movies.length) return null;

  return (
    <Box px={10} py={8}>
      <Heading fontSize="xl" mb={4}>
        {title}
      </Heading>

      <HStack spacing={6} overflowX="auto" pb={4}>
        {movies.map((movie: any) =>
          movie.poster_path ? (

            <MovieCard
              key={movie.id}
              poster={movie.poster_path}
              title={movie.title}
              isAvailable={!!movie.customWatchLink}
              onClick={() => handleClick(movie.id, movie.media_type)}
            />
          ) : null
        )}
      </HStack>
    </Box>
  );
}
