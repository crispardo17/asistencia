import { Grid } from '@mui/material';
import TableActionComponent from '@/shared/Components/Tables/CustomTable';
import CustomModal from '@/shared/Components/Modal/CustomModal/index.jsx';
import useAvalNovedad from './useCrearNovedad.jsx';
import NovedadForm from '@/shared/Components/Forms/NovedadForm/NovedadForm.jsx';
import FiltroCrearNovedad from './FiltroCrearNovedad.jsx';

const CrearNovedad = () => {
  const {
    colors,
    table,
    modalShow,
    dataModals,
    currentValuesFilter,
    handleFilterSubmit,
    handleGenerarNovedadModal,
    setCurrentValuesFilter,
  } = useAvalNovedad();

  return (
    <Grid
      container
      spacing={2}
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      <Grid item xs={12}>
        <TableActionComponent {...table}>
          <FiltroCrearNovedad
            colors={colors}
            onSubmit={async (values) => {
              await handleFilterSubmit(values);
              setCurrentValuesFilter(values);
            }}
          />
        </TableActionComponent>
      </Grid>
      <CustomModal
        open={modalShow === 'novedad'}
        title={'Edición novedad'}
        titleColor={colors?.HxPrimary}
        onClose={() => handleGenerarNovedadModal(null)}
        minHeight="none"
        height="60vh"
      >
        <NovedadForm
          novedad={dataModals.novedad}
          personal={dataModals.personal}
          afterSubmit={async () =>
            await handleFilterSubmit(currentValuesFilter)
          }
          colors={colors}
        />
      </CustomModal>
    </Grid>
  );
};

export default CrearNovedad;
