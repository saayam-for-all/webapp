import { Theme } from '@mui/material';

export const rootMin = (theme: Theme) => ({
  height: '6rem',
  border: 'none',
  boxShadow: 'none',
  backgroundColor: 'transparent',
  position: 'relative',
});

export const toolbar = {
  height: '100%',
  display: 'flex',
  alignItems: 'center',
};

export const linkText = (theme: Theme) => ({
  color: theme.palette.primary.dark,
  textDecoration: 'none',
  padding: '.5rem',
  fontWeight: 500,
  borderRadius: '5px',
  ':hover': {
    backgroundColor: '#DDDBDB',
    padding: '.5rem',
  },
});

export const link = {
  textDecoration: 'none',
};
