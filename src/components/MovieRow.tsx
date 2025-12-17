import { Box, Heading, HStack, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";

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

  if (isLoading) {
    return (
      <Box px={10} py={8}>
        <Spinner color="gray.500" />
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
              onClick={() => navigate(`/movie/${movie.id}`)}
            />
          ) : null
        )}
      </HStack>
    </Box>
  );
}
