import { Box, Image, Badge, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface Props {
  poster: string;
  title: string;
  onClick?: () => void;
  isAvailable?: boolean;
  variant?: "row" | "grid";
}

export default function MovieCard({ poster, title, onClick, isAvailable, variant = "row" }: Props) {
  const height = variant === "grid" ? "260px" : "340px";
  return (
    <Box minW={variant === "row" ? "220px" : "auto"}>
      <MotionBox
        whileHover={{ scale: 1.08, y: -6 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        cursor="pointer"
        onClick={onClick}
      >

        <Image
          src={`https://image.tmdb.org/t/p/w500${poster}`}
          alt={title}
          rounded="2xl"
          height={height}
          minW="180px"
          loading="lazy"
        />
        {isAvailable && (
          <Badge
            position="absolute"
            top={2}
            right={2}
            colorScheme="green"
            fontSize="0.5rem"
            zIndex={2}
          >
            Watch
          </Badge>
        )}
      </MotionBox>

      <Text mt={2} fontSize="sm" noOfLines={2}>
        {title}
      </Text>
    </Box>
  );
}
