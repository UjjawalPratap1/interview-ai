import { createBrowserRouter, Navigate } from 'react-router'
import Protected from './features/auth/components/protected.jsx'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import Home from './features/interview/pages/Home.jsx';
import Interview from './features/interview/pages/Interview.jsx';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Protected>
            <Home />
        </Protected>
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "interview/:interviewId",
        element: <Protected>
            <Interview />
        </Protected>
    },
    {
    }
]);