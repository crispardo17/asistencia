import { Grid } from '@mui/material';
import TableActionComponent from '@/shared/Components/Tables/CustomTable';
import CustomModal from '@/shared/Components/Modal/CustomModal/index.jsx';
import FormDetalle from './Forms/AvalNovedadForm/FormDetalle.jsx';
import FiltroAvalNovedad from './FiltroAvalNovedad.jsx';
import useAvalNovedad from './useAvalNovedad.jsx';
import TitleText from '@/shared/Components/Others/TitleText.jsx';

const AvalNovedad = () => {
  const {
    colors,
    table,
    modalShow,
    dataModals,
    handleFilterSubmit,
    handleDetalleAvalModal,
  } = useAvalNovedad();

  return (
    <Grid
      container
      spacing={2}
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      <TitleText text="Aval Novedad" color={colors?.HxPrimary} />
      <Grid item xs={12}>
        <TableActionComponent {...table}>
          <FiltroAvalNovedad colors={colors} onSubmit={handleFilterSubmit} />
        </TableActionComponent>
      </Grid>
      <CustomModal
        open={modalShow === 'detalle'}
        title={'Detalle'}
        titleColor={colors?.HxPrimary}
        onClose={() => handleDetalleAvalModal(null)}
      >
        <FormDetalle data={dataModals.detalle} />
      </CustomModal>
    </Grid>
  );
};

export default AvalNovedad;
