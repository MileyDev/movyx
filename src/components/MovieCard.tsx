import { Box, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface Props {
  poster: string;
  title: string;
  onClick?: () => void;
}

export default function MovieCard({ poster, title, onClick }: Props) {
  return (
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
        minW="180px"
        loading="lazy"
      />
    </MotionBox>
  );
}
