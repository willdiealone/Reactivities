import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import ActivityDashBoard from "../../features/activities/dashboard/ActivityDashBoard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/details/ActivityDetails";
import TestErrors from "../../features/errors/TestError";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import LoginForm from "../../features/users/LoginForm";
import ProfilePage from "../../features/profile/ProfilePage";
import RequireAuth from "./RequireAuth";

export const routes: RouteObject[] = [

    {
        path: '/',
        element: <App />,
        children: [
            { element: <RequireAuth/>, children: [

                    { path: 'activities', element: <ActivityDashBoard /> },
                    { path: 'activities/:id', element: <ActivityDetails /> },
                    { path: 'createActivity', element: <ActivityForm key='create' /> },
                    { path: 'manage/:id', element: <ActivityForm key='manage'/> },
                    { path: 'profiles/:username', element: <ProfilePage /> },
                    { path: 'errors', element: <TestErrors /> }
                ]},
            { path: 'not-found', element: <NotFound /> },
            { path: 'server-error', element: <ServerError /> },
        ]
    }
]

// передаем в BrowserRouter наши маршруты
export const router = createBrowserRouter(routes);

