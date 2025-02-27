import * as Yup from 'Yup';
import { isBefore } from 'date-fns';
import { useRouteLoaderData } from 'react-router-dom';
import {
  postCrearNovedad,
  postUploadAdjuntoNovedad,
  putNovedad,
} from '@/core/services';
import useMainApp from '@/shared/Hooks/useMainApp';
import { getCurrentDate } from '@/utils/functions';
import { ROUTE_IDS } from '@/utils/vars';
const useNovedadForm = ({ novedad, personal }) => {
  // hooks
  const { tipoNovedadesList } = useRouteLoaderData(ROUTE_IDS.USER);
  const { handlePopUpToast } = useMainApp();
  const initialValuesNovedadForm = {
    // asist data
    id_personal: personal?.idPersonal,
    fechaAsistencia: personal?.fecha || novedad?.asistencium?.fechaAsistencia,
    numDiaAsis: personal.numDay,
    observacionReporte: personal?.observacionReporte || undefined,
    // novedad data
    idReporteNovedad: novedad?.idReporteNovedad || null,
    id_tipoNovedad: novedad?.id_tipoNovedad || '-1',
    observacionNovedad: novedad?.observacionNovedad || '',
    fechaInicioNovedad: novedad?.fechaInicioNovedad
      ? novedad.fechaInicioNovedad
      : personal?.fecha,
    fechaFinNovedad: novedad?.fechaFinNovedad
      ? novedad.fechaFinNovedad
      : getCurrentDate().toISOString(),
    adjuntoNovedad: novedad?.adjuntoNovedad || false,
    fechaFinIsMenorToFechaInicio: null,
    adjuntos: [],
  };

  const validationSchema = Yup.lazy((values) => {
    const fechaFinIsMenorToFechaInicio = isBefore(
      values.fechaFinNovedad,
      values.fechaInicioNovedad
    );
    return Yup.object().shape({
      id_tipoNovedad: Yup.string()
        .notOneOf(['-1', ''], 'El Tipo de Novedad es requerido')
        .required('El Tipo de Novedad es requerido'),
      observacionNovedad: Yup.string().required('La observación es requerida'),
      fechaInicioNovedad: Yup.date().required(
        'La fecha de inicio es requerida'
      ),
      fechaFinNovedad: Yup.date().required('La fecha de fin es requerida'),
      fechaFinIsMenorToFechaInicio: fechaFinIsMenorToFechaInicio
        ? Yup.bool()
            .required('La fecha de fin no puede ser menor a la de inicio')
            .notOneOf(
              [true],
              'La fecha de fin no puede ser menor a la de inicio'
            )
        : Yup.bool().notRequired().nullable(),
    });
  });

  const handleGetMenorFechaFin = (fechaInicio, fechaFin) =>
    isBefore(fechaFin, fechaInicio);

  const handleUpArchivos = async (files, idModel) => {
    try {
      await postUploadAdjuntoNovedad({
        files,
        idReporteNovedad: idModel,
        notif: handlePopUpToast,
      });
    } catch (error) {
      handlePopUpToast(error?.message);
    }
  };

  const crearNovedad = async (values) => {
    const { message, record } = await postCrearNovedad({
      ...values,
      adjuntos: undefined,
    });
    message && handlePopUpToast(message);
    return String(record?.idReporteNovedad);
  };

  const actualizarNovedad = async (values) => {
    const { message, record } = await putNovedad(values?.idReporteNovedad, {
      ...values,
      adjuntos: undefined,
    });
    message && handlePopUpToast(message);
    return String(record?.idReporteNovedad);
  };

  const handleSubmitNovedadForm = async (values) => {
    try {
      let idReporteNovedad = null;
      idReporteNovedad = !values?.idReporteNovedad
        ? await crearNovedad(values)
        : await actualizarNovedad(values);
      const files = values?.adjuntos;
      if (idReporteNovedad && files?.length) {
        const resp = await postUploadAdjuntoNovedad({
          files,
          idReporteNovedad,
          notif: handlePopUpToast,
        });
        return resp.every((file) => !!file);
      }
      return true;
    } catch (error) {
      handlePopUpToast(`Error creando novedad... ${error?.message}`, 'error');
      return false;
    }
  };

  return {
    initialValuesNovedadForm,
    validationSchema,
    tipoNovedadesList,
    handleSubmitNovedadForm,
    handleGetMenorFechaFin,
    handleUpArchivos,
  };
};

export default useNovedadForm;
