import { useState } from 'react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { ROUTE_IDS, TIPOS_NOVEDAD } from '@/utils/vars/index.jsx';
import { useRouteLoaderData } from 'react-router-dom';
import { getNovedadList } from '@/core/services/index.js';
import { convertirObjeto, formatDateTables } from '@/utils/functions/index.js';

const initialStateDataModals = {
  detalle: null,
};
const headerTable = [
  { key: 'asistencium.personal.numDocumento', name: 'Cédula' },
  { key: 'nombres', name: 'Nombre Apellido' },
  { key: 'asistencium.personal.cargo.nombre', name: 'Cargo' },
  { key: 'tipoNovedad.nombre', name: 'Tipo de Novedad' },
  { key: 'fechaReporte', name: 'Fecha de Reporte' },
  { key: 'fechaInicioNovedad', name: 'Fecha Inicio' },
  { key: 'fechaFinNovedad', name: 'Fecha Fin' },
  { key: 'estado.nombre', name: 'Estado' },
];

const useAvalNovedad = () => {
  const { colors } = useRouteLoaderData(ROUTE_IDS.RRHH);

  const [tableData, setTableData] = useState([]);
  const [modalShow, setModalShow] = useState(null);
  const [dataModals, setDataModals] = useState(initialStateDataModals);

  const handleDetalleAvalModal = (data = null) => {
    setDataModals((prev) => ({ ...prev, detalle: data }));
    setModalShow(!data ? null : 'detalle');
  };

  const headerButtons = [];

  const actionButtons = {
    title: 'Acciones',
    buttons: (row) => [
      {
        id: 'detalle',
        name: `Ver detalle ${row?.nombres || ''}`,
        handleClick: (index) => {
          handleDetalleAvalModal(tableData[index]);
        },
        color: colors?.primary,
        icon: RemoveRedEyeIcon,
      },
    ],
  };

  const handleFilterSubmit = async (fechaInicio, fechaFin) => {
    const data = await getNovedadList(TIPOS_NOVEDAD.AVAL, {
      fechaInicio,
      fechaFin,
    });

    if (data)
      setTableData(
        data?.map((novedad) => ({
          ...convertirObjeto(novedad),
          nombres: `${novedad['asistencium']['personal']['nombre'] || ''} ${novedad['asistencium']['personal']['apellido'] || ''}`,
          fechaReporte: formatDateTables(novedad['fechaReporte']),
          fechaInicioNovedad: formatDateTables(novedad['fechaInicioNovedad']),
          fechaFinNovedad: formatDateTables(novedad['fechaFinNovedad']),
        }))
      );
  };

  return {
    colors,
    modalShow,
    dataModals,
    handleDetalleAvalModal,
    setTableData,
    handleFilterSubmit,
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

export default useAvalNovedad;
