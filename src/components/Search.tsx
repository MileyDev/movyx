import { Box, Heading, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "../api/tmbd";
import MovieCard from "./MovieCard";
import { useDebounce } from "use-debounce";


export default function Search() {
    const [params] = useSearchParams();
    const nav = useNavigate();
  
    const query = params.get("q")?.trim() ?? "";
    const [debouncedQuery] = useDebounce(query, 300);
  
    const shouldSearch = debouncedQuery.length >= 2;
  
    const { data = [], isLoading, isFetching } = useQuery({
      queryKey: ["search", debouncedQuery],
      queryFn: () => searchMovies(debouncedQuery),
      enabled: shouldSearch,
      staleTime: 1000 * 60 * 5,
    });
  
    const results = data.filter(
      (r: any) => r.media_type === "movie" || r.media_type === "tv"
    );
  
    return (
      <Box px={10} py={20}>
        <Heading mb={6}>
          {shouldSearch
            ? `Search results for "${query}"`
            : "Type at least 2 characters"}
        </Heading>
  
        {(isLoading || isFetching) && <Spinner />}
  
        {!isLoading && shouldSearch && !results.length && (
          <Text color="gray.400">No results found.</Text>
        )}
  
        <SimpleGrid columns={[2, 3, 4, 6]} spacing={6}>
          {results.map((item: any) => (
            <MovieCard
              key={item.id}
              poster={item.poster_path || item.backdrop_path}
              title={item.title || item.name}
              onClick={() =>
                nav(item.media_type === "tv"
                  ? `/tv/${item.id}`
                  : `/movie/${item.id}`)
              }
              variant="grid"
            />
          ))}
        </SimpleGrid>
      </Box>
    );
  }
  