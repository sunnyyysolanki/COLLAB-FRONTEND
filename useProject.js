import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useProjects = (id) => {
  return useQuery({
    queryKey: ["project"], // Unique key to cache data
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/project/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data.project;
    },
    staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
    cacheTime: 60 * 60 * 1000, // Cache stored for 60 minutes
    refetchOnWindowFocus: false, // Prevent refetch on tab switch
    retry: 1, // Retry once if the request fails
  });
};

export default useProjects;
