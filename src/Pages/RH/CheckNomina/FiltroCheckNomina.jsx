import { Form, Formik } from 'formik';
import { Grid, Tooltip } from '@mui/material';
import * as Yup from 'Yup';
import CustomButton from '@/shared/Components/Inputs/CustomButton';
import {
  convertirFechaAHoraColombiana,
  getCurrentDate,
} from '@/utils/functions';
import CustomDateField from '@/shared/Components/Inputs/CustomDatePicker/index.jsx';
const titleTootip =
  'Recuerde que las novedades en este módulo se filtran sobre la fecha de inicio de las mismas.';

const FiltroCheckNomina = ({ onSubmit, colors = {} }) => {
  return (
    <Formik
      enableReinitialize
      initialValues={{
        fechaInicio: convertirFechaAHoraColombiana(
          getCurrentDate().toISOString(),
          'yyyy-MM-dd'
        ),
        fechaFin: convertirFechaAHoraColombiana(
          getCurrentDate().toISOString(),
          'yyyy-MM-dd'
        ),
      }}
      validationSchema={Yup.object().shape({})}
      onSubmit={async (values) => {
        await onSubmit(values);
      }}
    >
      {({ values, isSubmitting }) => {
        return (
          <Form>
            <Grid
              container
              spacing={2}
              sx={{ marginTop: 2, margin: '0 auto', marginBottom: 1 }}
            >
              <Grid item xs={12} md={3}>
                <CustomDateField
                  label={'Fecha Inicio'}
                  value={values.fechaInicio}
                  name={'fechaInicio'}
                  format="YYYY-MM-DD"
                  views={['year', 'month', 'day']}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomDateField
                  label={'Fecha Final'}
                  value={values.fechaFin}
                  name={'fechaFin'}
                  format="YYYY-MM-DD"
                  views={['year', 'month', 'day']}
                />
              </Grid>
              <Tooltip title={titleTootip} size="lg">
                <Grid
                  item
                  xs={12}
                  md={3}
                  sx={{ display: 'flex', justifyContent: 'flex-start' }}
                >
                  <CustomButton
                    submitting={isSubmitting}
                    disabled={false}
                    type={'submit'}
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      height: 56,
                      margin: '0 auto',
                      background: colors?.HxPrimary,
                    }}
                  >
                    Buscar
                  </CustomButton>
                </Grid>
              </Tooltip>
              <Grid item xs={12} md={3}></Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FiltroCheckNomina;
