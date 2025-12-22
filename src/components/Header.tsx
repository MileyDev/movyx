import {
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  VStack,
  Image,
  Text,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { getSearchSuggestions } from "../api/tmbd";
import posthog from "posthog-js";

export default function Header() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const [debounced] = useDebounce(value, 300);
  const shouldSuggest = debounced.length >= 2;

  const { data: suggestions = [], isFetching } = useQuery({
    queryKey: ["search-suggestions", debounced],
    queryFn: () => getSearchSuggestions(debounced),
    enabled: shouldSuggest,
    staleTime: 1000 * 60 * 5,
  });

  const handleSubmit = () => {
    if (value.trim().length < 2) return;
    navigate(`/search?q=${encodeURIComponent(value)}`);
    setOpen(false);
    setValue("");
    posthog.capture("search_submitted", { query: value });
  };

  return (
    <Box
      position="fixed"
      top={0}
      w="100%"
      zIndex={1000}
      h="72px"
      bg="rgba(0,0,0,0.6)"
      backdropFilter="blur(12px)"
      borderBottom="1px solid rgba(255,255,255,0.05)"
    >
      <Flex
        h="100%"
        px={{ base: 6, md: 10 }}
        align="center"
        justify="space-between"
      >
        <Heading
          fontSize="2xl"
          color="red"
          cursor="pointer"
          onClick={() => navigate("/")}
        >
          MOVYX
        </Heading>

        {/* Search Container */}
        <Box position="relative" w={{ base: "auto", md: "280px", sm: "200px"}}>
          {open == false && (
            <IconButton
            aria-label="Search"
            icon={<SearchIcon />}
            variant="ghost"
            color="white"
            onClick={() => setOpen(true)}
          />
          )}

          {open && (
            <Box position="relative" top="0" right="0" w="100%">
              {/* Input */}
              <Input
                autoFocus
                placeholder="Search movies..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit() && setOpen(false)}
                bg="gray.900"
                border="none"
                borderRadius="3xl"
                color="white"
                h="30px"
                pl={4}
                pr={10}
              />

              {/* Suggestions */}
              {shouldSuggest && (
                <VStack
                  position="absolute"
                  top="44px"
                  w="100%"
                  bg="gray.900"
                  rounded="lg"
                  spacing={0}
                  align="stretch"
                  shadow="xl"
                  maxH="360px"
                  overflowY="auto"
                >
                  {isFetching && (
                    <Text px={4} py={2} fontSize="sm" color="gray.400">
                      Searching…
                    </Text>
                  )}

                  {suggestions.map((item: any) => (
                    <HStack
                      key={item.id}
                      px={4}
                      py={3}
                      spacing={3}
                      cursor="pointer"
                      _hover={{ bg: "whiteAlpha.100" }}
                      onClick={() => {
                        navigate(
                          item.media_type === "tv"
                            ? `/tv/${item.id}`
                            : `/movie/${item.id}`
                        );
                        setOpen(false);
                        setValue("");
                      }}
                    >
                      <Image
                        src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                        boxSize="40px"
                        rounded="md"
                      />
                      <Text fontSize="sm">
                        {item.title || item.name}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              )}
            </Box>
          )}
        </Box>
      </Flex>
    </Box>

  );
}
