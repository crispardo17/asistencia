import CustomTextField from '@/shared/Components/Inputs/CustomTextfield/index.jsx';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';

import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';

const CustomTextFieldCorreo = ({
  onWrite,
  correoUser,
  handleClick,
}) => {
  const [valuecorreo, setValuecorreo] = useState('');
  const [disabled, setDisabled] = useState(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <CustomTextField
        // label="Departamento"
        id="centroCosto"
        name="centroCosto"
        disabled={disabled}
        placeholder={correoUser}
        value={valuecorreo}
        onChange={(e) => {
          setValuecorreo(e.target.value);
          onWrite(e.target.value);
        }}
      />
      <IconButton
        onClick={() => {
            setDisabled(false);
            setValuecorreo(correoUser);
          handleClick(valuecorreo);
        }}
      >
        {correoUser !== valuecorreo  ? (
          <SendOutlinedIcon />
        ) : (
          <DriveFileRenameOutlineOutlinedIcon />
          
        )}
      </IconButton>
    </div>
  );
};

export default CustomTextFieldCorreo;
