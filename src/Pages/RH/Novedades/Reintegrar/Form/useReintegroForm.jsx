import { useEffect, useState } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { ROUTE_IDS, TIPOS_NOVEDAD } from '@/utils/vars/index.jsx';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { convertirObjeto, formatDateTables } from '@/utils/functions/index.js';
import { getNovedadList } from '@/core/services/index.js';

const initialStateDataModals = {
  detalle: null,
};
const headerTable = [
  { key: 'asistencium.personal.numDocumento', name: 'Cédula' },
  { key: 'nombres', name: 'Nombre Apellido' },
  { key: 'tipoNovedad.nombre', name: 'Tipo de Novedad' },
  { key: 'generado', name: 'Generado por' },
  { key: 'fechaInicioNovedad', name: 'Fecha de Novedad' },
  { key: 'estado.nombre', name: 'Estado' },
];

const useReintegro = ({ data }) => {
  const { colors } = useRouteLoaderData(ROUTE_IDS.RRHH);

  const [tableData, setTableData] = useState([]);
  const [modalShow, setModalShow] = useState(null);
  const [dataModals, setDataModals] = useState(initialStateDataModals);

  const handleDetalleModal = (data = null) => {
    setDataModals((prev) => ({ ...prev, detalle: data }));
    setModalShow(!data ? null : 'detalle');
  };

  const headerButtons = [];

  const actionButtons = {
    title: 'Acciones',
    buttons: () => [
      {
        id: 'detalle',
        name: 'Detalle',
        handleClick: (index) => {
          handleDetalleModal(tableData[index]);
        },
        color: colors?.primary,
        icon: RemoveRedEyeIcon,
      },
    ],
  };

  useEffect(() => {
    if (data && data['asistencium.personal.numDocumento']) {
      (async () => {
        try {
          const request = await getNovedadList(TIPOS_NOVEDAD.HISTORICO, {
            numDocumento: data['asistencium.personal.numDocumento'],
          });
          if (request) {
            setTableData(
              request.map((novedad) => ({
                ...convertirObjeto(novedad),
                nombres: `${novedad['asistencium']['personal']['nombre'] || ''} ${novedad['asistencium']['personal']['apellido'] || ''}`,
                generado: `${novedad['usuarioReporto']['nombre'] || ''} ${novedad['usuarioReporto']['apellido'] || ''}`,
                fechaInicioNovedad: formatDateTables(
                  novedad['fechaInicioNovedad']
                ),
              }))
            );
          } else {
            setTableData([]); // Maneja el caso donde no hay datos
          }
        } catch (error) {
          console.error('Error fetching historico list:', error);
          setTableData([]);
        }
      })();
    }
  }, [data]);

  return {
    colors,
    modalShow,
    dataModals,
    handleDetalleModal,
    setTableData,
    table: {
      headerButtons,
      headerTable,
      actionButtons,
      tableBodyData: tableData,
      resetTableOnChange: true,
      pagination: true,
    },
  };
};

export default useReintegro;
