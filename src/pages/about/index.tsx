import { AboutSection, DonateSection, UkraineSection } from '@components';
import { Grid, Stack, Theme, Typography } from '@mui/material';
import Image from 'next/image';

export default function About() {
  return (<>
  <section>
    <Grid sx={{ pl: '13rem', pr: '13rem' }} spacing={3} container>
      <Grid item xs={12} sx={{ mb: '13rem' }}>
        <Stack spacing={4} direction="column">
          <Typography
            variant="h1"
            sx={(theme: Theme) => ({
              fontWeight: 600,
              color: '#c1c1c1',
            })}
          >
            Who are we ?
          </Typography>
          <Typography variant="h5" align="justify">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text ever since the 1500s, when an unknown printer took a galley of
            type and scrambled it to make a type specimen book. It has survived
            not only five centuries, but also the leap into electronic
            typesetting, remaining essentially unchanged. It was popularised in
            the 1960s with the release of Letraset sheets containing Lorem Ipsum
            passages, and more recently with desktop publishing software like
            Aldus PageMaker including versions of Lorem Ipsum.
          </Typography>
        </Stack>
      </Grid>
      <Grid item md={6} xs={12} sx={{ mb: '13rem' }}>
        <Image
          style={{ borderRadius: '15px' }}
          height={500}
          width={700}
          src={'/images/homeless.jpg'}
          alt={''}
        />
      </Grid>
      <Grid item md={6} xs={12} sx={{ mb: '13rem' }}>
        <Stack spacing={4} direction="column">
          <Typography
            variant="h3"
            align="left"
            sx={(theme: Theme) => ({
              fontWeight: 600,
              color: theme.palette.secondary.dark,
            })}
          >
            150 million people are without a home in this world.
          </Typography>
          <Typography variant="h6" align="justify">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text ever since the 1500s, when an unknown printer took a galley of
            type and scrambled it to make a type specimen book. It has survived
            not only five centuries, but also the leap into electronic
            typesetting, remaining essentially unchanged. It was popularised in
            the 1960s with the release of Letraset sheets containing Lorem Ipsum
            passages, and more recently with desktop publishing software like
            Aldus PageMaker including versions of Lorem Ipsum.
          </Typography>
        </Stack>
      </Grid>
      <Grid item md={6} xs={12}>
        <Stack spacing={4} alignItems="center" direction="column">
          <Typography
            variant="h3"
            align="right"
            sx={(theme: Theme) => ({
              fontWeight: 600,
              color: theme.palette.primary.dark,
            })}
          >
            1 billion children aged 2–17 years, have experienced physical,
            sexual, or emotional violence or neglect in the past year.
          </Typography>
          <Typography variant="h6" align="justify">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text ever since the 1500s, when an unknown printer took a galley of
            type and scrambled it to make a type specimen book. It has survived
            not only five centuries, but also the leap into electronic
            typesetting, remaining essentially unchanged. It was popularised in
            the 1960s with the release of Letraset sheets containing Lorem Ipsum
            passages, and more recently with desktop publishing software like
            Aldus PageMaker including versions of Lorem Ipsum.
          </Typography>
        </Stack>
      </Grid>
      <Grid item md={6} xs={12}>
        <Image
          style={{ borderRadius: '15px' }}
          height={500}
          width={700}
          src={'/images/child-abuse.jpg'}
          alt={''}
        />
      </Grid>
    </Grid>
    </section>
    </>
  );
}
