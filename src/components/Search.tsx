import { Box, Heading, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "../api/tmbd";
import MovieCard from "./MovieCard";
import posthog from "posthog-js";


export default function Search() {
    const [params] = useSearchParams();
    const nav = useNavigate();
    const query = params.get("q") || "";

    const { data = [], isLoading } = useQuery({
        queryKey: ["search", query],
        queryFn: () => searchMovies(query || ""),
        enabled: query?.length! > 1,
    });

    const results = data.filter(
        (r: any) => r.media_type === "movie" || r.media_type === "tv"
    );

    const handleClick = (movieId: number, mediaType: string) => {
        nav(mediaType === "tv" ? `/tv/${movieId}` : `/movie/${movieId}`);
        posthog.capture("movie_card_clicked", { movieId });
      };

    return (
        <Box px={10} py={20}>
            <Heading mb={6}>Search results for "{query}"</Heading>
            {isLoading && <Spinner />}

            {!isLoading && !results.length && (
                <Text color="green.400">No results found.</Text>
            )}

            <SimpleGrid columns={[2,3,4,6]} spacing={6}>
                {results.map((item: any) => (
                    <MovieCard
                        key={item.id}
                        poster={item.poster_path || item.backdrop_path}
                        title={item.title || item.name}
                        onClick={() => handleClick(item.id, item.media_type)}
                        variant="grid"
                        />
                ))}
            </SimpleGrid>
        </Box>
    );
}
