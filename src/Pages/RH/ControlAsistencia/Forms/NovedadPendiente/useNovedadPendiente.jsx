import { useState, useEffect, useMemo } from 'react';
import { convertirFechaAHoraColombiana } from '@/utils/functions';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import useMainApp from '@/shared/Hooks/useMainApp';
import { ROUTE_IDS } from '@/utils/vars';

const propsIcons = { sx: { cursor: 'pointer' } };
const useNovedadPendiente = ({ data, handleCrearNovedadModal, colors }) => {
  const { layout } = useMainApp();
  const [listNovedadesPendientes, setListNovedadesPendientes] = useState([]);

  const ButtonIconTable = useMemo(
    () => (layout === ROUTE_IDS.RRHH ? RemoveRedEyeIcon : EditIcon),
    [layout]
  );

  const headerTable = [
    {
      name: 'Id',
      key: 'idReporteNovedad',
    },
    {
      name: 'Tipo novedad',
      key: 'tipoNovedad',
    },
    {
      name: 'Fecha Novedad',
      key: 'fechaInicioNovedad',
    },
    {
      name: layout === ROUTE_IDS.RRHH ? 'Ver' : 'Editar',
      key: 'verAdjuntar',
    },
  ];

  useEffect(() => {
    setListNovedadesPendientes(data?._novedadesPendientes?.data);
  }, [data]);

  return {
    table: {
      headerButtons: [],
      headerTable,
      tableBodyData:
        listNovedadesPendientes?.map((elem) => {
          return {
            ...elem,
            fechaInicioNovedad: convertirFechaAHoraColombiana(
              elem.fechaInicioNovedad,
              'PPPPP'
            ),
            tipoNovedad: elem?.tipoNovedad?.nombre,
            verAdjuntar: (
              <IconButton
                onClick={() => {
                  handleCrearNovedadModal(
                    {
                      personal: {
                        ...data,
                        ...elem,
                      },
                      novedad: elem,
                    },
                    'novedad'
                  );
                }}
              >
                <ButtonIconTable {...propsIcons} color={colors?.primary} />
              </IconButton>
            ),
          };
        }) || [],
      resetTableOnChange: true,
      inputFilter: true,
      pagination: true,
    },
  };
};
export default useNovedadPendiente;
