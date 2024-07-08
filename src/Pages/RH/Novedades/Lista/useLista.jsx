import { useMemo, useState } from 'react';
import { ROUTE_IDS, TIPOS_NOVEDAD } from '@/utils/vars/index.jsx';
import { useRouteLoaderData } from 'react-router-dom';
import { convertirObjeto, formatDateTables } from '@/utils/functions/index.js';
import { getNovedadList, getSupervisoresList } from '@/core/services/index.js';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import useMainApp from '@/shared/Hooks/useMainApp.jsx';

const initialStateDataModals = {
  cerrar: null,
};
const headerTable = [
  { key: 'asistencium.personal.numDocumento', name: 'Cédula' },
  { key: 'nombres', name: 'Nombre Apellido' },
  { key: 'asistencium.personal.cargo.nombre', name: 'Cargo' },
  { key: 'tipoNovedad.nombre', name: 'Tipo de Novedad' },
  { key: 'fechaInicioNovedad', name: 'Fecha de Novedad' },
  { key: 'estado.nombre', name: 'Estado' },
];

const useLista = () => {
  const { colors, areasList } = useRouteLoaderData(ROUTE_IDS.RRHH);
  const { motivosList } = useRouteLoaderData(ROUTE_IDS.RH_NOVEDADES);
  const { supervisoresList } = useRouteLoaderData(ROUTE_IDS.USER);
  const [currentValuesFilter, setCurrentValuesFilter] = useState({});
  const { handlePopUpToast } = useMainApp();

  const [tableData, setTableData] = useState([]);
  const [modalShow, setModalShow] = useState(null);
  const [dataModals, setDataModals] = useState(initialStateDataModals);
  const [listaSupervisores, setListaSupervisores] = useState(supervisoresList);
  const listaMotivos = useMemo(
    () =>
      motivosList?.map((motivo) => ({
        value: motivo.idMotivo,
        label: motivo.nombre,
      })),
    [motivosList]
  );

  const handleReversarModal = (data = null) => {
    setDataModals((prev) => ({ ...prev, cerrar: data }));
    setModalShow(!data ? null : 'cerrar');
  };

  const handleSupervisorByArea = async (idArea) => {
    try {
      const { records } = await getSupervisoresList(idArea);
      setListaSupervisores(records);
    } catch (error) {
      handlePopUpToast(error.message, 'error');
    }
  };

  const headerButtons = [];

  const actionButtons = {
    title: 'Cerrar',
    color: '#ed6c02',
    buttons: (row) => {
      return [
        {
          id: 'cerrar',
          name: 'Cerrar',
          handleClick: (index) => {
            handleReversarModal(tableData[index]?.idReporteNovedad);
          },
          color: colors?.primary,
          icon: DisabledByDefaultIcon,
          disabled: row?.disabledButton,
        },
      ];
    },
  };

  const handleFilterSubmit = async (values) => {
    const request = await getNovedadList(TIPOS_NOVEDAD.LISTA, values);

    if (request) {
      setTableData(
        request.map((novedad) => ({
          ...convertirObjeto(novedad),
          nombres: `${novedad['asistencium']['personal']['nombre'] || ''} ${novedad['asistencium']['personal']['apellido'] || ''}`,
          fechaInicioNovedad: formatDateTables(novedad['fechaInicioNovedad']),
          disabledButton:
            novedad?.estado?.strCode === 'INACTIVA' ||
            novedad?.estado?.strCode === 'REVERSADA',
        }))
      );
    } else return;
  };

  return {
    colors,
    areasList,
    modalShow,
    dataModals,
    listaSupervisores,
    listaMotivos,
    motivosList,
    currentValuesFilter,
    handleReversarModal,
    setTableData,
    handleFilterSubmit,
    handleSupervisorByArea,
    setCurrentValuesFilter,
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

export default useLista;
