import {
  getNotificationsByLayoutType,
  leerNotificacion,
} from '@/core/services';
import React, { useState } from 'react';

const initialState = {
  notificacionesList: [],
  // eslint-disable-next-line no-unused-vars
  handleListNotificacions: (pageLayout) => {},
  // eslint-disable-next-line no-unused-vars
  handleLeerNotificacion: (idNotificacion) => {},
};

const userContext = React.createContext(initialState);

export const UserProvider = ({ children }) => {
  // states
  const [notificacionesList, setNotificacionesList] = useState([]);

  const handleListNotificacions = async (pageLayout) => {
    try {
      const { records } = await getNotificationsByLayoutType(pageLayout);
      setNotificacionesList(records);
    } catch (error) {
      setNotificacionesList([]);
    }
  };

  const handleLeerNotificacion = (idNotificacion) => {
    try {
      leerNotificacion(idNotificacion);
    } catch (error) {
      console.warn('Error read notification');
    }
  };

  return (
    <userContext.Provider
      value={{
        notificacionesList,
        handleListNotificacions,
        handleLeerNotificacion,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export const useUserContext = () => {
  const context = React.useContext(userContext);
  if (context === undefined)
    throw new Error('useUserContext must be used within a provider');
  return context;
};
