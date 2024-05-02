import { Box, Button, Grid, Stack, Theme, Typography } from '@mui/material';
import { aboutSectionStyle } from '@styles';
import { ArrowForward } from '@mui/icons-material';
import Image from 'next/image';

const AboutSectionHomepage = () => {
  return (
    <section>
    <Box sx={aboutSectionStyle.aboutSectionRoot}>
      <Grid
        direction="row"
        alignItems={'center'}
        container
        sx={{ height: '100%', width: '100%' }}
      >
        <Grid item lg={6} sm={12}>
          <Box
            sx={{
              height: '400px',
              width: '600px',
              display: 'block',
              position: 'relative',
              ml: 'auto',
              mr: 'auto',
            }}
          >
            <Image
              alt=""
              style={{
                borderRadius: '15px',
              }}
              src={'/images/poverty.jpg'}
              fill={true}
            />
          </Box>
        </Grid>
        <Grid lg={6} item sm={12}>
          <Box sx={{ position: 'relative', width: '90%' }}>
            <Typography
              sx={(theme: Theme) => ({
                color: theme.palette.common.white,
                fontWeight: 600,
              })}
              variant="h2"
            >
              Who are we ?
            </Typography>
            <Typography
              sx={(theme: Theme) => ({
                color: theme.palette.common.white,
                fontWeight: 400,
              })}
              variant="body1"
              align="justify"
            >
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard dummy
              text ever since the 1500s, when an unknown printer took a galley
              of type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </Typography>
          </Box>

          <Button
            endIcon={<ArrowForward />}
            sx={(theme: Theme) => ({
              mt: '5rem',
              color: '#f1f1f2',
              borderColor: '#f1f1f2',
              '&:hover': {
                backgroundColor: '#f1f1f2',
                color: theme.palette.secondary.main,
              },
            })}
            variant="outlined"
          >
            Learn More
          </Button>
        </Grid>
      </Grid>
    </Box>
    </section>
  );
};

export default AboutSectionHomepage;
