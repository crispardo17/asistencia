import useMainApp from '@/shared/Hooks/useMainApp';

import { convertirFechaAHoraColombiana } from '@/utils/functions';
import { ROUTE_IDS } from '@/utils/vars';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useState } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { getPersonalReporteAsistencia } from '@/core/services';
import useDowloadReportePersonal from '@/shared/Hooks/useDowloadReportePersonal';

const headerTable = [
  { key: 'numDocumento', name: 'Documento' },
  { key: 'nombre', name: 'Nombre Completo' },
  { key: 'cargo', name: 'Cargo' },
  { key: 'cc', name: 'CC' },
  { key: 'empresa', name: 'Empresa' },
  { key: 'fechaIngreso', name: 'Fecha Ingreso' },
  { key: 'supervisor', name: 'Supervisor' },
  { key: 'mes', name: 'Mes' },
];

const getDetailHeadersTable = (detailsDiasHeaders) => [
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

// const separarStr = (...strings) => strings.join(' - ');

const formatLabelsNameValueSupervisores = (supervisores) =>
  supervisores.map((supervisor, index) => ({
    value: index,
    label: `${supervisor?.nombre || ''} ${supervisor?.apellido || ''}`,
    areasArr: [
      ...new Set(supervisor?.liderProcesos?.map((lid) => lid?.id_area)),
    ],
  }));

const useReportePage = () => {
  // hooks
  const { supervisoresList } = useRouteLoaderData(ROUTE_IDS.USER);
  const {
    handleDowLoadReporte,
    formatDetallesPersonalToFileExcellData,
    getFileDataFormat,
    getHeaderOrders,
  } = useDowloadReportePersonal();
  const { colors, handlePopUpToast } = useMainApp();
  // states
  const [detailsDiasHeaders, setDetailsDiasHeaders] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [valuesFilter, setValuesFilter] = useState({});

  function formatTablePersonals(personals, mesSelected) {
    return personals?.map((personal) => {
      const { nombre, apellido, cargo, empresa, area, fechaIngreso, detalles } =
        personal;
      setDetailsDiasHeaders(
        Object.keys(detalles)
          .map((det) => {
            return det.startsWith('_d')
              ? {
                  key: det,
                  name: `D${det.split('_d')[1]}`,
                }
              : null;
          })
          .filter((elem) => !!elem)
      );

      return {
        ...personal,
        nombre: `${nombre || ''} ${apellido || ''}`,
        cargo: `${cargo.nombre || ''}`,
        cc: area?.centroCosto.nombre ?? '',
        empresa: empresa.nombre ?? '',
        fechaIngreso: convertirFechaAHoraColombiana(fechaIngreso, 'PPPP'),
        supervisor: `${empresa?.liderProcesos[0]?.usuario?.nombre || ''} ${empresa?.liderProcesos[0]?.usuario?.apellido || ''}`,
        mes: mesSelected,
        detalles: [detalles],
      };
    });
  }

  const handleSubmitFilterReporte = async (values) => {
    try {
      setValuesFilter(values);
      const mesSelected = convertirFechaAHoraColombiana(
        values.fechaInicio,
        'MMMM'
      ).toUpperCase();
      const params = {
        ...values,
        areasId:
          values.supervisorId !== '-1'
            ? formatLabelsNameValueSupervisores(supervisoresList)[
                values.supervisorId
              ]?.areasArr
            : undefined,
      };
      const data = await getPersonalReporteAsistencia(params);
      setTableData(formatTablePersonals(data.records ?? [], mesSelected));
    } catch (error) {
      handlePopUpToast(error?.message, 'error');
    }
  };

  const handleDowloadReporteIndividual = (indexElement) => {
    const personal = tableData[indexElement];
    const data = formatDetallesPersonalToFileExcellData(personal);
    const headerOrders = getHeaderOrders(detailsDiasHeaders, personal?.mes);
    const fileDataFormat = getFileDataFormat(data, headerOrders);

    handleDowLoadReporte(
      fileDataFormat,
      `Reporte ${data[0]?.NOMBRE} ${data[0]?.MES || ''} Supervisor ${data[0]?.SUPERVISOR || ''}`,
      `${personal?.personalName} ${personal?.mes?.toUpperCase()}`,
      headerOrders
    );
  };

  const handleDownloadReporteGlobal = () => {
    const data = tableData.flatMap((personal) => {
      return formatDetallesPersonalToFileExcellData(personal);
    });
    const headerOrders = getHeaderOrders(detailsDiasHeaders, data[0]?.MES);
    const fileDataFormat = getFileDataFormat(data, headerOrders);

    handleDowLoadReporte(
      fileDataFormat,
      `Reporte Personal del ${valuesFilter?.fechaInicio} al ${valuesFilter?.fechaFin}`,
      `${valuesFilter?.fechaInicio}, ${valuesFilter?.fechaFin}`,
      headerOrders
    );
  };

  const actionButtons = {
    title: 'Reporte',
    buttons: () => [
      {
        id: 'reporte',
        name: 'Generar reporte',
        handleClick: handleDowloadReporteIndividual,
        color: 'inherit',
        icon: ListAltIcon,
      },
    ],
  };

  const headerButtons = [
    {
      id: 1,
      name: 'Generar Reporte',
      handleClick: handleDownloadReporteGlobal,
      color: colors?.primary,
      disabled: false,
    },
  ];

  return {
    colors,
    tableData,
    supervisoresList: formatLabelsNameValueSupervisores(supervisoresList),
    handleSubmitFilterReporte,
    tableDetails: {
      data: tableData,
      tableHeaders: headerTable,
      actionButtons,
      headerButtons,
      detailHeadersTable: getDetailHeadersTable(detailsDiasHeaders),
      detailDataKey: 'detalles',
      inputFilter: tableData.length > 0,
    },
  };
};

export default useReportePage;
