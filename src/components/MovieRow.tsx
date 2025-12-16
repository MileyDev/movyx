import { Box, Heading, HStack, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import MovieCard from "./MovieCard";

interface Props {
  title: string;
  queryKey: string;
  queryFn: () => Promise<any[]>;
  onCardClick?: (id: number) => void;
}

export default function MovieRow({ title, queryKey, queryFn, onCardClick }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn,
  });

  if (isLoading) {
    return (
      <Box px={10} py={8}>
        <Spinner color="gray.500" />
      </Box>
    );
  }

  return (
    <Box px={10} py={8}>
      <Heading fontSize="xl" mb={4}>
        {title}
      </Heading>

      <HStack spacing={6} overflowX="auto" pb={4}>
        {data?.map((movie) =>
          movie.poster_path ? (
            <MovieCard
              key={movie.id}
              poster={movie.poster_path}
              title={movie.title}
              onClick={() => onCardClick?.(movie.id)}
            />
          ) : null
        )}
      </HStack>
    </Box>
  );
}
