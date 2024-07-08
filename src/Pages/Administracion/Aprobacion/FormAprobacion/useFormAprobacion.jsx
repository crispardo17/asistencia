import * as Yup from 'Yup';
import { useMemo } from 'react';
const useModalAprobacion = (data) => {
  const initialValuesAprobacionForm = {
    aprueba: -1,
    tipoNovedad: -1,
    observacion: '',
  };

  const adjuntoFileNovedad = useMemo(() => {
    const { novedad } = data;
    return !!novedad?.datos?.adjuntoNovedad;
  }, [data]);

  const validationSchema = Yup.object().shape({
    tipoNovedad: Yup.string()
      .notOneOf(['-1', ''], 'El tipo de Novedad es requerido')
      .required('El tipo de Novedad es requerido'),
    aprueba: Yup.string()
      .notOneOf(['-1', ''], 'La aprovacion es requerido')
      .required('La aprovacion  es requerido'),
    observacion: Yup.string().required('Las notas son obligatorias'),
  });
  return {
    initialValuesAprobacionForm,
    validationSchema,
    adjuntoFileNovedad,
  };
};

export default useModalAprobacion;
