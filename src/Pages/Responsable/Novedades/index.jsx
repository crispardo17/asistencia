import TableActionComponent from '@/shared/Components/Tables/CustomTable';
import useNovedadesPage from './useNovedadesPage.jsx';
import { Grid } from '@mui/material';
import CustomModal from '@/shared/Components/Modal/CustomModal/index.jsx';
import NovedadForm from '@/shared/Components/Forms/NovedadForm/NovedadForm.jsx';
import { json } from 'react-router-dom';
import { throwErrorPage } from '@/utils/functions/index.js';
import { getNovedadList } from '@/core/services/index.js';
import { TIPOS_NOVEDAD } from '@/utils/vars/index.jsx';
import TitleText from '@/shared/Components/Others/TitleText.jsx';

export const loader = async () => {
  try {
    const [novedadesData] = await Promise.all([
      getNovedadList(TIPOS_NOVEDAD.PENDIENTES),
    ]);
    return json({ novedadesData });
  } catch (error) {
    throwErrorPage({
      status: 401,
    });
  }
};

export const NovedadesPage = () => {
  const {
    colors,
    table,
    modalShow,
    dataModals,
    handleNovedadModal,
    afterSubmitNovedad,
  } = useNovedadesPage();
  return (
    <Grid
      container
      spacing={2}
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      <TitleText text="Novedades" color={colors?.HxPrimary} />
      <Grid item xs={12}>
        <TableActionComponent {...table} />
      </Grid>
      <CustomModal
        open={modalShow === 'novedad'}
        title={'Novedad'}
        titleColor={colors.HxPrimary}
        onClose={() => handleNovedadModal(null)}
      >
        <NovedadForm
          afterSubmit={afterSubmitNovedad}
          novedad={dataModals.novedad}
          personal={dataModals.personal}
          colors={colors}
        />
      </CustomModal>
    </Grid>
  );
};

export default NovedadesPage;
