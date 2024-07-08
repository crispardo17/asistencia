import TableActionComponent from '@/shared/Components/Tables/CustomTable';
import { Grid } from '@mui/material';
import FiltroAprobacion from './FiltroAprobacion';
import useAprobacionPage from './useAprobacionPage';
import CustomModal from '@/shared/Components/Modal/CustomModal/index.jsx';
import FormAprobacion from './FormAprobacion/FormAprobacion';
import NovedadForm from '@/shared/Components/Forms/NovedadForm/NovedadForm.jsx';
import { json } from 'react-router-dom';
import { throwErrorPage } from '@/utils/functions';
import { getTiposNovedades } from '@/core/services';
import TitleText from '@/shared/Components/Others/TitleText';

export const loader = async () => {
  try {
    const [{ records: tiposNovedad }] = await Promise.all([
      getTiposNovedades(),
    ]);
    return json({ tiposNovedad });
  } catch (error) {
    throwErrorPage({
      status: 401,
      message: error,
    });
  }
};

const AprobacionPage = () => {
  const {
    colors,
    table,
    superVisorList,
    modalShow,
    dataModals,
    setCurrenValuesFilter,
    handleDetalleModal,
    handleAprobacionModal,
    handleFilterFechaSubmit,
    handleSubmit,
  } = useAprobacionPage();

  return (
    <Grid
      container
      spacing={2}
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      <TitleText text="Aprobación Novedad" color={colors?.HxPrimary} />
      <Grid item xs={12}>
        <TableActionComponent {...table}>
          <FiltroAprobacion
            colors={colors}
            supervisoresList={superVisorList}
            onSubmit={async (values) => {
              await handleFilterFechaSubmit(values);
              setCurrenValuesFilter(values);
            }}
          />
        </TableActionComponent>
      </Grid>
      <CustomModal
        open={modalShow === 'detalle'}
        title={'Detalle'}
        titleColor={colors?.HxPrimary}
        onClose={() => handleDetalleModal(null)}
      >
        <NovedadForm {...{ ...dataModals.detalle, colors, onlyRead: true }} />
      </CustomModal>
      <CustomModal
        open={modalShow === 'aprobacion'}
        title={'Aprobación Novedad'}
        titleColor={colors?.HxPrimary}
        onClose={() => handleAprobacionModal(null)}
      >
        <FormAprobacion data={dataModals} onSubmit={handleSubmit} />
      </CustomModal>
    </Grid>
  );
};

export default AprobacionPage;
