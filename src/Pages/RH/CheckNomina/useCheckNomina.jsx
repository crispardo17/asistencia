import { useState } from 'react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useRouteLoaderData } from 'react-router-dom';
import { ROUTE_IDS } from '@/utils/vars/index.jsx';
import { getCheckNomina } from '@/core/services/rrhh';
import { postCheckNominaCreate } from '@/core/services/administrador';
import useMainApp from '@/shared/Hooks/useMainApp';
import { formatDateTables } from '@/utils/functions';

const initialStateDataModals = {
  detalle: null,
};
const headerTable = [
  { key: 'idReporteNovedad', name: 'ID' },
  { key: 'cedula', name: 'Cédula' },
  { key: 'nombres', name: 'Nombre Apellido' },
  { key: 'cargo', name: 'Cargo' },
  { key: 'fechaReporte', name: 'Fecha Reporte' },
  { key: 'fechaInicioNovedad', name: 'Fecha Novedad' },
  { key: 'fechaFinNovedad', name: 'Fecha Novedad' },
  { key: 'check', name: 'Check', type: 'checkbox' },
];

const useCheckNomina = () => {
  const { colors } = useRouteLoaderData(ROUTE_IDS.RRHH);

  const { handlePopUpToast } = useMainApp();
  const [checkNomina, setCheckNomina] = useState([]);
  const [modalShow, setModalShow] = useState(null);
  const [dataModals, setDataModals] = useState(initialStateDataModals);
  const [datafilters, setDatafilters] = useState({});

  //filtros CheckNomina

  const handleCheckNominaSubmit = async (data) => {
    const response = await getCheckNomina(data.fechaInicio, data.fechaFin);
    if (response) setCheckNomina(formatCheckNomina(response));
  };

  const formatCheckNomina = (checkNomina) => {
    return checkNomina?.records.map((item) => {
      return {
        ...item,
        cedula: `${item['asistencium']['personal']['numDocumento'] || ''}`,
        nombres: `${item['asistencium']['personal']['nombre']} ${item['asistencium']['personal']['apellido'] || ''}`,
        cargo: `${item['asistencium']['personal']['cargo']['nombre'] || ''}`,
        fechaReporte: `${formatDateTables(item['fechaReporte']) || ''}`,
        fechaInicioNovedad: `${formatDateTables(item['fechaInicioNovedad']) || ''}`,
        fechaFinNovedad: `${formatDateTables(item['fechaFinNovedad']) || ''}`,
      };
    });
  };

  const handleDetalleModal = (data = null) => {
    setDataModals((prev) => {
      return { ...prev, detalle: data };
    });
    setModalShow(!data ? null : 'detalle');
  };

  const sendAsignarResponsable = async (data) => {
    postCheckNominaCreate(data)
      .then((res) => {
        handlePopUpToast(res?.message, 'success');
        handleCheckNominaSubmit(datafilters);
      })
      .catch((error) => {
        handlePopUpToast(error.message, 'error');
      });
  };

  return {
    colors,
    modalShow,
    dataModals,
    datafilters,
    handleDetalleModal,
    setCheckNomina,
    setDatafilters,
    handleCheckNominaSubmit,
    table: {
      headerButtons: [
        {
          id: 'guardar',
          name: 'Guardar',
          handleClick: (_, checkes) => {
            if (checkes.length != 0) sendAsignarResponsable(checkes);
          },
          color: colors?.primary,
        },
      ],
      headerTable,
      actionButtons: {
        title: 'Detalle',
        buttons: () => {
          return [
            {
              id: 'ver',
              name: 'Ver',
              handleClick: (index) => {
                handleDetalleModal(checkNomina[index]);
              },
              color: colors?.primary,
              icon: RemoveRedEyeIcon,
            },
          ];
        },
      },
      tableBodyData: checkNomina,
      resetTableOnChange: true,
      inputFilter: true,
      pagination: true,
    },
  };
};

export default useCheckNomina;
