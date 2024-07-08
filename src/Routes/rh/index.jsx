import MainLayout from '@/shared/Components/Layouts/main';
import CheckNomina from '@/Pages/RH/CheckNomina/index.jsx';
import ControlAsistencia from '@/Pages/RH/ControlAsistencia';
import AvalNovedad from '@/Pages/RH/Novedades/AvalNovedad/index.jsx';
import Crear from '@/Pages/RH/Novedades/Crear/index.jsx';
import Historico from '@/Pages/RH/Novedades/Historico/index.jsx';
import Lista from '@/Pages/RH/Novedades/Lista/index.jsx';
import Reintegrar from '@/Pages/RH/Novedades/Reintegrar/index.jsx';
import RrHhPage from '@/Pages/RH/index.jsx';
import RedirectPage from '@/utils/RedirectPage';
// import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import FeedIcon from '@mui/icons-material/Feed';
import { orange, red } from '@mui/material/colors';
import { MODULOS_RRHH, ROUTE_IDS } from '@/utils/vars';
import { Outlet, json } from 'react-router-dom';
import { getAreasList, getMotivosList } from '@/core/services/rrhh/index.js';

const menuItemsRrHh = [
  {
    name: 'Control de asistencia',
    to: MODULOS_RRHH.CONTROL_ASISTENCIA,
    icon: <LibraryAddCheckIcon />,
  },
  {
    name: 'Check Nómina',
    to: MODULOS_RRHH.CHECK_NOMINA,
    icon: <ReceiptIcon />,
  },
  {
    name: 'Novedades',
    to: '',
    icon: <FeedIcon />,
    children: [
      {
        name: 'Lista de novedades',
        to: MODULOS_RRHH.NOVEDADES_LISTA,
        icon: <FormatListBulletedIcon />,
      },
      {
        name: 'Aval',
        to: MODULOS_RRHH.NOVEDADES_AVAL,
        icon: <SpellcheckIcon />,
      },
      {
        name: 'Historico',
        to: MODULOS_RRHH.NOVEDADES_HISTORICO,
        icon: <SpellcheckIcon />,
      },
      {
        name: 'Editar',
        to: MODULOS_RRHH.NOVEDADES_CREAR,
        icon: <SpellcheckIcon />,
      },
      {
        name: 'Reintegrar',
        to: MODULOS_RRHH.NOVEDADES_REINTEGRAR,
        icon: <SpellcheckIcon />,
      },
    ],
  },
];
const loaderNovedadesRh = async () => {
  const [{ records: motivosList }] = await Promise.all([getMotivosList()]);
  return json({ motivosList });
};
const loader = async () => {
  const [{ records: areasList }] = await Promise.all([getAreasList()]);
  const colors = {
    primary: 'warning',
    HxPrimary: orange[800],
    secondary: 'error',
    Hsecondary: red[500],
  };
  return json({ colors, areasList });
};

const rrHhRoutes = [
  {
    id: ROUTE_IDS.RRHH,
    loader: loader,
    path: 'rrhh',
    element: (
      <MainLayout
        TopTitle={'RRHH'}
        menuItems={menuItemsRrHh}
        topBackGround="warning"
      />
    ),
    children: [
      {
        index: true,
        element: <RedirectPage url={MODULOS_RRHH.DASHBOARD} />,
      },
      {
        path: 'dashboard',
        element: <RrHhPage tittle="RRHH DashBoard" />,
      },
      {
        path: 'control-asistencia',
        element: <ControlAsistencia />,
      },
      {
        path: 'check-nomina',
        element: <CheckNomina />,
      },
      {
        path: 'novedades',
        element: <Outlet />,
        id: ROUTE_IDS.RH_NOVEDADES,
        loader: loaderNovedadesRh,
        children: [
          {
            index: true,
            element: <RedirectPage url={MODULOS_RRHH.NOVEDADES_LISTA} />,
          },
          {
            path: 'lista',
            element: <Lista />,
          },
          {
            path: 'aval-novedad',
            element: <AvalNovedad />,
          },
          {
            path: 'historico',
            element: <Historico />,
          },
          {
            path: 'crear',
            element: <Crear />,
          },
          {
            path: 'reintegrar',
            element: <Reintegrar />,
          },
        ],
      },
    ],
  },
];

export default rrHhRoutes;
