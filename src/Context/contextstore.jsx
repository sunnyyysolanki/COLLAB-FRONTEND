// import { useQuery } from "@tanstack/react-query";
// import { createContext } from "react";
// import useProjects from "../../useProject";
// import { useParams } from "react-router";
// import axios from "../axios";
// import PropTypes from "prop-types";

// export const context = createContext();

// Contextstore.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// export function Contextstore({ children }) {
//   const project_id = useParams().id;

//   const { data: users, isLoading } = useQuery({
//     queryKey: ["users"],
//     queryFn: async () => {
//       const res = await axios.get("/user");
//       if (!res.data.success) throw new Error("Failed to fetch users");
//       return res.data.users;
//     },
//     staleTime: 5 * 60 * 1000, // Cache for 5 minutes
//   });

//   return (
//     <context.Provider
//       value={{
//         users: users || [],
//         isPending: isPending,
//         project: data,
//         s: "jiii",
//       }}
//     >
//       {children}
//     </context.Provider>
//   );
// }
