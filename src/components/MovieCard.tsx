import { Box, Image, Badge } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface Props {
  poster: string;
  title: string;
  onClick?: () => void;
  isAvailable?: boolean;
}

export default function MovieCard({ poster, title, onClick, isAvailable }: Props) {
  return (
    <MotionBox
      whileHover={{ scale: 1.08, y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      cursor="pointer"
      onClick={onClick}
    >
      {isAvailable && (
        <Badge
          position="absolute"
          top={2}
          right={2}
          colorScheme="red"
          fontSize="0.7rem"
          zIndex={2}
        >
          Watch
        </Badge>
      )}
      <Image
        src={`https://image.tmdb.org/t/p/w500${poster}`}
        alt={title}
        rounded="2xl"
        minW="180px"
        loading="lazy"
      />
    </MotionBox>
  );
}
