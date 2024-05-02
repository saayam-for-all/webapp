import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  Theme,
  Typography,
} from '@mui/material';
import { volunteerSectionStyle } from '@styles';
import { ArrowForward, VolunteerActivism } from '@mui/icons-material';
import Image from 'next/image';

const VolunteerSectionHomepage = () => {
  return (
    <Box sx={volunteerSectionStyle.donateSectionRoot}>
      <Grid
        pt={8}
        pb={8}
        pr={5}
        spacing={15}
        direction="row"
        alignItems={'center'}
        justifyContent={'center'}
        container
      >
        <Grid item sm={12} md={6}>
          <IconButton
            sx={(theme: Theme) => ({
              display: 'block',
              ml: 'auto',
              mr: 'auto',
              color: theme.palette.secondary.main,
            })}
          >
            <VolunteerActivism sx={{ transform: 'scale(900%)' }} />
          </IconButton>
        </Grid>
        <Grid item sm={12} md={6}>
          <Stack direction="column" spacing={3}>
            <Typography
              sx={(theme: Theme) => ({
                fontWeight: 600,
                color: theme.palette.primary.main,
              })}
              variant="h2"
            >
              Volunteers at SAAYAM
            </Typography>
            <Stack direction={'row'} spacing={1}>
              <Avatar
                sx={{ height: '5rem', width: '5rem' }}
                alt="Remy Sharp"
                src={'/placeholders/pp1.jpg'}
              />
              <Avatar
                sx={{ height: '5rem', width: '5rem' }}
                alt="Remy Sharp"
                src={'/placeholders/pp2.jpg'}
              />
              <Avatar
                sx={{ height: '5rem', width: '5rem' }}
                alt="Remy Sharp"
                src={'/placeholders/pp3.jpg'}
              />
              <Avatar
                sx={{ height: '5rem', width: '5rem' }}
                alt="Remy Sharp"
                src={'/placeholders/pp5.jpg'}
              />
            </Stack>
            <Typography
              sx={(theme: Theme) => ({
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
          </Stack>
          <Button
            endIcon={<ArrowForward />}
            sx={(theme: Theme) => ({
              mt: '2rem',
            })}
            variant="outlined"
            color="primary"
          >
            Join Us
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VolunteerSectionHomepage;
