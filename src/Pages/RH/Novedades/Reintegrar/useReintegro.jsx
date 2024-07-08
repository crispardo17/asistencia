import { useMemo, useState } from 'react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { ROUTE_IDS, TIPOS_NOVEDAD } from '@/utils/vars/index.jsx';
import { useRouteLoaderData } from 'react-router-dom';
import { getNovedadList } from '@/core/services/index.js';
import { convertirObjeto, formatDateTables } from '@/utils/functions/index.js';
import AutorenewIcon from '@mui/icons-material/Autorenew';

const initialStateDataModals = {
  ver: null,
  reingreso: { idPersonal: null, idReporteNovedad: null },
};

const headerTable = [
  { key: 'asistencium.personal.numDocumento', name: 'Cédula' },
  { key: 'nombres', name: 'Nombre Apellido' },
  { key: 'asistencium.personal.cargo.nombre', name: 'Cargo' },
  { key: 'generado', name: 'Generada por' },
  { key: 'fechaInicioNovedad', name: 'Fecha de Novedad' },
];

const useReintegro = () => {
  const { colors } = useRouteLoaderData(ROUTE_IDS.RRHH);
  const { motivosList } = useRouteLoaderData(ROUTE_IDS.RH_NOVEDADES);
  const [currentValuesFilter, setCurrentValuesFilter] = useState({});
  const [tableData, setTableData] = useState([]);
  const [modalShow, setModalShow] = useState(null);
  const [dataModals, setDataModals] = useState(initialStateDataModals);
  const listMotivos = useMemo(
    () =>
      motivosList.map((motivo) => ({
        value: motivo.idMotivo,
        label: motivo.nombre,
      })),
    [motivosList]
  );

  const handleVerModal = (data = null) => {
    setDataModals((prev) => ({ ...prev, ver: data }));
    setModalShow(!data ? null : 'ver');
  };
  const handleReingresoModal = (data = null) => {
    setDataModals((prev) => ({ ...prev, reingreso: data }));
    setModalShow(!data ? null : 'reingreso');
  };

  const headerButtons = [];

  const actionButtons = {
    title: 'Acciones',
    buttons: ()=> [
      {
        id: 'ver',
        name: 'Ver',
        handleClick: (index) => {
          handleVerModal(tableData[index]);
        },
        color: colors?.primary,
        icon: RemoveRedEyeIcon,
      },
      {
        id: 'reingreso',
        name: 'Reingreso',
        handleClick: (index) => {
          const idPersonal = tableData[index]['asistencium.personal.idPersonal'];
          handleReingresoModal({
            idReporteNovedad: tableData[index]?.idReporteNovedad,
            idPersonal,
          });
        },
        color: colors?.primary,
        icon: AutorenewIcon,
      },
    ],
  };

  const handleFilterSubmit = async (numDocumento) => {
    const request = await getNovedadList(TIPOS_NOVEDAD.REINTEGRAR, {
      numDocumento,
    });
    if (request)
      setTableData(
        request.map((novedad) => ({
          ...convertirObjeto(novedad),
          nombres: `${novedad['asistencium']['personal']['nombre'] || ''} ${novedad['asistencium']['personal']['apellido'] || ''}`,
          generado: `${novedad['usuarioReporto']['nombre'] || ''} ${novedad['usuarioReporto']['apellido'] || ''}`,
          fechaInicioNovedad: formatDateTables(novedad['fechaInicioNovedad']),
        }))
      );
    else setTableData([]);
  };

  return {
    colors,
    modalShow,
    dataModals,
    listMotivos,
    currentValuesFilter,
    setCurrentValuesFilter,
    handleVerModal,
    handleReingresoModal,
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

export default useReintegro;
