import { useState } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import { useRouteLoaderData, useLoaderData } from 'react-router-dom';
import { ROUTE_IDS, TIPOS_NOVEDAD } from '@/utils/vars/index.jsx';
import { getNovedadList } from '@/core/services';
import { convertirFechaAHoraColombiana } from '@/utils/functions';
import { putNovedadAprovacion } from '@/core/services/administrador';
import useMainApp from '@/shared/Hooks/useMainApp';
import { useUserContext } from '@/shared/Contexts/UserContext/userContex';

const initialStateDataModals = {
  detalle: null,
  aprobacion: null,
};

const headerTable = [
  { key: 'cedula', name: 'Cédula' },
  { key: 'nombres', name: 'Nombre Apellido' },
  { key: 'cargo', name: 'Cargo' },
  { key: 'supervisor', name: 'Supervisor' },
  { key: 'tipoNovedad', name: 'Tipo de Novedad' },
  { key: 'fechaSol', name: 'Fecha solicitud' },
];

const superVisorList = [
  { label: 'sup1', value: 1 },
  { label: 'sup2', value: 2 },
  { label: 'sup3', value: 3 },
];

const formatAprovacionList = (novedades) => {
  return novedades?.map((novedad) => {
    const fechaSol = novedad['fechaReporte']
      ? `${convertirFechaAHoraColombiana(novedad['fechaReporte'], 'PPPP')} `
      : '';
    return {
      ...novedad,
      cedula: `${novedad['asistencium']['personal']['numDocumento'] || ''}`,
      nombres: `${novedad['asistencium']['personal']['nombre'] || ''} ${novedad['asistencium']['personal']['apellido'] || ''}`,
      cargo: `${novedad['asistencium']['personal']['cargo']['nombre'] || ''}`,
      supervisor: `${novedad['usuarioReporto']['nombre'] || ''} ${novedad['usuarioReporto']['apellido'] || ''}`,
      tipoNovedad: `${novedad['tipoNovedad']['nombre'] || ''}`,
      fechaSol,
    };
  });
};

const useAprobacionPage = () => {
  // context
  const { handleListNotificacions: updateNotifications } = useUserContext();
  // hooks
  const { tiposNovedad } = useLoaderData();
  const { colors } = useRouteLoaderData(ROUTE_IDS.ADMIN);

  const [currenValuesFilter, setCurrenValuesFilter] = useState({});
  const [tableData, setTableData] = useState([]);
  const [modalShow, setModalShow] = useState(null);
  const [dataModals, setDataModals] = useState(initialStateDataModals);
  const { handlePopUpToast, layout } = useMainApp();

  const handleDetalleModal = (data = null) => {
    setDataModals((prev) => {
      return {
        ...prev,
        detalle: { novedad: data?.novedad, personal: data?.personal },
      };
    });
    setModalShow(!data ? null : 'detalle');
  };
  const handleAprobacionModal = (data = null) => {
    setDataModals((prev) => {
      return { ...prev, novedad: data };
    });
    setModalShow(!data ? null : 'aprobacion');
  };

  //filtro de fechas
  const handleFilterFechaSubmit = async ({ fechaInicio, fechaFin }) => {
    try {
      const novedades = await getNovedadList(TIPOS_NOVEDAD.APROBACION, {
        fechaInicio,
        fechaFin,
      });

      if (novedades) {
        setTableData(formatAprovacionList(novedades));
      }
    } catch (error) {
      handlePopUpToast('Error filtrando fechas de aprobación', 'error');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const dataSend = {
        aprobado: String(values.aprueba),
        respuestaNovedad: values.observacion?.trim(),
      };
      const { message } = await putNovedadAprovacion(
        values.idReporteNovedad,
        dataSend
      );
      setModalShow(null);
      handlePopUpToast(message);
      message && handleFilterFechaSubmit(currenValuesFilter);
    } catch (error) {
      handlePopUpToast('error...', 'error');
    } finally {
      updateNotifications(layout);
    }
  };

  const headerButtons = [];

  const actionButtons = {
    title: 'Acciones',
    buttons: () => [
      {
        id: 'detalle',
        name: 'Detalle',
        handleClick: (index) => {
          const data = tableData[index];
          handleDetalleModal({
            novedad: data,
            personal: data?.asistencium?.personal,
          });
        },
        color: colors?.primary,
        icon: ContentPasteSearchIcon,
      },
      {
        id: 'aprobacion',
        name: 'Aprobación',
        handleClick: (e) => {
          handleAprobacionModal({
            name: 'aprobación',
            tiposNovedad,
            datos: tableData[e],
          });
        },
        color: colors?.primary,
        icon: CheckCircleOutlineIcon,
      },
    ],
  };

  return {
    colors,
    superVisorList,
    modalShow,
    dataModals,
    setCurrenValuesFilter,
    setTableData,
    handleAprobacionModal,
    handleDetalleModal,
    handleFilterFechaSubmit,
    handleSubmit,
    table: {
      headerButtons,
      headerTable,
      actionButtons,
      tableBodyData: tableData,
      resetTableOnChange: true,
      inputFilter: true,
      pagination: true,
    },
  };
};

export default useAprobacionPage;
