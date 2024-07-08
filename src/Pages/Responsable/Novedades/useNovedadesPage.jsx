import { useState } from 'react';
import { useRouteLoaderData, useLoaderData } from 'react-router-dom';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { ROUTE_IDS, TIPOS_NOVEDAD } from '@/utils/vars';
import { formatFechaToStringCol } from '@/utils/functions/index.js';
import { getNovedadList } from '@/core/services';
import useMainApp from '@/shared/Hooks/useMainApp';

const initialStateDataModals = {
  novedad: null,
};
const getNombreCompleto = (novedad) =>
  `${novedad['asistencium']['personal']['nombre'] || ''} ${novedad['asistencium']['personal']['apellido'] || ''}`;

const formatNovedadesList = (novedades) => {
  return novedades?.map((novedad) => ({
    ...novedad,
    cedula: `${novedad['asistencium']['personal']['numDocumento'] || ''}`,
    cargo: novedad?.asistencium?.personal?.cargo?.nombre || '',
    nombreCompleto: getNombreCompleto(novedad),
    fechaInicioNovedadFormat: formatFechaToStringCol(
      novedad['fechaInicioNovedad']
    ),
    fechaInicioNovedad: novedad['fechaInicioNovedad'],
  }));
};
const useNovedadesPage = () => {
  const { colors } = useRouteLoaderData(ROUTE_IDS.RESPONSABLE);
  const { novedadesData } = useLoaderData();
  const { handlePopUpToast } = useMainApp();

  const [filter, setFilter] = useState('');
  const [modalShow, setModalShow] = useState(null);
  const [dataModals, setDataModals] = useState(initialStateDataModals);
  const [novedadesList, setnovedadesList] = useState(
    formatNovedadesList(novedadesData)
  );

  const handleListNovedades = async () => {
    try {
      const novedades = await getNovedadList(TIPOS_NOVEDAD.PENDIENTES);
      setnovedadesList(formatNovedadesList(novedades));
    } catch (error) {
      handlePopUpToast(error?.message, 'error');
    }
  };

  const handleNovedadModal = (data = null) => {
    setDataModals((prev) => ({
      ...prev,
      novedad: data?.novedad,
      personal: data?.personal,
    }));
    setModalShow(!data ? null : 'novedad');
  };
  const afterSubmitNovedad = async () => {
    try {
      handleNovedadModal(null);
      await handleListNovedades();
    } catch (error) {
      handlePopUpToast(error?.message, 'error');
    }
  };

  const headerButtons = [];

  const headerTable = [
    {
      name: 'Cédula',
      key: 'cedula',
    },
    {
      name: 'Nombre',
      key: 'nombreCompleto',
    },
    {
      name: 'Cargo',
      key: 'cargo',
    },
    {
      name: 'Fecha novedad',
      key: 'fechaInicioNovedad',
    },
  ];

  const actionButtons = {
    title: 'Acciones',
    buttons: () => [
      {
        id: 1,
        name: 'Adjuntar',
        handleClick: (index) => {
          const novedad = novedadesList[index];
          handleNovedadModal({
            novedad,
            personal: novedad?.asistencium?.personal,
          });
        },
        icon: NoteAddIcon,
      },
    ],
  };

  return {
    table: {
      headerButtons,
      headerTable,
      actionButtons,
      tableBodyData: novedadesList,
      filter,
      setFilter,
    },
    colors,
    modalShow,
    dataModals,
    handleNovedadModal,
    handleListNovedades,
    afterSubmitNovedad,
  };
};

export default useNovedadesPage;
