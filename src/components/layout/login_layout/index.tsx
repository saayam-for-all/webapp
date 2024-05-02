import { Topbar } from '@components';
import { Box } from '@mui/material';
import { useState } from 'react';
import { LoginForm } from '@components';
import { loginLayoutStyle } from '../../../styles';

const LoginLayout = (props: any) => {
  const { children } = props;
  const [showLoginForm, setShowLoginForm] = useState(false);
  const backdropStyle = showLoginForm ? loginLayoutStyle.backdropOverlay : {};
  return (
    <>
    <section>
      <Box sx={backdropStyle}></Box>
      <Topbar showLogin={setShowLoginForm} />
      <Box>
        {showLoginForm && (
          <>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                position: 'absolute',
              }}
            >
              <LoginForm />
            </Box>
          </>
        )}
      </Box>
      {children}
      </section>
    </>
  
  );
};

export default LoginLayout;
