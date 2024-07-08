import CustomIconButton from '@/shared/Components/Others/CustomIconButton';
import TextFieldNotasTable from '@/shared/Components/Others/TextFieldNotasTable';
import useMainApp from '@/shared/Hooks/useMainApp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useCallback, useEffect, useMemo, useState } from 'react';

const headerTable = [
  {
    name: 'Dia',
    key: 'numDay',
  },
  {
    name: 'Estado',
    key: 'estado',
  },
  {
    name: 'Nota',
    key: 'nota',
  },
  // {
  //   name: 'Acción',
  //   key: 'accion',
  // },
];
const useNovedadInasistencia = ({
  data,
  handleCrearNovedadModal,
  handleSubmitCrearAsistencia,
  colors,
}) => {
  const { handlePopUpToast } = useMainApp();
  const [listaInasistencias, setListaInasistencias] = useState([]);
  const handleAlrtNota = useCallback(
    () => handlePopUpToast('Se requiere nota de inasistencia', 'warn'),
    [handlePopUpToast]
  );

  const tableBodyData = useMemo(
    () =>
      listaInasistencias?.map((elem) => {
        let valueText = '';
        return {
          ...elem,
          estado: (
            <>
              <CustomIconButton
                icon={CheckCircleOutlineIcon}
                color={colors.primary}
                onClick={() =>
                  String(valueText).trim() === ''
                    ? handleAlrtNota()
                    : handleSubmitCrearAsistencia({
                        ...data,
                        ...elem,
                        observacionReporte: valueText,
                      })
                }
              />
              <CustomIconButton
                icon={HighlightOffIcon}
                color={'error'}
                onClick={() =>
                  String(valueText).trim() === ''
                    ? handleAlrtNota()
                    : handleCrearNovedadModal(
                        {
                          personal: {
                            ...data,
                            ...elem,
                            observacionReporte: valueText,
                          },
                          novedad: null,
                        },
                        'inasistencia'
                      )
                }
              />
            </>
          ),
          nota: (
            <TextFieldNotasTable onWrite={(value) => (valueText = value)} />
          ),
        };
      }),
    [
      colors,
      data,
      listaInasistencias,
      handleCrearNovedadModal,
      handleSubmitCrearAsistencia,
      handleAlrtNota,
    ]
  );

  useEffect(() => {
    setListaInasistencias(data?._inasistencias?.data);
  }, [data]);

  return {
    colors,
    table: {
      headerButtons: [],
      headerTable,
      elevation: 0,
      tableBodyData,
      resetTableOnChange: false,
      inputFilter: true,
      pagination: true,
    },
  };
};
export default useNovedadInasistencia;
