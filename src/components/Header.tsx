import {
    Box,
    Flex,
    Heading,
    HStack,
    IconButton,
    Text,
  } from "@chakra-ui/react";
  import { SearchIcon } from "@chakra-ui/icons";
  import { useNavigate } from "react-router-dom";
  
  export default function Header() {
    const navigate = useNavigate();
  
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
              fontSize="xl"
              letterSpacing="tight"
              color="red"
            >
              MOVYX
            </Heading>
            <Text fontSize="xs" color="gray.500">
              Beta
            </Text>
          </HStack>
  
          {/* Right Controls */}
          <HStack spacing={4}>
            <IconButton
              aria-label="Search"
              icon={<SearchIcon />}
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.100" }}
            />
          </HStack>
        </Flex>
      </Box>
    );
  }
  