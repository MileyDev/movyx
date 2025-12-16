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
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetails } from "./api/tmbd";

const MotionBox = motion(Box);

interface Props {
    movieId: number;
    onBack?: () => void;
}

export default function MovieDetail({ movieId, onBack }: Props) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["movie-details", movieId],
        queryFn: () => getMovieDetails(movieId),
    });

    if (isLoading) return <Spinner color="gray.400" />;

    if (isError || !data) return <Text>Unable to load movie.</Text>;

    const backdrop = `https://image.tmdb.org/t/p/original${data.backdrop_path}`;
    const poster = `https://image.tmdb.org/t/p/w500${data.poster_path}`;

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

            {/* Content */}
            <MotionBox
                position="relative"
                zIndex={1}
                px={10}
                py={20}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <Button
                    position="absolute"
                    top={6}
                    left={6}
                    zIndex={2}
                    leftIcon={<ArrowBackIcon />}
                    colorScheme="whiteAlpha"
                    variant="outline"
                    onClick={onBack}
                >
                    Back
                </Button>
                <Stack spacing={8}>
                    <HStack spacing={8} align="flex-start">
                        {/* Poster */}
                        <Image
                            src={poster}
                            alt={data.title}
                            rounded="2xl"
                            maxW="250px"
                            shadow="xl"
                        />

                        {/* Main Details */}
                        <Stack spacing={4} maxW="3xl">
                            <Heading>{data.title}</Heading>

                            <HStack spacing={4}>
                                <Badge colorScheme="yellow">{data.vote_average.toFixed(1)}</Badge>
                                <Text>{data.release_date?.split("-")[0]}</Text>
                                <Text>{data.runtime} min</Text>
                            </HStack>

                            <HStack spacing={2}>
                                {data.genres?.map((g: any) => (
                                    <Badge key={g.id} colorScheme="teal">
                                        {g.name}
                                    </Badge>
                                ))}
                            </HStack>

                            <Text color="gray.300">{data.overview}</Text>

                            <Button
                                bg="white"
                                color="black"
                                _hover={{ bg: "gray.200" }}
                                rounded="2xl"
                                maxW="200px"
                            >
                                Add to Watchlist
                            </Button>
                        </Stack>
                    </HStack>

                    {/* Cast Carousel */}
                    <Box mt={12}>
                        <Heading fontSize="2xl" mb={4}>
                            Top Cast
                        </Heading>
                        <HStack spacing={4} overflowX="auto" pb={2}>
                            {data.credits.cast.slice(0, 10).map((c: any) => (
                                <VStack key={c.id} minW="120px" spacing={2}>
                                    <Image
                                        src={`https://image.tmdb.org/t/p/w185${c.profile_path}`}
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
            </MotionBox>
        </Box>
    );
}
