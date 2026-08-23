import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "./App.css";
import { Suspense, lazy } from "react";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./Components/ProtectedRoute";
import AuthRoute from "./Components/AuthRoute";
import AppLayout from "./layout/AppLayout";
const Home = lazy(() => import("./Pages/Home"));
const About = lazy(() => import("./Pages/About"));
const Pricing = lazy(() => import("./Pages/Pricing"));
const Feed = lazy(() => import("./Pages/Feed"));
const Auth = lazy(() => import("./Pages/Auth"));
const Profile = lazy(() => import("./Pages/Profile"));
const EditProfile = lazy(() => import("./Pages/EditProfile"));
const Requests = lazy(() => import("./Pages/Requests"));
const Connection = lazy(() => import("./Pages/Connection"));
const Chat = lazy(() => import("./Pages/Chat"));

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/home" replace />,
      },
      {
        path: "/home",
        element: (
          <AuthRoute>
            <Home />
          </AuthRoute>
        ),
      },
      {
        path: "/about",
        element: (
          <AuthRoute>
            <About />
          </AuthRoute>
        ),
      },
      {
        path: "/pricing",
        element: <Pricing />,
      },
      {
        path: "/auth",
        element: (
          <AuthRoute>
            <Auth />
          </AuthRoute>
        ),
      },
      {
        path: "/feed",
        element: (
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/request",
        element: (
          <ProtectedRoute>
            <Requests />
          </ProtectedRoute>
        ),
      },
      {
        path: "/connection",
        element: (
          <ProtectedRoute>
            <Connection />
          </ProtectedRoute>
        ),
      },
      {
        path: "/edit-profile",
        element: (
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/chat/:userId",
        element: (
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
function App() {
  return (
    <>
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center text-white">
            Loading...
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>

      <ToastContainer />
    </>
  );
}

export default App;
