import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import ActivityDashBoard from "../../features/activities/dashboard/ActivityDashBoard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/details/ActivityDetails";

export const routes: RouteObject[] = [

    {
        path: '/',
        element: <App />,
        children: [
            { path: 'activities', element: <ActivityDashBoard /> },
            { path: 'activities/:id', element: <ActivityDetails key='create' /> },
            { path: 'createActivity', element: <ActivityForm key='manage' /> },
            { path: 'manage/:id', element: <ActivityForm /> },
        ]
    }
]

// передаем в BrowserRouter наши маршруты
export const router = createBrowserRouter(routes);

