import { Form, Formik, ErrorMessage } from 'formik';
import { Grid, Tooltip } from '@mui/material';
import * as Yup from 'Yup';
import CustomButton from '@/shared/Components/Inputs/CustomButton';
import { format } from 'date-fns';
import { getFechaColombia } from '@/utils/functions';
import CustomDateField from '@/shared/Components/Inputs/CustomDatePicker/index.jsx';

const titleTootip =
  'Recuerde que las novedades en este módulo se filtran sobre la fecha en que son reportadas.';
const FiltroAvalNovedad = ({ onSubmit, colors = {} }) => {
  return (
    <Formik
      enableReinitialize
      initialValues={{
        fechaInicio: format(getFechaColombia(), 'yyyy-MM-dd'),
        fechaFin: format(getFechaColombia(), 'yyyy-MM-dd'),
      }}
      validationSchema={Yup.object().shape({
        fechaInicio: Yup.date().required('Fecha de inicio es requerida'),
        fechaFin: Yup.date().required('Fecha de fin es requerida'),
      })}
      onSubmit={async (values) => {
        await onSubmit(values.fechaInicio, values.fechaFin);
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
                <div className="error1">
                  <ErrorMessage name="fechaInicio" />
                </div>
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomDateField
                  label={'Fecha Final'}
                  value={values.fechaFin}
                  name={'fechaFin'}
                  format="YYYY-MM-DD"
                  views={['year', 'month', 'day']}
                />
                <div className="error1">
                  <ErrorMessage name="fechaFin" />
                </div>
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

export default FiltroAvalNovedad;
