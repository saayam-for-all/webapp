import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { loginStyles } from '@styles';
import Image from 'next/image';
import { FBLogo, GoogleLogo } from '@static/svgs';

const LoginForm = () => {
  const onSubmit = (e: any) => {
    e.preventDefault();
    const { username, password } = e.target;
  };

  return (
    <section>
    <Card elevation={5} sx={loginStyles.root}>
      <Box sx={loginStyles.brand}>
        <Image src={'/logo.png'} fill={true} alt={''} />
      </Box>
      <Stack direction={'column'} justifyItems="center">
        <Typography textAlign="center" variant="caption">
          Welcome
        </Typography>
      </Stack>
      <CardContent sx={loginStyles.cardContent}>
        <form onSubmit={onSubmit}>
          <Stack direction={'column'} spacing={3}>
            <TextField
              placeholder="username/email"
              size="small"
              name="username"
            />
            <TextField
              placeholder="password"
              size="small"
              name="password"
              type="password"
            />
            <Button variant="contained" type="submit">
              Login
            </Button>
          </Stack>
        </form>
      </CardContent>
      <CardContent>
        <Stack direction={'column'} justifyItems="center">
          <Box sx={loginStyles.socials}>
            <IconButton size="large">
              <GoogleLogo />
              <Typography variant="caption" p={1}>
                Sign in with google
              </Typography>
            </IconButton>
            <IconButton>
              <FBLogo />
            </IconButton>
          </Box>
        </Stack>
      </CardContent>
    </Card>
    </section>
  );
};

export default LoginForm;
