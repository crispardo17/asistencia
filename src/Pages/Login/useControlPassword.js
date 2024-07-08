import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useTransition } from '@react-spring/web';
import useMainApp from '@/shared/Hooks/useMainApp';
import { get_info_user_login, login } from '@/core/services/login';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'Yup';
import { decryptValue, eliminarDuplicadosPorClaves } from '@/utils/functions';

const PERFILCODES = {
  RESPONSABLE: { str: 'RESPONSABLE_PROCESO', color: '#4caf50' },
  RRHH: { str: 'RRHH', color: '#ff9800' },
  ADMIN: { str: 'ADMIN', color: '#42a5f5' },
};

const useControlPassword = () => {
  const [showModalPass, setshowModalPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dataLogin, setDataLogin] = useState({
    empresas: null,
    perfiles: null,
  });
  const [index, set] = useState(0);
  // hooks
  const { handlePopUpToast } = useMainApp();
  const navigate = useNavigate();

  const initialValuesLoginForm = {
    usuario: '',
    contrasenna: '',
    perfil_id: '',
    perfil_code: '',
    empresa_id: '',
  };

  const validationSchemaLoginForm = Yup.lazy((values) =>
    Yup.object().shape({
      usuario: Yup.string().required('Usuario es requerido'),
      contrasenna: Yup.string().required('La contraseña es requerida'),
      perfil_id: Yup.string()
        .required('el perfil es requerido')
        .notOneOf(['', '0', '-1'], 'perfil invalido'),
      empresa_id:
        values.perfil_code === PERFILCODES.RESPONSABLE.str
          ? Yup.string().required('La empresa es requerida')
          : Yup.string().nullable().notRequired(),
    })
  );

  const showModalPassword = () => {
    setshowModalPassword(true);
  };

  const closeModalPassword = () => {
    setshowModalPassword(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleGetUsuarioData = async (usuario) => {
    try {
      const dataUserLogin = await get_info_user_login(usuario);
      const empresas =
        dataUserLogin?.liderProcesos?.map((elem) => elem?.empresa) || [];
      const perfiles =
        dataUserLogin?.perfilUsuarios?.map((elem) => elem?.perfil) || [];
      setDataLogin({
        empresas: eliminarDuplicadosPorClaves(empresas, ['idEmpresa']),
        perfiles,
      });
    } catch (error) {
      handlePopUpToast(`${error?.message}`, 'error');
    }
  };

  const handleSubmit = async (values) => {
    let lay,
      message = null;
    try {
      const dataSend = {
        ...values,
        empresa_id:
          values?.perfil_code != PERFILCODES.RESPONSABLE.str
            ? undefined
            : values?.empresa_id,
        perfil_code: undefined,
      };
      const { record, message: respMessage } = await login(dataSend);
      const tkn = record.tkn;
      await localStorage.setItem('tkn', tkn);
      const decryptedData = await decryptValue(tkn);
      const decodedData = jwtDecode(decryptedData);
      lay = decodedData.lay;
      message = respMessage;
    } catch (error) {
      handlePopUpToast(`${error?.message}`, 'error');
    } finally {
      !!lay && navigate(`/${lay}/dashboard`);
      !!message &&
        setTimeout(
          () =>
            handlePopUpToast(
              message,
              'success',
              PERFILCODES[values.perfil_code]?.color
            ),
          500
        );
    }
  };

  const forgetPassword = () => {
    console.log('Olvido su contraseña?');
  };

  const transitions = useTransition(index, {
    key: index,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 1000 },
    exitBeforeEnter: true,
  });

  return {
    initialValuesLoginForm,
    dataLogin,
    showPassword,
    PERFILCODES,
    handleClickShowPassword,
    handleMouseDownPassword,
    handleSubmit,
    forgetPassword,
    transitions,
    set,
    setDataLogin,
    showModalPassword,
    showModalPass,
    closeModalPassword,
    validationSchemaLoginForm,
    handleGetUsuarioData,
  };
};

export default useControlPassword;
