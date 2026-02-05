import { expect, test } from '@playwright/test';

test.use({ locale: 'es-ES' });

test('main page in Spanish', async ({ page }) => {
  await page.goto('https://test-saayam.netlify.app');

  const title = page.getByRole('heading', { level: 1 }).first();

  

  await expect(title).toHaveText('¿Necesitas ayuda? ¿Aquí para ayudar?')
  

});

test('our team page in spanish',async ({page}) =>{
  const title = page.getByRole('heading', { level: 1 }).first();
  await page.goto('https://test-saayam.netlify.app/our-team')
  
  await expect(title).toHaveText('Consejo de administración')
  
})

test('', async ({page}) =>{
const title = 'title'
await page.goto()
})