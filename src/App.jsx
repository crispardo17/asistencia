import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Routes from './Routes';
import { ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { defaultTheme } from './themes';
import { UserProvider } from './shared/Contexts/UserContext/userContex';
function Toast() {
  return (
    <ToastContainer
      position="top-left"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
}

function App() {
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Toast />
          <UserProvider>
            <Routes />
          </UserProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
