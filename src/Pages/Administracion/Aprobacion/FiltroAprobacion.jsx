import { Form, Formik } from 'formik';
import { Grid, Tooltip } from '@mui/material';
import * as Yup from 'Yup';
import CustomButton from '@/shared/Components/Inputs/CustomButton';
import { getCurrentDate } from '@/utils/functions';
import { format, subMonths } from 'date-fns';
import CustomDateField from '@/shared/Components/Inputs/CustomDatePicker/index.jsx';
const titleTootipAprobacion =
  'Recuerde que las novedades en este módulo se filtran sobre la fecha en que son reportadas.';

const FiltroAprobacion = ({ onSubmit, colors = {} }) => {
  return (
    <Formik
      enableReinitialize
      initialValues={{
        fechaInicio: format(subMonths(getCurrentDate(), 1), 'yyyy-MM-dd'),
        fechaFin: format(getCurrentDate().toDateString(), 'yyyy-MM-dd'),
      }}
      validationSchema={Yup.object().shape({})}
      onSubmit={onSubmit}
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
              <Tooltip title={titleTootipAprobacion} size="lg">
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
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FiltroAprobacion;
