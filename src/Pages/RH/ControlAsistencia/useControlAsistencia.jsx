import { useState } from 'react';
import { useLocation, useRouteLoaderData } from 'react-router-dom';
import {
  getAsistenciaControl,
  getPersonalReporteAsistencia,
} from '@/core/services';
import { postAsistenciaCreate } from '@/core/services/responsable';
import SquareDays from '@/shared/Components/Others/SquareDays';
import useMainApp from '@/shared/Hooks/useMainApp';
import {
  convertirFechaAHoraColombiana,
  getNumeroDiaActual,
  getRouteId,
} from '@/utils/functions';
import { ROUTE_IDS } from '@/utils/vars';
import ListAltIcon from '@mui/icons-material/ListAlt';
import useDowloadReportePersonal from '@/shared/Hooks/useDowloadReportePersonal';

const headerTable = [
  { key: 'numDocumento', name: 'Cédula' },
  { key: 'nombre', name: 'Nombre Apellido' },
  { key: 'cargo', name: 'Cargo' },
  { key: 'centroCosto', name: 'Centro costo' },
  { key: 'fechaIngreso', name: 'Fecha Ingreso' },
  { key: 'supervisor', name: 'Supervisor' },
  { key: 'diasInasistencia', name: 'Dias sin asistencia' },
  { key: 'novedadesPendientes', name: '# Novedades Pendientes' },
];

const detailsToExcelReporte = (detailsDiasHeaders) => [
  ...detailsDiasHeaders,
  { key: 'novedades', name: 'Novedades' },
  { key: 'vac', name: 'VAC' },
  { key: 'inc', name: 'INC' },
  { key: 'aus', name: 'AUS' },
  { key: 'susp', name: 'SUSP' },
  { key: 'uc', name: 'UC' }, //pendiente Validar
  { key: 'dom', name: 'DOM' },
  { key: 'desc_dom', name: 'DESC DOM' }, //pendiente validar
  { key: 'licMat_Pat', name: 'Lic Mat-Pater' },
  { key: 'sin_contra', name: 'Sin Contra' },
  { key: 'uc_luto', name: 'Uc Luto' },
  { key: 'ucPer_Remunera', name: 'Uc Per-Remunerada' },
  { key: 'dias_Capaci', name: 'Dias Capaci' }, //pendiente vlidar C/A
  { key: 'retiro', name: 'Retiro' },
  { key: 'soportePendiente', name: 'Soportes Pendientes' },
];
const formatLabelsNameValue = (supervisores) =>
  supervisores.map((elem, index) => ({
    // value: elem?.idUsuario,
    value: index,
    label: `${elem?.nombre || ''} ${elem?.apellido || ''}`,
    areasArr: [...new Set(elem?.liderProcesos?.map((lid) => lid?.id_area))],
  }));

const initialStateDataModals = {
  inasistencia: null,
  pendiente: null,
  // novedad creacion
  nov: null,
};

// const IconReporte = () => {
//   return <ListAltIcon />;
// };
const useControlAsistencia = () => {
  // hooks
  const location = useLocation();
  const { supervisoresList } = useRouteLoaderData(ROUTE_IDS.USER);
  const { colors } = useRouteLoaderData(getRouteId(location.pathname));
  const { handlePopUpToast, layout } = useMainApp();
  const {
    handleDowLoadReporte,
    formatDetallesPersonalToFileExcellData,
    getFileDataFormat,
    getHeaderOrders,
  } = useDowloadReportePersonal();
  // states
  const [tableData, setTableData] = useState([]);
  const [modalShow, setModalShow] = useState(null);
  const [childModalShow, setChildModalShow] = useState(null);
  const [dataModals, setDataModals] = useState(initialStateDataModals);
  const [inasistenciaData, setInasistenciaData] = useState(null);
  const [novedadPendienteData, setNovedadPendienteData] = useState(null);
  const [valuesSavedFilter, setValuesSavedFilter] = useState({});
  const [loadingButtonReporte, setLoadingButtonReporte] = useState(false);
  const [loadRepIndividual, setLoadRepIndividual] = useState('');

  const getReporteByPersonalId = async (personalIds) => {
    let done = null;
    try {
      setLoadingButtonReporte(personalIds?.length > 1);
      setLoadRepIndividual(personalIds?.length === 1 ? personalIds[0] : '');
      const { mesAnno, areasId } = valuesSavedFilter;
      // const diasMes = getDaysInMonth(mesAnno.split('-')[1]);
      const fechaInicio = `${mesAnno}-01`;
      const fechaFin = `${mesAnno}-${getNumeroDiaActual()}`;
      const { records } = await getPersonalReporteAsistencia({
        areasId,
        fechaInicio,
        fechaFin,
        personalIds,
      });
      const { detalles } = records[0];
      const detailsDiasHeader = Object.keys(detalles)
        .map((det) => {
          return det.startsWith('_d')
            ? {
                key: det,
                name: `D${det.split('_d')[1]}`,
              }
            : null;
        })
        .filter((elem) => !!elem);

      done = dowloadReporte(
        records.map((personal) => ({
          ...personal,
          mes: convertirFechaAHoraColombiana(
            fechaInicio,
            'MMMM'
          )?.toUpperCase(),
          cargo: personal?.cargo?.nombre,
          empresa: personal?.empresa?.nombre,
          cc: personal?.area?.centroCosto?.nombre,
          fechaIngreso: convertirFechaAHoraColombiana(
            personal.fechaIngreso,
            'PPPP'
          ),
          supervisor: `${personal?.empresa?.liderProcesos[0]?.usuario?.nombre || ''} ${personal?.empresa?.liderProcesos[0]?.usuario?.apellido || ''}`,
        })),
        detailsToExcelReporte(detailsDiasHeader)
      );
    } catch (error) {
      handlePopUpToast('error obteniendo reporte', 'error');
    } finally {
      done &&
        setTimeout(() => {
          setLoadingButtonReporte(false);
          setLoadRepIndividual('');
        }, 500);
    }
  };

  const dowloadReporte = (personals, headers) => {
    const data = personals.flatMap((personal) => {
      return formatDetallesPersonalToFileExcellData({
        ...personal,
        detalles: [personal.detalles],
      });
    });
    const headerOrders = getHeaderOrders(headers, data[0].MES);
    const fileDataFormat = getFileDataFormat(data, headerOrders);

    const { mesAnno } = valuesSavedFilter;
    const fechaInicio = `${mesAnno}-01`;
    const fechaFin = `${mesAnno}-${getNumeroDiaActual()}`;

    return handleDowLoadReporte(
      fileDataFormat,
      `Control ${personals?.length === 1 ? data[0].NOMBRE : 'Personal'} del ${fechaInicio} al ${fechaFin}`,
      `${fechaInicio}, ${fechaFin}`,
      headerOrders
    );
  };

  const headerButtons = [
    {
      id: 1,
      name: 'Generar Reporte',
      handleClick: () => {
        const personalIds = tableData.map((personal) => personal?.idPersonal);
        getReporteByPersonalId(personalIds);
      },
      color: colors?.primary,
      disabled: !tableData.length,
      loading: loadingButtonReporte,
    },
  ];

  const actionButtons = {
    title: 'Reporte Individual',
    buttons: (row) => [
      {
        id: 1,
        name: `Generar reporte ${row?.numDocumento || ''} `,
        handleClick: (index) => {
          const personalId = tableData[index]?.idPersonal;
          getReporteByPersonalId([personalId]);
        },
        color: colors?.primary,
        icon: ListAltIcon,
        loading: loadRepIndividual === row?.idPersonal,
      },
    ],
  };

  const formatDataTable = (records) =>
    records?.map((personal) => ({
      ...personal,
      cargo: personal?.cargo?.nombre || '',
      centroCosto: personal?.area?.centroCosto?.nombre || '',
      supervisor: `${personal?.supervisor?.usuario?.nombre || ''} ${personal?.supervisor?.usuario?.apellido || ''}`,
      diasInasistencia: (
        <SquareDays
          cantidad={personal?._inasistencias?.cant}
          color={colors?.HxPrimary}
          onClick={() => handleInasistenciaModal(personal)}
        />
      ),
      novedadesPendientes: (
        <SquareDays
          cantidad={personal?._novedadesPendientes?.cant}
          color={colors?.HxPrimary}
          onClick={() => handlePendienteModal(personal)}
        />
      ),
    }));

  const handleCheckCrearAsistencia = async (personal) => {
    try {
      const { idPersonal, numDay, fecha, observacionReporte } = personal;
      const data = {
        id_personal: idPersonal,
        numDiaAsis: numDay,
        fechaAsistencia: fecha,
        asistio: true,
        activo: true,
        observacionReporte,
      };
      const { message } = await postAsistenciaCreate(data);
      await handleRefreshData(idPersonal);
      handlePopUpToast(message);
    } catch (error) {
      handlePopUpToast(error?.message, 'error');
    }
  };

  const handleGetDataList = async (values) => {
    try {
      setValuesSavedFilter(values);
      const { records } = await getAsistenciaControl(values);
      setTableData(formatDataTable(records) || []);
      return records;
    } catch (error) {
      handlePopUpToast(error?.message, 'error');
    }
  };

  const handleRefreshData = async (id_personal, type = 'inasistencia') => {
    const data = await handleGetDataList(valuesSavedFilter);
    const refData = data?.find((el) => el?.idPersonal === id_personal);
    type === 'inasistencia'
      ? setInasistenciaData(refData)
      : setNovedadPendienteData(refData);
  };

  const handleInasistenciaModal = (data = null) => {
    setInasistenciaData(data);
    setModalShow(!data ? null : 'inasistencia');
  };

  const handlePendienteModal = (data) => {
    setNovedadPendienteData(data);
    setModalShow(!data ? null : 'pendiente');
  };

  const handleCrearNovedadModal = (data = null, modal = null) => {
    setDataModals((prev) => ({
      ...prev,
      nov: { personal: data?.personal, novedad: data?.novedad },
    }));
    setChildModalShow(modal);
  };

  return {
    supervisoresList: formatLabelsNameValue(supervisoresList),
    modalShow,
    childModalShow,
    dataModals,
    inasistenciaData,
    novedadPendienteData,
    colors,
    layout,
    handleInasistenciaModal,
    handlePendienteModal,
    handleCrearNovedadModal,
    handleGetDataList,
    setValuesSavedFilter,
    setDataModals,
    handleRefreshData,
    handleCheckCrearAsistencia,
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
export default useControlAsistencia;
