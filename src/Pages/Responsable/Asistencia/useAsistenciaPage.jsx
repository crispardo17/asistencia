import { useCallback, useMemo, useState } from 'react';
import {
  useLoaderData,
  useNavigate,
  useRouteLoaderData,
} from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { MODULOS_RESPONSABLE, ROUTE_IDS } from '@/utils/vars';
import {
  getCurrentDate,
  getNumeroDiaActual,
  obtenerDiasAnterioresYPosteriores,
  obtenerDiasPosteriores,
} from '@/utils/functions';
import {
  getPersonalAsistencias,
  postAsistenciaCreate,
} from '@/core/services/responsable';
import useMainApp from '@/shared/Hooks/useMainApp';
import CustomIconButton from '@/shared/Components/Others/CustomIconButton';
import { Box } from '@mui/material';
import { useUserContext } from '@/shared/Contexts/UserContext/userContex';

const initialStateDataModals = {
  novedad: null,
  personal: null,
};
const useAsistenciaPage = () => {
  // context
  const { handleListNotificacions: updateNotifications } = useUserContext();

  // hooks
  const { colors: layoutColors } = useRouteLoaderData(ROUTE_IDS.RESPONSABLE);
  const { personalAsistencias: dataAsistencias } = useLoaderData();
  const navigate = useNavigate();
  const { handlePopUpToast, layout } = useMainApp();

  // states
  const [filter, setFilter] = useState('');
  const [modalShow, setModalShow] = useState(null);
  const [dataModals, setDataModals] = useState(initialStateDataModals);
  const [personalAsistencias, setPersonalAsistencias] =
    useState(dataAsistencias);

  // vars / usememos
  const currentDay = Number(getNumeroDiaActual());
  const days = useMemo(() => {
    let somePersonalNoAsist = null;
    for (let i = 0; i < personalAsistencias.length; i++) {
      const asistenciasPersonal = personalAsistencias[i].asistencia;
      if (somePersonalNoAsist) break;
      somePersonalNoAsist =
        !asistenciasPersonal?.length || asistenciasPersonal.length <= 2;
    }
    return somePersonalNoAsist
      ? obtenerDiasAnterioresYPosteriores()
      : [
          { day: currentDay, fecha: getCurrentDate(), pos: 'C' },
          ...obtenerDiasPosteriores(),
        ];
  }, [personalAsistencias, currentDay]);

  const novedadesAsistencia = () => {
    navigate(MODULOS_RESPONSABLE.NOVEDADES_PENDIENTES);
  };

  const listPersonalAsistencias = async () => {
    try {
      const { records } = await getPersonalAsistencias();
      setPersonalAsistencias(records || personalAsistencias || []);
    } catch (error) {
      handlePopUpToast(error?.message, 'error');
    }
  };

  const handleCheckCrearAsistencia = useCallback(async (personal) => {
    try {
      const { idPersonal, numDay, fecha } = personal;
      const data = {
        id_personal: idPersonal,
        numDiaAsis: numDay,
        fechaAsistencia: fecha,
        asistio: true,
        activo: true,
      };
      const { message } = await postAsistenciaCreate(data);
      await listPersonalAsistencias();
      handlePopUpToast(message);
    } catch (error) {
      handlePopUpToast(error?.message, 'error');
    } finally {
      updateNotifications(layout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNovedadAsistenciaModal = (data = null) => {
    setDataModals((prev) => ({
      ...prev,
      novedad: data?.novedad,
      personal: data?.personal,
    }));
    setModalShow(!data ? null : 'novedad');
  };

  const handleAfterSubmitNovedadForm = async () => {
    try {
      await listPersonalAsistencias();
      handleNovedadAsistenciaModal(null);
    } catch (error) {
      handlePopUpToast(error?.message, 'error');
    } finally {
      updateNotifications(layout);
    }
  };

  const headerButtons = [
    {
      id: 1,
      name: 'Novedades Pendientes',
      handleClick: novedadesAsistencia,
      color: layoutColors?.primary,
      disabled: false,
    },
  ];

  const headerTable = () => {
    const inits = [
      {
        name: 'Cédula',
        key: 'numDocumento',
      },
      {
        name: 'Nombres y Apellidos',
        key: 'nombres',
      },
      {
        name: 'Cargo',
        key: 'cargo',
      },
      {
        name: 'Área',
        key: 'area',
      },
    ];
    const formatDays = days?.map(({ day }) => ({
      key: day,
      name: day,
      special: day === currentDay,
    }));
    formatDays.forEach((elem) => inits.push(elem));
    return inits;
  };

  const renderDias = useCallback(
    (cb) =>
      days?.reduce((acc, { day, fecha, pos }) => {
        acc[day] = cb(day, fecha, pos);
        return acc;
      }, {}),
    [days]
  );
  // Lógica para generar los datos de la tabla
  const tableBodyData = useMemo(() => {
    return personalAsistencias?.map((personal) => {
      return {
        ...personal,
        nombres: `${personal?.nombre || ''} ${personal?.apellido || ''}`,
        cargo: personal?.cargo?.nombre || '',
        area: personal?.area?.nombre || '',
        ...renderDias((numDay, fecha, pos) => {
          const asistenciaData = personal?.asistencia?.find(
            (elem) => elem?.numDiaAsis === numDay
          );
          return (
            <Box
              key={personal?.idAsistencia}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              {(!asistenciaData || asistenciaData?.asistio === true) && (
                <CustomIconButton
                  icon={CheckCircleOutlineIcon}
                  color={layoutColors?.primary}
                  disabled={
                    asistenciaData
                      ? true
                      : numDay > currentDay && pos === 'L'
                        ? false
                        : numDay > currentDay && pos === 'R'
                          ? true
                          : pos === 'R'
                  }
                  onClick={async () => {
                    await handleCheckCrearAsistencia({
                      ...personal,
                      numDay,
                      fecha,
                    });
                  }}
                />
              )}
              {(!asistenciaData || asistenciaData?.asistio === false) && (
                <CustomIconButton
                  icon={HighlightOffIcon}
                  color={'error'}
                  disabled={
                    asistenciaData
                      ? true
                      : numDay > currentDay && pos === 'L'
                        ? false
                        : numDay > currentDay && pos === 'R'
                          ? true
                          : pos === 'R'
                  }
                  onClick={() => {
                    delete personal.area;
                    delete personal.asistencia;
                    handleNovedadAsistenciaModal({
                      personal: { ...personal, numDay, fecha },
                      novedad: null,
                    });
                  }}
                />
              )}
            </Box>
          );
        }),
      };
    });
  }, [
    personalAsistencias,
    layoutColors,
    currentDay,
    renderDias,
    handleCheckCrearAsistencia,
  ]);

  return {
    colors: layoutColors,
    modalShow,
    dataModals,
    table: {
      headerButtons,
      headerTable: headerTable(),
      tableBodyData: tableBodyData,
      resetTableOnChange: false,
      filter,
      setFilter,
    },
    listPersonalAsistencias,
    handleNovedadAsistenciaModal,
    handleAfterSubmitNovedadForm,
  };
};

export default useAsistenciaPage;
