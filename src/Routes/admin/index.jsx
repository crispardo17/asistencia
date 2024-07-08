import DashBoard from '@/shared/Components/Dashboard';
import MainLayout from '@/shared/Components/Layouts/main';
import Aprobacion from '@/Pages/Administracion/Aprobacion';
import Asignacion from '@/Pages/Administracion/Asignacion';
import Asistencia from '@/Pages/Administracion/Asistencia';
import Usuario from '@/Pages/Administracion/Configuracion/Usuario';
import Reporte from '@/Pages/Administracion/Reporte';
import RedirectPage from '@/utils/RedirectPage';
import { MODULOS_ADMIN, ROUTE_IDS } from '@/utils/vars';
import RuleIcon from '@mui/icons-material/Rule';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportIcon from '@mui/icons-material/Report';
import SettingsIcon from '@mui/icons-material/Settings';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
// import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import SystemSecurityUpdateGoodIcon from '@mui/icons-material/SystemSecurityUpdateGood';
import { blue, indigo } from '@mui/material/colors';
import { Outlet, json } from 'react-router-dom';
import AprovacionContraseña from '@/Pages/Administracion/Configuracion/Habilitacion';

import { loader as loaderAsignacion } from '@/Pages/Administracion/Asignacion/index';
import { loader as loaderConfiguracionUsu } from '@/Pages/Administracion/Configuracion/Usuario/index';
import { loader as loaderAprovacion } from '@/Pages/Administracion/Aprobacion/index';
import { getUsuarios } from '@/core/services/administrador';

const menuItemsAdmin = [
  {
    name: 'Aprobación',
    to: MODULOS_ADMIN.APROBACION,
    icon: <RuleIcon />,
  },
  {
    name: 'Asignación',
    to: MODULOS_ADMIN.ASIGNACION,
    icon: <AssignmentIcon />,
  },
  {
    name: 'Reportes',
    to: MODULOS_ADMIN.REPORTES,
    icon: <ReportIcon />,
  },
  {
    name: 'Asistencia',
    to: MODULOS_ADMIN.ASISTENCIA,
    icon: <LibraryAddCheckIcon />,
  },
  {
    name: 'Configuración',
    to: '',
    icon: <SettingsIcon />,
    children: [
      {
        name: 'Usuarios',
        to: MODULOS_ADMIN.CONFIGURACION_USUARIOS,
        icon: <SupervisedUserCircleIcon />,
      },
      {
        name: 'Habilitación de contraseña',
        to: MODULOS_ADMIN.CONFIGURACION_HABILITACION,
        icon: <SystemSecurityUpdateGoodIcon />,
      },
    ],
  },
];
const loader = async () => {
  const colors = {
    primary: 'primary',
    HxPrimary: blue[800],
    secondary: 'secondary',
    Hsecondary: indigo[500],
  };
  return json({ colors });
};
const loaderConfiguracionUsuarios = async () => {
  const [{ records: usuarios }] = await Promise.all([getUsuarios()]);
  return json({ usuarios });
};

const adminRoutes = [
  {
    id: ROUTE_IDS.ADMIN,
    loader: loader,
    path: 'admin',
    element: (
      <MainLayout
        TopTitle={'Administración'}
        topBackGround="primary"
        menuItems={menuItemsAdmin}
      />
    ),
    children: [
      {
        index: true,
        element: <RedirectPage url={MODULOS_ADMIN.DASHBOARD} />,
      },
      {
        path: 'dashboard',
        element: <DashBoard tittle="Admin DashBoard" />,
      },
      {
        path: 'aprobacion',
        loader: loaderAprovacion,
        element: <Aprobacion />,
      },
      {
        path: 'asignacion',
        loader: loaderAsignacion,
        element: <Asignacion />,
      },
      {
        path: 'reportes',
        element: <Reporte />,
      },
      {
        path: 'asistencia',
        element: <Asistencia />,
      },
      {
        id: ROUTE_IDS.ADMIN_USUARIOS,
        path: 'configuracion',
        element: <Outlet />,
        loader: loaderConfiguracionUsuarios,
        children: [
          {
            index: true,
            element: (
              <RedirectPage url={MODULOS_ADMIN.CONFIGURACION_USUARIOS} />
            ),
          },
          {
            path: 'usuarios',
            loader: loaderConfiguracionUsu,
            element: <Usuario />,
          },
          {
            path: 'habilitacion',
            element: <AprovacionContraseña />,
          },
        ],
      },
    ],
  },
];

export default adminRoutes;
