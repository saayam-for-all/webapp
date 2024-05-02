import {
  Box,
  Button,
  Grid,
  ImageList,
  ImageListItem,
  Stack,
  Theme,
  Typography,
} from '@mui/material';
import { ukraineSectionStyle } from '@styles';
import { ArrowForward } from '@mui/icons-material';
import Image from 'next/image';

const itemData = [
  {
    img: '/images/uk-p-1.webp',
    title: 'Ukraine',
  },
  {
    img: '/images/uk-p-2.jpg',
    title: 'Ukraine',
  },
  {
    img: '/images/uk-p-3.png',
    title: 'Ukraine',
  },
  {
    img: '/images/uk-p-4.jpg',
    title: 'Ukraine',
  },
];

const ukraineSectionHomepage = () => {
  return (<>
    <section>
    <Box sx={ukraineSectionStyle.ukraineSectionRoot}>
      <Grid
        height={'70vh'}
        pt={8}
        pb={8}
        pl={5}
        spacing={3}
        direction="row"
        alignItems={'center'}
        justifyContent={'center'}
        container
      >
        <Grid item lg={6} sm={12}>
          <Box sx={{ postion: 'relative', width: '90%' }}>
            <Stack alignItems={'center'} spacing={1} direction={'row'}>
              <Typography color={'primary'} variant="h2" fontWeight={600}>
                We are with Ukraine
              </Typography>
              <Image
                alt=""
                src={'/images/ukraine.png'}
                height={80}
                width={150}
              />
            </Stack>
            <Typography
              sx={(theme: Theme) => ({
                fontWeight: 400,
              })}
              variant="body2"
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
        </Grid>
        <Grid item lg={6} sm={12}>
          <Box pr={3}>
            <ImageList
              sx={{
                width: '100%',
                height: 450,
                overflowY: 'hidden',
                borderRadius: '15px',
              }}
              cols={2}
              rowHeight={154}
            >
              {itemData.map((item) => (
                <ImageListItem key={item.img}>
                  <img
                    src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                    srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    alt={item.title}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        </Grid>
      </Grid>
    </Box>
    </section>
    </>
  );
};

export default ukraineSectionHomepage;
