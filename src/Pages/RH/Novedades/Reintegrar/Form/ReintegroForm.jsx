import { Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import CustomObservation from '@/shared/Components/Inputs/CustomObservation/index.jsx';
import useReintegroForm from './useReintegroForm';
import TableActionComponent from '@/shared/Components/Tables/CustomTable/index.jsx';
import CustomModal from '@/shared/Components/Modal/CustomModal/index.jsx';
import DetalleForm from '@/shared/Components/Forms/DetalleForm/DetalleForm.jsx';

const ReintegroForm = ({ data }) => {
  const { table, modalShow, dataModals, colors, handleDetalleModal } =
    useReintegroForm({ data });
  return (
    <Formik validateOnChange validateOnBlur>
      {() => {
        return (
          <Form>
            <Grid container spacing={2} sx={{ marginTop: '10px' }}>
              <Grid item xs={6}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Nombre:
                  <Typography>
                    {`${data['asistencium.personal.nombre'] || ''} ${data['asistencium.personal.apellido'] || ''}`}
                  </Typography>
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Jefe:
                  <Typography>{`${data['generado']}`}</Typography>
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Generado Por:
                  <Typography>{`${data['generado']}`}</Typography>
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Fecha:
                  <Typography>{`${data['fechaReporte']}`}</Typography>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CustomObservation
                  label="Motivo"
                  name="Motivo"
                  type="text"
                  value={data['observacionNovedad']}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TableActionComponent {...table}></TableActionComponent>
                <CustomModal
                  open={modalShow === 'detalle'}
                  title={'Detalle:'}
                  titleColor={colors?.HxPrimary}
                  onClose={() => handleDetalleModal(null)}
                  minHeight="none"
                  height="50vh"
                >
                  <DetalleForm data={dataModals.detalle} modulo="reintegro" />
                </CustomModal>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ReintegroForm;
