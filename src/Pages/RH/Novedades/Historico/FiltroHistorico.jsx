import { Form, Formik, ErrorMessage } from 'formik';
import { Grid } from '@mui/material';
import * as Yup from 'Yup';
import CustomButton from '@/shared/Components/Inputs/CustomButton';
import CustomTextField from '@/shared/Components/Inputs/CustomTextfield/index.jsx';

const FiltroHistorico = ({ onSubmit, colors = {} }) => {
  return (
    <Formik
      enableReinitialize
      initialValues={{ docTrabajador: '' }}
      validationSchema={Yup.object().shape({
        docTrabajador: Yup.number().required('El documento es requerido'),
      })}
      onSubmit={async (values) => {
        await onSubmit(values.docTrabajador);
      }}
    >
      {({ values, isSubmitting, handleChange, errors }) => {
        return (
          <Form>
            <Grid
              container
              spacing={2}
              sx={{ marginTop: 2, margin: '0 auto', marginBottom: 1 }}
            >
              <Grid item xs={12} md={3}>
                <CustomTextField
                  label="Documento Trabajador"
                  name="docTrabajador"
                  type="number"
                  error={!!errors.docTrabajador}
                  value={values.docTrabajador}
                  onChange={handleChange}
                  fullWidth
                />
                <div className="error1">
                  <ErrorMessage name="docTrabajador" />
                </div>
              </Grid>
              <Grid
                item
                xs={12}
                md={2}
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
              <Grid item xs={12} md={3}></Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FiltroHistorico;
