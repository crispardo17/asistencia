import * as Yup from 'Yup';
import { useEffect, useMemo, useState } from 'react';
import useMainApp from '@/shared/Hooks/useMainApp';
import {
  getListDepartamentosSupervisor,
  postAsignarResponable,
} from '@/core/services/administrador';

const useFormAsignacion = ({ data }) => {
  const [personalsByDepto, setPersonalsByDepto] = useState([]);
  const [loadedData, setLoadedData] = useState(false);

  const supervisorActual = useMemo(
    () => data?.liderProcesos?.find((lid) => !!lid.activo)?.usuario,
    [data]
  );

  const { handlePopUpToast, colors } = useMainApp();

  const initialValuesAsignacionForm = {
    departamento: data?.departamento || '-1',
    centroCosto: data?.centroCosto?.nombre || '',
    idPersonal: '-1',
    correo: '',
    id_empresa: data?.centroCosto?.id_empresa,
    id_area: data?.idArea,
  };

  const validationSchema = Yup.object().shape({
    correo: Yup.string()
      .email('El correo es requerido')
      .not([''])
      .trim('incorrecto')
      .required('El correo es requerido'),
    idPersonal: Yup.string()
      .notOneOf(['-1', ''], 'El supervisor es requerido')
      .required('El supervisor es requerido'),
  });

  const listarpersonalByDepto = async (idDepartamento) => {
    try {
      setLoadedData(false);
      const { records } = await getListDepartamentosSupervisor(idDepartamento);
      setPersonalsByDepto(
        records.filter(
          (pers) =>
            pers?.idPersonal !== supervisorActual?.id_personalBase ||
            pers?.numDocumento !== supervisorActual?.numDocumento
        )
      );
      setLoadedData(true);
    } catch (error) {
      handlePopUpToast(error.message, 'error');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const { message } = await postAsignarResponable(values.idPersonal, {
        ...values,
      });
      if (message) {
        handlePopUpToast(message);
        return true;
      }
      return false;
    } catch (error) {
      handlePopUpToast(error.message, 'error');
    }
  };

  useEffect(() => {
    const handlerListar = setTimeout(() => {
      listarpersonalByDepto(data.id_departamento);
    }, 500);
    return () => clearTimeout(handlerListar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.id_departamento]);

  return {
    initialValuesAsignacionForm,
    validationSchema,
    personalsByDepto,
    supervisorActual,
    loadedData,
    colors,
    handleSubmit,
  };
};

export default useFormAsignacion;
