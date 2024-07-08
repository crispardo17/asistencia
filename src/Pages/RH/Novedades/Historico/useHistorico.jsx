import { useMemo, useState } from 'react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useRouteLoaderData } from 'react-router-dom';
import { ROUTE_IDS, TIPOS_NOVEDAD } from '@/utils/vars/index.jsx';
import { convertirObjeto, formatDateTables } from '@/utils/functions/index.js';
import { getNovedadList } from '@/core/services/index.js';
import useMainApp from '@/shared/Hooks/useMainApp.jsx';

const initialStateDataModals = {
  detalleNovedad: null,
};
const headerTable = [
  { key: 'asistencium.personal.numDocumento', name: 'Cédula' },
  { key: 'nombres', name: 'Nombre Apellido' },
  { key: 'tipoNovedad.nombre', name: 'Tipo de Novedad' },
  { key: 'generado', name: 'Generada por' },
  { key: 'fechaInicioNovedad', name: 'Fecha de Novedad' },
  { key: 'estado.nombre', name: 'Estado' },
];

const useHistorico = () => {
  const { colors } = useRouteLoaderData(ROUTE_IDS.RRHH);
  const { motivosList } = useRouteLoaderData(ROUTE_IDS.RH_NOVEDADES);

  const { handlePopUpToast } = useMainApp();
  const [tableData, setTableData] = useState([]);
  const [dataReversarForm, setDataReversarForm] = useState('');
  const [modalReversar, setModalReversar] = useState(false);
  const [modalShow, setModalShow] = useState(null);
  const [dataModals, setDataModals] = useState(initialStateDataModals);
  const [currentDocFilter, setcurrentDocFilter] = useState('');

  const listaMotivos = useMemo(
    () =>
      motivosList?.map((motivo) => ({
        value: motivo.idMotivo,
        label: motivo.nombre,
      })),
    [motivosList]
  );

  const handleDetalleNovedadModal = (data = null) => {
    setDataModals((prev) => {
      return { ...prev, detalleNovedad: data };
    });
    setModalShow(!data ? null : 'detalleNovedad');
  };
  const handleReversarModal = (data = null) => {
    setDataReversarForm(data);
    setModalReversar(!!data);
  };

  const headerButtons = [];

  const actionButtons = {
    title: 'Acciones',
    buttons: (row) => [
      {
        id: 'detalleNovedad',
        name: 'detalleNovedad',
        handleClick: (index) => {
          const personal = tableData[index];
          handleDetalleNovedadModal(personal);
        },
        color: colors?.primary,
        icon: RemoveRedEyeIcon,
        disabled: row?.disabledButton,
      },
    ],
  };

  const handleFilterSubmit = async (numDocumento) => {
    try {
      setcurrentDocFilter(numDocumento);
      const request = await getNovedadList(TIPOS_NOVEDAD.HISTORICO, {
        numDocumento,
      });
      if (request)
        setTableData(
          request.map((novedad) => ({
            ...convertirObjeto(novedad),
            nombres: `${novedad['asistencium']['personal']['nombre'] || ''} ${novedad['asistencium']['personal']['apellido'] || ''}`,
            generado: `${novedad['usuarioReporto']['nombre'] || ''} ${novedad['usuarioReporto']['apellido'] || ''}`,
            fechaInicioNovedad: formatDateTables(novedad['fechaInicioNovedad']),
            archivos: novedad?.adjuntoNovedads,
            disabledButton: novedad?.estado?.strCode === 'REVERSADA',
          }))
        );
    } catch (error) {
      handlePopUpToast(error.message, 'error');
    }
  };

  return {
    colors,
    modalShow,
    dataModals,
    listaMotivos,
    currentDocFilter,
    dataReversarForm,
    modalReversar,
    setTableData,
    handleFilterSubmit,
    handleDetalleNovedadModal,
    setModalShow,
    handleReversarModal,

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

export default useHistorico;
