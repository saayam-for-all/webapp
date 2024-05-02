import { Theme } from '@mui/material';

export const root = (theme: Theme) => ({
  height: 'auto',
  width: '500px',
  zIndex: 4000,
  display: 'block',
  position: 'fixed',
  backgroundColor: theme.palette.background.paper,
  left: '50%',
  transform: 'translateX(-50%)',
  borderRadius: '15px',
});

export const cardContent = {
  width: '28rem',
  display: 'block',
  mr: 'auto',
  ml: 'auto',
  mt: '10%',
};

export const brand = {
  height: 100,
  width: 100,
  ml: 'auto',
  mr: 'auto',
  mt: '3rem',
  position: 'relative',
};

export const socials = {
  ml: 'auto',
  mr: 'auto',
  position: 'relative',
};
