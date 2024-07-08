import MainLayout from '@/shared/Components/Layouts/main/index.jsx';
import AsistenciaPage, {
  loader as asistenciaLoader,
} from '@/Pages/Responsable/Asistencia/index.jsx';
import NovedadesPage, {
  loader as novedadesLoader,
} from '@/Pages/Responsable/Novedades/index.jsx';
import ResponsablePage from '@/Pages/Responsable/index.jsx';
import RedirectPage from '@/utils/RedirectPage';
// import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { green } from '@mui/material/colors';
import { MODULOS_RESPONSABLE, ROUTE_IDS } from '@/utils/vars';
import { json } from 'react-router-dom';

const menuItemsResponsable = [
  {
    name: 'Asistencia',
    to: MODULOS_RESPONSABLE.ASISTENCIA,
    icon: <LibraryAddCheckIcon />,
  },
  {
    name: 'Pendientes',
    to: MODULOS_RESPONSABLE.NOVEDADES_PENDIENTES,
    icon: <AnnouncementIcon />,
  },
];

const loader = async () => {
  const colors = {
    primary: 'success',
    HxPrimary: green[800],
    secondary: 'secondary',
    HxSecondary: green[500],
  };
  return json({ colors });
};

const responsableRoutes = [
  {
    id: ROUTE_IDS.RESPONSABLE,
    loader,
    path: 'responsable',
    element: (
      <MainLayout
        TopTitle={'Responsable'}
        menuItems={menuItemsResponsable}
        topBackGround="success"
      />
    ),
    children: [
      {
        index: true,
        element: <RedirectPage url={MODULOS_RESPONSABLE.DASHBOARD} />,
      },
      {
        path: 'dashboard',
        element: <ResponsablePage />,
      },
      {
        path: 'asistencia',
        loader: asistenciaLoader,
        element: <AsistenciaPage />,
      },
      {
        path: 'novedades',
        loader: novedadesLoader,
        element: <NovedadesPage />,
      },
    ],
  },
];

export default responsableRoutes;
