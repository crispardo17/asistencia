import {
  getUsuarios,
  patchEnableCambiarPassUser,
} from '@/core/services/administrador';
import useMainApp from '@/shared/Hooks/useMainApp';
import { ROUTE_IDS } from '@/utils/vars';
import MailLockIcon from '@mui/icons-material/MailLock';
import { useState } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

const headerTable = [
  { key: 'idUsuario', name: 'ID' },
  { key: 'numDocumento', name: 'Cédula' },
  { key: 'nombres', name: 'Nombre Y Apellido' },
  { key: 'usuario', name: 'Usuario' },
];

const formatData = (usuarios) => {
  return usuarios?.map((user) => ({
    ...user,
    nombres: `${user?.nombre || ''} ${user?.apellido || ''}`,
  }));
};
const useControlHabilitacion = () => {
  // hooks
  const { usuarios } = useRouteLoaderData(ROUTE_IDS.ADMIN_USUARIOS);
  const { handlePopUpToast, colors } = useMainApp();

  // states
  const [usuariosList, setUsuariosList] = useState(formatData(usuarios));

  const handleListUsuarios = async () => {
    const { records } = await getUsuarios();
    setUsuariosList(formatData(records));
  };

  const handleClickCambioContrasennaEnable = async (idUsuario) => {
    try {
      if (!idUsuario) throw new Error('id Usuario es rrquerido');
      const request = await patchEnableCambiarPassUser(idUsuario);
      request?.message && handlePopUpToast(request.message);
      await handleListUsuarios();
    } catch (error) {
      handlePopUpToast(error.message, 'warn');
    }
  };
  const actionButtons = {
    title: 'Acciones',
    buttons: () => [
      {
        id: 1,
        name: 'Enviar Correo con contraseña provisional',
        handleClick: async (index) =>
          await handleClickCambioContrasennaEnable(
            usuariosList[index]?.idUsuario
          ),
        icon: MailLockIcon,
        color: colors?.primary,
      },
    ],
  };

  return {
    colors,
    handleListUsuarios,
    table: {
      headerButtons: [],
      headerTable,
      actionButtons,
      tableBodyData: usuariosList,
      pagination: true,
      inputFilter: true,
    },
  };
};

export default useControlHabilitacion;
