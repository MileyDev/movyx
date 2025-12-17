import {
  Box,
  Button,
  Heading,
  Text,
  Stack,
  Spinner,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getTrendingMovie } from "./api/tmbd";
import { getCustomWatchLink } from "./api/movyx";

const MotionBox = motion(Box);

export default function Hero() {

  const { data, isLoading, isError } = useQuery({
    queryKey: ["trending-movie"],
    queryFn: getTrendingMovie,
  });

  
  const id = data?.id ? Number(data.id) : undefined;


  const { data: movieLink } = useQuery({
    queryKey: ["tranding-movie-link", id],
    queryFn: () => getCustomWatchLink(id as number),
    enabled: !!id,
  })

  const customLink = movieLink?.url ?? null;
  const watchUrl = customLink;

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
              px={6}
            >
              Watch Trailer
            </Button>

            {watchUrl && (
              <Button
                bg="red"
                borderColor="gray.600"
                color="white"
                rounded="2xl"
                px={6}
                onClick={() => window.open(watchUrl || "_blank")}
              >
                Stream Now
              </Button>
            )}
          </Stack>
        </Stack>
      </MotionBox>
    </Box>
  );
}
