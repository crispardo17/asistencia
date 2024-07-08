import { Grid } from '@mui/material';
import { Form, Formik } from 'formik';
import useFormDetalle from './useFormDetalleAval.jsx';
import CustomTextField from '@/shared/Components/Inputs/CustomTextfield/index.jsx';

const FormDetalle = ({ data }) => {
  const { handleSubmit, initialValuesDetalleAvalForm, validationSchema } =
    useFormDetalle({});
  return (
    <Formik
      initialValues={initialValuesDetalleAvalForm}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        await handleSubmit(values, resetForm);
      }}
    >
      {() => {
        return (
          <Form>
            <Grid container spacing={2} sx={{ marginTop: '10px' }}>
              <Grid item xs={12}>
                <CustomTextField
                  variant="outlined"
                  label="Novedad"
                  value={data['tipoNovedad.nombre']}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  variant="outlined"
                  label="Estado"
                  value={data['estado.nombre']}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  variant="outlined"
                  label="Motivo"
                  value={data['observacionNovedad']}
                  fullWidth
                  disabled
                />
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FormDetalle;
