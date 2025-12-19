import {
  Box,
  Heading,
  Text,
  Stack,
  Image,
  Badge,
  HStack,
  Button,
  Spinner,
  VStack,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
  ModalContent,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetails, getWatchProviders } from "./api/tmbd";
import { getCustomWatchLink } from "./api/movyx";
import { useParams } from "react-router-dom";
import { useState } from "react";
import posthog from "posthog-js";


const MotionBox = motion(Box);

export default function MovieDetail() {
  const { movieId } = useParams<{ movieId: string }>();
  const id = Number(movieId);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movie-details", id],
    queryFn: () => getMovieDetails(id),
    enabled: !!id,
  });

  const { data: providers } = useQuery({
    queryKey: ["watch-providers", id],
    queryFn: () => getWatchProviders(id),
    enabled: !!id,
  });

  const { data: customLinkData } = useQuery({
    queryKey: ["custom-watch-link", id],
    queryFn: () => getCustomWatchLink(id),
    enabled: !!id,
  });


  const regionProviders = providers?.NG;
  const tmdbWatchLink = regionProviders?.link;
  const customWatchLink = customLinkData?.url ?? null;
  const customProvider = customLinkData?.provider ?? null;

  const watchUrl = customWatchLink || tmdbWatchLink;
  const movieTitle = data?.title || "this movie";



  const [isTrailerOpen, setTrailerOpen] = useState(false);

  const handleStreamNow = () => {
    window.open(watchUrl || "_blank");
    posthog.capture("stream_now_clicked", { movieTitle });
  };

  const handleSetTrailer = () => {
    setTrailerOpen(true);
    posthog.capture("watch_trailer_clicked", { movieTitle });
  }

  if (isLoading) return <Spinner color="gray.400" />;
  if (isError || !data) return <Text>Unable to load movie.</Text>;

  const trailer = data.videos?.results?.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  );

  const backdrop = `https://image.tmdb.org/t/p/original${data.backdrop_path}`;
  const poster = `https://image.tmdb.org/t/p/w500${data.poster_path}`;

  return (
    <Box position="relative" minW="100vw" minH="100vh" bg="black" color="gray.100" paddingTop={{ base: "32px" }}>
      <Box
        position="absolute"
        inset={0}
        bgImage={backdrop}
        bgSize="cover"
        bgPosition="center"
        filter="blur(10px) brightness(0.4)"
      />

      <MotionBox
        position="relative"
        px={10}
        py={20}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >

        <Stack spacing={8}>
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={8}
            align={{ base: "center", md: "flex-start" }}
          >
            <Image
              src={poster}
              alt={data.title}
              rounded="2xl"
              minW={{ base: "220px", md: "280px" }}
              shadow="xl"
            />

            <Stack
              spacing={4}
              maxW="3xl"
              textAlign={{ base: "center", md: "left" }}
            >
              <Heading>{data.title}</Heading>

              <HStack justify={{ base: "center", md: "flex-start" }}>
                <Badge colorScheme="green">{data.vote_average.toFixed(1)}</Badge>
                <Text>{data.release_date?.split("-")[0]}</Text>
                <Text>{data.runtime} mins</Text>
              </HStack>

              <HStack justify={{ base: "center", md: "flex-start" }}>
                {data.genres?.map((g: any) => (
                  <Badge key={g.id} colorScheme="yellow">
                    {g.name}
                  </Badge>
                ))}
              </HStack>

              <Text color="gray.300">{data.overview}</Text>

              <Stack
                spacing={4}
                pt={4}
                direction={{ base: "column", md: "row" }}
                justify="center"
              >
                <HStack spacing={2}>
                  {watchUrl && (
                    <Button
                      size="lg"
                      bg="red.500"
                      color="black"
                      rounded="2xl"
                      borderRadius="3xl"
                      onClick={() =>
                       handleStreamNow()
                      }
                    >
                      Stream Now
                    </Button>
                  )}
                  {customProvider && (
                    <Text fontSize="sm" color="green.400">
                       via {customProvider}
                    </Text>
                  )}
                </HStack>


                {trailer && (
                  <Button
                    size="lg"
                    variant="ghost"
                    color="red"
                    border="1px solid"
                    borderRadius="3xl"
                    onClick={() => handleSetTrailer()}
                  >
                    Watch Trailer
                  </Button>
                )}
              </Stack>
            </Stack>
          </Stack>

          {/* Cast */}
          <Box mt={12}>
            <Heading fontSize="2xl" mb={4}>
              Top Cast
            </Heading>
            <HStack spacing={4} overflowX="auto">
              {data.credits?.cast.slice(0, 10).map((c: any) => (
                <VStack key={c.id} minW="120px">
                  <Image
                    src={`https://image.tmdb.org/t/p/w185${c.profile_path}`}
                    rounded="xl"
                  />
                  <Text fontSize="sm">{c.name}</Text>
                  <Text fontSize="xs" color="gray.400">
                    {c.character}
                  </Text>
                </VStack>
              ))}
            </HStack>
          </Box>
        </Stack>

        {/* Trailer Modal */}
        <Modal isOpen={isTrailerOpen} onClose={() => setTrailerOpen(false)} size="4xl" isCentered>
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
