import LoginPage, { loader as loaderLogin } from '@/Pages/Login';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import UserVerifications, {
  loader as loaderUser,
} from '@/Middlewares/UserVerifications';
import RedirectPage from '@/utils/RedirectPage';
import adminRoutes from './admin';
import responsableRoutes from './responsable';
import rrHhRoutes from './rh';
import ErrorPage from '@/Components/ErrorPage';
import LoadingPage from '@/Components/LoadingPage';
import { ROUTE_IDS } from '@/utils/vars';

const routes = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      // publics
      {
        path: '/',
        element: <RedirectPage url="./login" />,
      },
      {
        index: true,
        id: ROUTE_IDS.LOGIN,
        path: '/login',
        loader: loaderLogin,
        element: <LoginPage />,
      },
      // middlewares
      {
        id: ROUTE_IDS.USER,
        element: <UserVerifications />,
        loader: loaderUser,
        // rutas a proteger
        children: [...adminRoutes, ...responsableRoutes, ...rrHhRoutes],
      },
    ],
  },
]);

const Routes = () => {
  return <RouterProvider fallbackElement={<LoadingPage />} router={routes} />;
};

export default Routes;
