import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import { store } from "./store/store.jsx";
import { Provider } from "react-redux";
import Protected from "./components/Protected.jsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Project from "./pages/Project.jsx";
import PageNotFound from "./components/PageNotFound.jsx";

const queryClient = new QueryClient();

const route = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup></Signup>,
      },
    ],
  },
  {
    element: <Protected />,
    children: [
      {
        path: "/home",
        element: <Home></Home>,
      },
      {
        path: "/project/:id",
        element: <Project></Project>,
      },
    ],
  },
  {
    path: "/404",
    element: <PageNotFound></PageNotFound>,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastContainer></ToastContainer>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={route}></RouterProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
