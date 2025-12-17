import axios from "axios";

export const movyxApi = axios.create({
  baseURL: import.meta.env.VITE_MOVYX_API,
});


export const getCustomWatchLink = async (tmdbId: number) => {
    try {
      const res = await movyxApi.get(`/watch/${tmdbId}`);
      return res.data;
    } catch {
      return null;
    }
  };
  