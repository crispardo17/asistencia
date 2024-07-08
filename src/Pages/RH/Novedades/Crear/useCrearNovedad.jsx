import { useState } from 'react';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import { ROUTE_IDS, TIPOS_NOVEDAD } from '@/utils/vars/index.jsx';
import { useRouteLoaderData } from 'react-router-dom';
import { getNovedadList } from '@/core/services/index.js';
import {
  getCurrentDate,
  getFechaColombia,
  getNumeroDiaActual,
} from '@/utils/functions/index.js';
import { format } from 'date-fns';

const initialStateDataModals = {
  novedad: null,
};
const headerTable = [
  { key: 'cedula', name: 'Cédula' },
  { key: 'nombres', name: 'Nombre Apellido' },
  { key: 'supervisor', name: 'Supervisor' },
  { key: 'cargo', name: 'Cargo' },
  {
    key: 'centroCosto',
    name: 'Centro de Costos',
  },
  { key: 'fechaInicio', name: 'Fecha inicio' },
  { key: 'fachaFin', name: 'Fecha fin' },
  { key: 'fechaRep', name: 'Fecha Reporte' },
];

const dataTable = [];

const useCrearNovedad = () => {
  const { colors } = useRouteLoaderData(ROUTE_IDS.RRHH);
  const [currentValuesFilter, setCurrentValuesFilter] = useState({});
  const [tableData, setTableData] = useState(dataTable);
  const [modalShow, setModalShow] = useState(null);
  const [dataModals, setDataModals] = useState(initialStateDataModals);

  const handleGenerarNovedadModal = (data = null) => {
    setDataModals((prev) => {
      return { ...prev, novedad: data?.novedad, personal: data?.personal };
    });
    setModalShow(!data ? null : 'novedad');
  };

  const headerButtons = [];

  const actionButtons = {
    title: 'Editar Novedad',
    buttons: () => [
      {
        id: 'novedad',
        name: 'Editar Novedad:',
        handleClick: (index) => {
          const data = tableData[index];
          handleGenerarNovedadModal({
            novedad: data,
            personal: {
              ...data?.asistencium?.personal,
              fecha: format(getCurrentDate().toISOString(), 'yyyy-MM-dd'),
              numDay: Number(getNumeroDiaActual()),
            },
          });
        },
        color: colors?.primary,
        icon: ContentPasteSearchIcon,
      },
    ],
  };

  const handleFilterSubmit = async (numDocumento) => {
    const request = await getNovedadList(TIPOS_NOVEDAD.CREAR, {
      numDocumento,
    });
    if (request) {
      setTableData(
        request.map((novedad) => {
          const fechaInicio = getFechaColombia(novedad['fechaInicioNovedad'])
            .toISOString()
            .split('T')[0];
          const fachaFin = getFechaColombia(novedad['fechaFinNovedad'])
            .toISOString()
            .split('T')[0];
          const fechaRep = getFechaColombia(novedad['fechaReporte'])
            .toISOString()
            .split('T')[0];

          return {
            ...novedad,
            cedula: novedad?.asistencium?.personal?.numDocumento,
            nombres: `${novedad['asistencium']['personal']['nombre'] || ''} ${novedad['asistencium']['personal']['apellido'] || ''}`,
            supervisor: `${novedad['usuarioReporto']['nombre'] || ''} ${novedad['usuarioReporto']['apellido'] || ''}`,
            fechaInicio,
            fachaFin,
            fechaRep,
            cargo: novedad?.asistencium?.personal?.cargo?.nombre,
            centroCosto:
              novedad?.asistencium?.personal?.area?.centroCosto?.nombre,
          };
        })
      );
    } 
  };

  return {
    colors,
    modalShow,
    dataModals,
    currentValuesFilter,
    setTableData,
    handleFilterSubmit,
    handleGenerarNovedadModal,
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

export default useCrearNovedad;
