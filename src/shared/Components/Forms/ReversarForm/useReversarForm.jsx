import {
  putGestionNovedad,
  postCrearReintegro,
} from '@/core/services/rrhh/index.js';
import useMainApp from '@/shared/Hooks/useMainApp';
import { TIPOS_GESTION_NOVEDAD } from '@/utils/vars/index.jsx';
import * as Yup from 'Yup';

const useReversarForm = ({ tipo, idReporteNovedad, idPersonal }) => {
  const { handlePopUpToast } = useMainApp();
  const tipoCierre = tipo === TIPOS_GESTION_NOVEDAD.CIERRE;
  const tipoReintegro = tipo === TIPOS_GESTION_NOVEDAD.REINTEGRO;
  const initialValuesReversarForm = {
    id_motivo: tipoCierre ? undefined : '',
    idReporteNovedad: idReporteNovedad,
    observacion: '',
    id_personal: tipoReintegro ? idPersonal : undefined,
  };

  const validationSchema = Yup.object().shape({
    id_motivo: tipoCierre
      ? Yup.string().notRequired()
      : Yup.string().required('La novedad es requerida'),
    observacion: Yup.string().required('La observación es requerida'),
    idReporteNovedad: Yup.string().required('La novedad es requerida'),
  });

  const handleSubmit = async (values, resetForm) => {
    const dataSend = {
      id_motivo: values?.id_motivo,
      idReporteNovedad: values.idReporteNovedad,
      observacion: values.observacion,
      id_personal: values?.id_personal,
    };
    try {
      let response;
      if (tipoReintegro) {
        response = await postCrearReintegro(dataSend);
      } else {
        response = await putGestionNovedad(tipo, dataSend);
      }
      resetForm();
      handlePopUpToast(response?.message);
      return true;
    } catch (error) {
      console.error('Error al enviar datos:', error.message);
      return false;
    }
  };

  return {
    initialValuesReversarForm,
    validationSchema,
    handleSubmit,
  };
};

export default useReversarForm;
