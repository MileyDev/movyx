import {
  Box,
  Button,
  Heading,
  Text,
  Stack,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetails, getTrendingMovie } from "./api/tmbd";
import { getCustomWatchLink } from "./api/movyx";
import posthog from "posthog-js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MotionBox = motion(Box);

export default function Hero() {

  const { data, isLoading, isError } = useQuery({
    queryKey: ["trending-movie"],
    queryFn: getTrendingMovie,
  });

  const [trailerOpen, setTrailerOpen] = useState(false);

  const navigate = useNavigate();

  const id = data?.id ? Number(data.id) : undefined;
  const movieTitle = data?.title || "this movie";


  const { data: movieLink } = useQuery({
    queryKey: ["tranding-movie-link", id],
    queryFn: () => getCustomWatchLink(id as number),
    enabled: !!id,
  })

  const { data: movieDetail } = useQuery({
      queryKey: ["movie-details", id],
      queryFn: () => getMovieDetails(id as number),
      enabled: !!id,
    });

  const handleStreamNow = () => {
    window.open(watchUrl || "_blank");
    posthog.capture("trending_now_watched", { movieTitle });
  };

  const handleSetTrailer = () => {
    setTrailerOpen(true);
    posthog.capture("trending_now_trailer_clicked", { movieTitle });
  }

  const handleClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
    posthog.capture("top_trending_clicked", { movieId });
  };

  const customLink = movieLink?.url ?? null;
  const watchUrl = customLink;

  const trailer = movieDetail?.videos?.results?.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  );

  if (isLoading) {
    return (
      <Box h="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner color="gray.400" />
      </Box>
    );
  }

  if (isError || !data || !data.backdrop_path) {
    return (
      <Box h="100vh" display="flex" alignItems="center" justifyContent="center">
        <Text color="gray.400">Unable to load featured movie</Text>
      </Box>
    );
  }

  const backdrop = `https://image.tmdb.org/t/p/original${data.backdrop_path}`;

  return (
    <Box
      position="relative"
      h="100vh"
      bgImage={backdrop}
      bgSize="cover"
      bgPosition="center"
    >
      {/* Overlay */}
      <Box
        position="absolute"
        inset={0}
        bgGradient="linear(to-t, black, rgba(0,0,0,0.6), transparent)"
      />

      <MotionBox
        position="relative"
        zIndex={1}
        h="100%"
        display="flex"
        alignItems="flex-end"
        px={10}
        pb={24}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        onClick={() => handleClick(data.id)}
      >
        <Stack spacing={5} maxW="xl">
          <Heading fontSize={["3xl", "5xl", "6xl"]} fontWeight="600">
            {data.title}
          </Heading>

          <Text color="gray.300" noOfLines={3}>
            {data.overview}
          </Text>

          <Stack direction="row" spacing={4}>
            <Button
              bg="white"
              color="black"
              _hover={{ bg: "gray.200" }}
              rounded="2xl"
              borderRadius="3xl"
              px={6}
              onClick={() => handleSetTrailer()}
            >
              Watch Trailer
            </Button>

            {watchUrl && (
              <Button
                bg="red"
                borderColor="gray.600"
                color="white"
                rounded="2xl"
                borderRadius="3xl"
                px={6}
                onClick={() => handleStreamNow()}
              >
                Stream Now
              </Button>
            )}
          </Stack>
        </Stack>

        <Modal isOpen={trailerOpen} onClose={() => setTrailerOpen(false)} size="4xl" isCentered>
          <ModalOverlay bg="blackAlpha.800" />
          <ModalContent bg="black">
            <ModalCloseButton color="white" />
            <ModalBody p={0}>
              {trailer && (
                <Box
                  as="iframe"
                  w="100%"
                  h="500px"
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </MotionBox>
    </Box>
  );
}
