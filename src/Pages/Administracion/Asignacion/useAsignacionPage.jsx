import { useState } from 'react';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { ROUTE_IDS } from '@/utils/vars/index.jsx';
import { useLoaderData, useRouteLoaderData } from 'react-router-dom';
import { getPersonalDep } from '@/core/services/administrador';

const initialStateDataModals = {
  editar: null,
};
const headerTable = [
  { key: 'id', name: 'ID' },
  { key: 'area', name: 'Área' },
  { key: 'departamento', name: 'Departamento' },
  { key: 'cc', name: 'CC' },
  { key: 'empresa', name: 'Empresa' },
  { key: 'supervisor', name: 'Supervisor' },
];

const formatAsignacionList = (asignaciones) => {
  return asignaciones?.map((asignacion) => ({
    ...asignacion,
    id: `${asignacion['idArea'] || ''}`,
    area: `${asignacion['nombre'] || ''}`,
    departamento: `${asignacion['departamento']['nombre'] || ''}`,
    cc: `${asignacion['centroCosto']['nombre'] || ''}`,
    empresa: `${asignacion['centroCosto']['empresa']['nombre'] || ''}`,
    supervisor: `${asignacion['liderProcesos'].length > 0 ? asignacion['liderProcesos'][0]['usuario']['nombre'] : 'Pendiente'}`,
  }));
};

const formatDepartamentosList = (departamentos) => {
  return departamentos?.map((departamento) => ({
    label: departamento['nombre'],
    value: departamento['idDepartamento'],
  }));
};

const useAsignacionPage = () => {
  const { colors } = useRouteLoaderData(ROUTE_IDS.ADMIN);
  const { departamentosData } = useLoaderData();

  const [currentDepartamento, setCurrentDepartamento] = useState();
  const [departamentoList, setdepartamentoList] = useState(
    formatDepartamentosList(departamentosData)
  );
  const [modalShow, setModalShow] = useState(null);
  const [dataModals, setDataModals] = useState(initialStateDataModals);

  const [asignacionList, setasignacionList] = useState([]);

  //filtros Departamentos
  const handleFilterDepSubmit = async (departamento) => {
    setCurrentDepartamento(departamento);
    const response = await getPersonalDep(departamento);
    if (response) {
      setasignacionList(formatAsignacionList(response));
    }
  };

  const handleAsignacionModal = (data = null) => {
    setDataModals((prev) => {
      return { ...prev, editar: data };
    });
    setModalShow(!data ? null : 'editar');
  };

  const headerButtons = [];

  const actionButtons = {
    title: 'Editar',
    buttons: ()=> [
      {
        id: 'editar',
        name: 'Editar',
        handleClick: (index) => {
          handleAsignacionModal(asignacionList[index]);
        },
        color: colors?.primary,
        icon: ModeEditIcon,
      },
    ],
  };

  return {
    colors,
    dataModals,
    modalShow,
    departamentoList,
    currentDepartamento,
    setdepartamentoList,
    handleFilterDepSubmit,
    handleAsignacionModal,
    table: {
      headerButtons,
      headerTable,
      actionButtons,
      tableBodyData: asignacionList,
      resetTableOnChange: true,
      inputFilter: true,
      pagination: true,
    },
  };
};

export default useAsignacionPage;
