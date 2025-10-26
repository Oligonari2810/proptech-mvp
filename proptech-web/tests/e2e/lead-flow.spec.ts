import { test, expect } from '@playwright/test'

test('Flujo completo: Buscar → Ver → Lead', async ({ page }) => {
  // 1. Ir a página de comprar
  await page.goto('https://habitatprord.com/comprar')
  
  // 2. Verificar que hay propiedades
  await expect(page.locator('text=Encuentra tu Propiedad Ideal')).toBeVisible()
  
  // 3. Esperar a que carguen las propiedades
  await page.waitForSelector('[data-testid="property-card"]', { timeout: 10000 })
  
  // 4. Hacer clic en la primera propiedad
  await page.locator('[data-testid="property-card"]').first().click()
  
  // 5. Verificar que se abre el detalle
  await expect(page.locator('text=Agendar Visita')).toBeVisible()
  
  // 6. Hacer clic en WhatsApp
  const [newPage] = await Promise.all([
    page.context().waitForEvent('page'),
    page.locator('text=Agendar Visita').click()
  ])
  
  // 7. Verificar que se abre WhatsApp
  await expect(newPage.url()).toContain('whatsapp.com')
  
  await newPage.close()
})

test('Calculadora HabitaScore funciona', async ({ page }) => {
  await page.goto('https://habitatprord.com/valorar')
  
  // Llenar formulario
  await page.fill('input[type="number"]', '100')
  await page.selectOption('select', { value: '3' })
  await page.click('text=Calcular Valoración')
  
  // Verificar resultado
  await expect(page.locator('text=HabitaScore')).toBeVisible({ timeout: 10000 })
})
