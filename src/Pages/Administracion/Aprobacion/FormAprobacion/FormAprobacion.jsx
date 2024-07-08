import { Alert, Grid } from '@mui/material';
import { Form, Formik, ErrorMessage } from 'formik';
import useFormAprobacion from './useFormAprobacion';
import CustomSelect from '@/shared/Components/Inputs/CustomSelect';
import CustomObservation from '@/shared/Components/Inputs/CustomObservation';
import CustomButton from '@/shared/Components/Inputs/CustomButton';
import useMainApp from '@/shared/Hooks/useMainApp.jsx';

const FormAprobacion = ({ data, onSubmit, afterSubmit = () => {} }) => {
  const { initialValuesAprobacionForm, validationSchema, adjuntoFileNovedad } =
    useFormAprobacion({});
  const { colors } = useMainApp();
  return (
    <>
      {!adjuntoFileNovedad && (
        <Alert color={colors.primary}>
          Esta novedad no cuenta con archivos adjuntos.
        </Alert>
      )}
      <Formik
        validateOnMount
        validateOnChange
        validateOnBlur
        initialValues={{
          ...initialValuesAprobacionForm,
          tipoNovedad: data.novedad.datos.id_tipoNovedad
            ? data.novedad.datos.id_tipoNovedad
            : initialValuesAprobacionForm.tipoNovedad,
          idReporteNovedad: data.novedad.datos.idReporteNovedad,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          await onSubmit(values);
          afterSubmit(values);
        }}
      >
        {({ handleChange, values, errors }) => {
          return (
            <Form>
              <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                <Grid item xs={12}>
                  <CustomSelect
                    labelId=""
                    label="Tipo de Novedad"
                    id="tipoNovedad"
                    name="tipoNovedad"
                    value={values.tipoNovedad}
                    onChange={handleChange}
                    options={[
                      ...data.novedad.tiposNovedad.map(
                        ({ idTipoNovedad, nombre }) => ({
                          value: idTipoNovedad,
                          label: nombre,
                          key: idTipoNovedad,
                        })
                      ),
                    ]}
                    error={errors.tipoNovedad}
                    disabled={true}
                  />
                  <div className="error1">
                    <ErrorMessage name="tipoNovedad" />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <CustomSelect
                    labelId="¿Se aprueba?"
                    label="¿Se aprueba?"
                    id="aprueba"
                    name="aprueba"
                    value={values.aprueba}
                    onChange={handleChange}
                    options={[
                      {
                        value: true,
                        label: 'Si',
                        key: 'true',
                      },
                      {
                        value: false,
                        label: 'No',
                        key: 'false',
                      },
                    ]}
                    error={errors.aprueba}
                  />
                  <div className="error1">
                    <ErrorMessage name="aprueba" />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <CustomObservation
                    label="Notas"
                    name="observacion"
                    type="text"
                    error={errors.observacion}
                    value={values.observacion}
                    onChange={handleChange}
                    fullWidth
                  />
                  <div className="error1">
                    <ErrorMessage name="observacion" />
                  </div>
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ marginTop: 1 }}>
                <Grid
                  item
                  xs={6}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}
                ></Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}
                >
                  <CustomButton
                    fullWidth
                    variant="contained"
                    type="submit"
                    color="#088cd4"
                  >
                    Crear
                  </CustomButton>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default FormAprobacion;
