import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: "black",
        color: "gray.100",
      },
    },
  },
  fonts: {
    heading: 'Quicksand, system-ui, sans-serif',
    body: 'Quicksand, system-ui, sans-serif'
  },
});

export default theme;
