import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { heroStyles } from '@styles';
import Image from 'next/image';

const HeroSection = () => {
  return (
    
    <section>
    <Box sx={heroStyles.root}>
      <Grid spacing={3} alignItems="center" container sx={{ height: '100%' }}>
        <Grid item xs={6}>
          <Stack direction={'column'} alignItems="center">
            <Typography color={'secondary'} variant="h2" fontWeight={700}>
              SAAYAM
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              Always there
            </Typography>
            <Box
              sx={{
                padding: '1rem',
              }}
              
            >
              

           

              <Typography textAlign="center" align="justify" variant="body1">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry&apos;s standard
                dummy text ever since the 1500s, when an unknown printer took a
                galley of type and scrambled it to make a type specimen book. It
                has survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged.
              </Typography>
            </Box>
            <Button variant="contained">Donate Now</Button>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Box component={'div'} sx={heroStyles.heroImage}>
            <Image
              alt=""
              style={{ borderRadius: '15px' }}
              src={'/images/hero.png'}
              fill={true}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
    </section>
  );
};

export default HeroSection;
