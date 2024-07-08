import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fade from '@mui/material/Fade';

const CustomAccordion = ({
  title,
  content,
  detailsContent,
  bgColor,
  maxwidth = '30vw',
  handleOpen,
  handleOnContentClick,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpansion = () => {
    setExpanded((prevExpanded) => !prevExpanded);
    if (!expanded && handleOpen) handleOpen();
  };

  return (
    <div>
      <Accordion
        elevation={0}
        expanded={expanded}
        onChange={handleExpansion}
        slots={{ transition: Fade }}
        slotProps={{ transition: { timeout: 500 } }}
        sx={{
          '& .MuiAccordion-region': { height: expanded ? 'auto' : 1 },
          '& .MuiAccordionDetails-root': {
            display: expanded ? 'block' : 'none',
          },
          margin: '3px',
          backgroundColor: bgColor,
          textAnchor: '5px',
          ...(expanded && {
            borderTopRightRadius: '0 !important',
            borderTopLeftRadius: '0 !important',
            opacity: 0.9,
            maxWidth: maxwidth,
          }),
          
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography color={'inherit'}>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{ backgroundColor: '#ffffff' }}
          onClick={() => {
            if (expanded && handleOnContentClick) {
              handleOnContentClick();
            }
          }}
        >
          <Typography sx={{ cursor: 'pointer' }}>{content}</Typography>
          <Typography sx={{ color: 'gray' }}> {detailsContent}</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default CustomAccordion;
