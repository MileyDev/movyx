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
  import { ArrowBackIcon } from "@chakra-ui/icons";
  import { motion } from "framer-motion";
  import { useQuery } from "@tanstack/react-query";
  import { useParams, useNavigate } from "react-router-dom";
  import { useMemo, useState } from "react";
  import { getTvDetails } from "./api/tmbd";
  
  const MotionBox = motion(Box);
  
  export default function TvDetail() {
    const { tvId } = useParams<{ tvId: string }>();
    const navigate = useNavigate();
    const id = Number(tvId);
  
    const { data, isLoading, isError } = useQuery({
      queryKey: ["tv-details", id],
      queryFn: () => getTvDetails(id),
      enabled: Number.isFinite(id) && id > 0,
    });
  
    const [isTrailerOpen, setTrailerOpen] = useState(false);
  
    const trailer = useMemo(() => {
      const results = data?.videos?.results ?? [];
      return results.find(
        (v: any) => v.type === "Trailer" && v.site === "YouTube"
      );
    }, [data]);
  
    if (isLoading) return <Spinner color="gray.400" />;
    if (isError || !data) return <Text>Unable to load TV show.</Text>;
  
    const backdrop = data.backdrop_path
      ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
      : "";
  
    const poster = data.poster_path
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : "";
  
    const year =
      data.first_air_date?.split("-")[0] ??
      data.last_air_date?.split("-")[0] ??
      "";
  
    const seasons = data.number_of_seasons ?? 0;
    const episodes = data.number_of_episodes ?? 0;
  
    return (
      <Box position="relative" minH="100vh" bg="black" color="gray.100">
        {/* Backdrop */}
        <Box
          position="absolute"
          inset={0}
          bgImage={backdrop}
          bgSize="cover"
          bgPosition="center"
          filter="blur(10px) brightness(0.4)"
          zIndex={0}
        />
  
        <MotionBox
          position="relative"
          zIndex={1}
          px={{ base: 6, md: 10 }}
          py={{ base: 20, md: 20 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Back Button */}
          <Button
            position="absolute"
            top={6}
            left={6}
            zIndex={2}
            leftIcon={<ArrowBackIcon />}
            variant="ghost"
            color="white"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
  
          <Stack spacing={8}>
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={8}
              align={{ base: "center", md: "flex-start" }}
            >
              {/* Poster */}
              {poster && (
                <Image
                  src={poster}
                  alt={data.name}
                  rounded="2xl"
                  minW={{ base: "220px", md: "280px" }}
                  shadow="xl"
                />
              )}

              <Stack
                spacing={4}
                maxW="3xl"
                textAlign={{ base: "center", md: "left" }}
              >
                <Heading>{data.name}</Heading>
  
                <HStack justify={{ base: "center", md: "flex-start" }} spacing={4}>
                  {typeof data.vote_average === "number" && (
                    <Badge colorScheme="green">{data.vote_average.toFixed(1)}</Badge>
                  )}
                  {year && <Text>{year}</Text>}
                  <Text>
                    {seasons} season{seasons === 1 ? "" : "s"}
                  </Text>
                  <Text>{episodes} episodes</Text>
                </HStack>
  
                <HStack
                  justify={{ base: "center", md: "flex-start" }}
                  spacing={2}
                  wrap="wrap"
                >
                  {data.genres?.map((g: any) => (
                    <Badge key={g.id} colorScheme="yellow">
                      {g.name}
                    </Badge>
                  ))}
                </HStack>
  
                <Text color="gray.300">{data.overview}</Text>
  
                <HStack
                  spacing={4}
                  pt={4}
                  justify={{ base: "center", md: "flex-start" }}
                >
                  {trailer && (
                    <Button
                      size="lg"
                      bg="white"
                      color="black"
                      rounded="2xl"
                      _hover={{ bg: "gray.200" }}
                      onClick={() => setTrailerOpen(true)}
                    >
                      Watch Trailer
                    </Button>
                  )}
                </HStack>
              </Stack>
            </Stack>
  
            {/* Cast Carousel */}
            <Box mt={12}>
              <Heading fontSize="2xl" mb={4}>
                Top Cast
              </Heading>
  
              <HStack spacing={4} overflowX="auto" pb={2}>
                {(data.credits?.cast ?? []).slice(0, 10).map((c: any) => (
                  <VStack key={c.id} minW="120px" spacing={2}>
                    <Image
                      src={
                        c.profile_path
                          ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
                          : "https://via.placeholder.com/185x278?text=No+Image"
                      }
                      alt={c.name}
                      rounded="xl"
                    />
                    <Text fontSize="sm" noOfLines={1}>
                      {c.name}
                    </Text>
                    <Text fontSize="xs" color="gray.400" noOfLines={1}>
                      {c.character}
                    </Text>
                  </VStack>
                ))}
              </HStack>
            </Box>
          </Stack>
  
          {/* Trailer Modal */}
          <Modal
            isOpen={isTrailerOpen}
            onClose={() => setTrailerOpen(false)}
            size="4xl"
            isCentered
          >
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
  