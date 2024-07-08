import TableActionComponent from '@/shared/Components/Tables/CustomTable';
import useAsistenciaPage from './useAsistenciaPage.jsx';
import { Grid } from '@mui/material';
import CustomModal from '@/shared/Components/Modal/CustomModal/index.jsx';
import NovedadForm from '@/shared/Components/Forms/NovedadForm/NovedadForm.jsx';
import { throwErrorPage } from '@/utils/functions/index.js';
import { getPersonalAsistencias } from '@/core/services/responsable/index.js';
import { json } from 'react-router-dom';
import TitleText from '@/shared/Components/Others/TitleText.jsx';

export const loader = async () => {
  try {
    const [{ records: personalAsistencias }] = await Promise.all([
      getPersonalAsistencias(),
    ]);
    return json({ personalAsistencias });
  } catch (error) {
    throwErrorPage({
      status: 401,
    });
  }
};
export const AsistenciaPage = () => {
  const {
    colors,
    table,
    modalShow,
    dataModals,
    handleNovedadAsistenciaModal,
    handleAfterSubmitNovedadForm,
  } = useAsistenciaPage();
  return (
    <Grid
      container
      spacing={2}
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      <TitleText text="Asistencia" color={colors?.HxPrimary} />
      <Grid item xs={12}>
        <TableActionComponent {...table} />
      </Grid>
      <CustomModal
        open={modalShow === 'novedad'}
        title={'Novedad Asistencia'}
        titleColor={colors?.HxPrimary}
        onClose={() => handleNovedadAsistenciaModal(null)}
      >
        <NovedadForm
          afterSubmit={handleAfterSubmitNovedadForm}
          novedad={dataModals.novedad}
          personal={dataModals.personal}
          colors={colors}
        />
      </CustomModal>
    </Grid>
  );
};

export default AsistenciaPage;
