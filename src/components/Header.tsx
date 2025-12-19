import {
    Box,
    Flex,
    Heading,
    HStack,
    IconButton,
    Input,
  } from "@chakra-ui/react";
  import { SearchIcon } from "@chakra-ui/icons";
  import { useNavigate } from "react-router-dom";
  import { useState } from "react";
import posthog from "posthog-js";
  
  export default function Header() {
    const navigate = useNavigate();

    const [searching, setSearching] = useState(false);
    const [value, setValue] = useState("");
    const [open, setOpen] = useState(false);

    const handleSearch = () => {
      setSearching(!searching);
      setOpen(false);
      setValue("");
      posthog.capture("search_feature_used", {});
    };

    const handleClick = () => {
      setOpen(!open);
      posthog.capture("search_toggled", { open: !open });
    }
  
    return (
      <Box
        position="fixed"
        top={0}
        w="100%"
        zIndex={1000}
        bg="rgba(0,0,0,0.6)"
        backdropFilter="blur(12px)"
        borderBottom="1px solid rgba(255,255,255,0.05)"
      >
        <Flex
          px={{ base: 6, md: 10 }}
          py={4}
          align="center"
          justify="space-between"
        >
          {/* Logo */}
          <HStack spacing={2} align="center" cursor="pointer" onClick={() => navigate("/")}>
            <Heading
              fontSize="2xl"
              letterSpacing="tight"
              color="red"
            >
              MOVYX
            </Heading>
            
          </HStack>
  
          {/* Right Controls */}
          <HStack spacing={4}>
            <IconButton
              aria-label="Search"
              visibility={open ? "hidden" : "visible"}
              icon={<SearchIcon />}
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.100" }}
              onClick={() => handleClick()}
            />

            {open && (
              <Input 
              placeholder="Search movies..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && value.trim().length > 1) {
                  navigate(`/search?q=${encodeURIComponent(value)}`);
                  handleSearch();
                }
              }}
              bg="gray.900"
              border="none"
              color="white"
              />
            )}
          </HStack>
        </Flex>
      </Box>
    );
  }
  