import { Grid } from '@mui/material';
import useAsignacionPage from './useAsignacionPage.jsx';
import TableActionComponent from '@/shared/Components/Tables/CustomTable/index.jsx';
import FiltroAsignacion from './FiltroAsignacion.jsx';
import CustomModal from '@/shared/Components/Modal/CustomModal/index.jsx';
import FormAsignacion from './FormAsignacion/FormAsignacion.jsx';
import { getDepartamentosList } from '@/core/services/administrador/index.js';
import { json } from 'react-router-dom';
import { throwErrorPage } from '@/utils/functions/index.js';
import TitleText from '@/shared/Components/Others/TitleText.jsx';

export const loader = async () => {
  try {
    const [departamentosData] = await Promise.all([getDepartamentosList()]);
    return json({ departamentosData });
  } catch (error) {
    throwErrorPage({
      status: 401,
      message: error,
    });
  }
};

const AsignacionPage = () => {
  const {
    table,
    currentDepartamento,
    departamentoList,
    modalShow,
    dataModals,
    colors,
    handleFilterDepSubmit,
    handleAsignacionModal,
  } = useAsignacionPage();

  return (
    <Grid
      container
      spacing={2}
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      <TitleText text="Asignación de responsables" color={colors?.HxPrimary} />
      <Grid item xs={12}>
        <FiltroAsignacion
          colors={colors}
          departamentoList={departamentoList}
          onSubmit={handleFilterDepSubmit}
        />
        {!!table.tableBodyData?.length && <TableActionComponent {...table} />}
      </Grid>
      <CustomModal
        open={modalShow === 'editar'}
        title={'Editar'}
        titleColor={colors?.HxPrimary}
        onClose={() => handleAsignacionModal(null)}
        minHeight="50vh"
        minWidth="90vh"

      >
        <FormAsignacion
          data={dataModals.editar}
          afterSubmit={async () => {
            handleAsignacionModal(null);
            await handleFilterDepSubmit(currentDepartamento);
          }}
        />
      </CustomModal>
    </Grid>
  );
};

export default AsignacionPage;
