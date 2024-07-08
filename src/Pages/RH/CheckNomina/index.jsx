import { Grid } from '@mui/material';
import TableActionComponent from '@/shared/Components/Tables/CustomTable';
import CustomModal from '@/shared/Components/Modal/CustomModal/index.jsx';
import useCheckNomina from './useCheckNomina.jsx';
import FiltroCheckNomina from './FiltroCheckNomina.jsx';
import FormDetalle from './Forms/DetalleCheckNomina/FormDetalle.jsx';
import TitleText from '@/shared/Components/Others/TitleText.jsx';
const CheckNomina = () => {
  const {
    colors,
    table,
    modalShow,
    dataModals,
    datafilters,
    handleDetalleModal,
    handleCheckNominaSubmit,
    setDatafilters,
  } = useCheckNomina();

  return (
    <Grid
      container
      spacing={2}
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      <TitleText text="Check Nómina" color={colors?.HxPrimary} />
      <Grid item xs={12}>
        <TableActionComponent {...table}>
          <FiltroCheckNomina
            colors={colors}
            onSubmit={async (values) => {
              await handleCheckNominaSubmit(values);
              setDatafilters(values);
            }}
          />
        </TableActionComponent>
        <CustomModal
          open={modalShow === 'detalle'}
          title={'Detalle'}
          titleColor={colors?.HxPrimary}
          onClose={() => handleDetalleModal(null)}
          minHeight="none"
          height="30vh"
          minWidth='none'
          width='30vw'
        >
          <FormDetalle
            data={dataModals.detalle}
            afterSubmit={async () => await handleCheckNominaSubmit(datafilters)}
          />
        </CustomModal>
      </Grid>
    </Grid>
  );
};

export default CheckNomina;
