import { Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import useFormDetalle from './useFormDetalle.jsx';


const FormDetalle = ({ data }) => {
  const { handleSubmit, initialValuesDetallesForm, validationSchema } =
    useFormDetalle({});
  return (
    <Formik
      validateOnMount
      validateOnChange
      validateOnBlur
      initialValues={initialValuesDetallesForm}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        await handleSubmit(values, resetForm);
      }}
    >
      {() => (
          <Form>
            <Grid container spacing={2} sx={{ marginTop: '10px' }}>
              <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Fecha:
                <Typography>
                  {' '}
                  {`${data['fechaInicioNovedad']}`}
                </Typography>
              </Typography>
              </Grid>
              <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Nombre:
                <Typography>
                  {' '}
                  {`${data['asistencium']['personal']['nombre'] || ''} ${data['asistencium']['personal']['apellido'] || ''}`}
                </Typography>
              </Typography>
              </Grid>
            </Grid>
          </Form>
        )
      }
    </Formik>
  );
};

export default FormDetalle;
