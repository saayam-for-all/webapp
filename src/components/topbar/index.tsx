import {
  AppBar,
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { topbarStyles } from '@styles';
import Image from 'next/image';
import Link from 'next/link';
import {EmblaCarousel} from '../carousel/index'

interface ITopBarProps {
  showLogin: (value: boolean) => void;
}

const Topbar = (props: ITopBarProps) => {
  const { showLogin } = props;

  const handleLoginClick = () => {
    showLogin(true);
  };

  return (
    <nav>
    <AppBar position="relative" sx={topbarStyles.rootMin}>
      <Toolbar sx={topbarStyles.toolbar}>
        <Box sx={{ flexGrow: 1 }}>
          <IconButton>
            <Image src={'/logo.png'} height={60} width={60} alt={''} />
          </IconButton>
        </Box>
        <Stack direction="row" spacing={3}>
          <Link style={topbarStyles.link} href={'/'}>
            <Typography sx={topbarStyles.linkText} variant="subtitle1">
              Home
            </Typography>
          </Link>
          <Link style={topbarStyles.link} href={'/about'}>
            <Typography sx={topbarStyles.linkText} variant="subtitle1">
              About
            </Typography>
          </Link>
          <Link style={topbarStyles.link} href={'/donate'}>
            <Typography sx={topbarStyles.linkText} variant="subtitle1">
              Donate
            </Typography>
          </Link>
          <Link style={topbarStyles.link} href={'/get-in-touch'}>
            <Typography sx={topbarStyles.linkText} variant="subtitle1">
              Get in touch
            </Typography>
          </Link>
          <Button
            sx={{ width: '6rem', fontWeight: 700 }}
            size="small"
            variant="outlined"
            onClick={handleLoginClick}
          >
            Login
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
    <EmblaCarousel/>
    </nav>
    
     
   
    
  );
};

export default Topbar;
