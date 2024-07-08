import * as Yup from 'Yup';
const useFormDetalle = () => {
  const initialValuesDetalleForm = {
    fecha: '',
    nombre: '',
    tipoNovedad: '',
    observacion: '',
    fechaInicioNovedad: '',
    fechaFinNovedad: '',
  };

  const validationSchema = Yup.object().shape({
    fecha: Yup.date().required('La fecha es requerida'),
    nombre: Yup.string().required('El nombre es obligatorio'),
    tipoNovedad: Yup.string()
      .notOneOf(['-1', ''], 'El Tipo de Novedad es requerido')
      .required('El Tipo de Novedad es requerido'),
    observacion: Yup.string().required('El nombre es obligatorio'),
    fechaInicioNovedad: Yup.date().required('La fecha es requerida'),
    fechaFinNovedad: Yup.date().required('La fecha es requerida'),
  });
  return {
    initialValuesDetalleForm,
    validationSchema,
  };
};

export default useFormDetalle;
