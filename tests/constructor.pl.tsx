import { test, expect } from '@playwright/test';

test.describe('Тестирование страницы конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false ,
    });

    await page.routeFromHAR('./tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false,
    });

    await page.goto('http://localhost:4000'); 
  });

  test('Добавление булки и начинки в конструктор', async ({ page }) => {
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();
    await expect(page.getByText('Биокотлета из марсианской Магнолии')).toBeVisible();

    const addButtons = page.locator('button', { hasText: 'Добавить' });
    await addButtons.nth(0).click();
    await addButtons.nth(1).click();

    await expect(page.locator('.constructor-element', { hasText: 'Краторная булка N-200i' }).first()).toBeVisible();
    await expect(page.locator('.constructor-element', { hasText: 'Биокотлета из марсианской Магнолии' })).toBeVisible();
  });

  test('Открытие и закрытие модального окна ингредиента', async ({ page }) => {
    await page.locator('a[href^="/ingredients/"]').first().click();

    const modal = page.locator('#modals');
    await expect(modal.getByText('Детали ингредиента')).toBeVisible();
    await expect(modal.getByText('Краторная булка N-200i')).toBeVisible();

    await modal.locator('button').first().click();
    await expect(modal.getByText('Детали ингредиента')).not.toBeVisible();

    await page.locator('a[href^="/ingredients/"]').first().click();
    await expect(modal.getByText('Детали ингредиента')).toBeVisible();

    await page.mouse.click(10, 10);
    await expect(modal.getByText('Детали ингредиента')).not.toBeVisible();
  });

  test('Создание заказа', async ({ page }) => {
    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'Bearer%20mock-access-token',
        domain: 'localhost', 
        path: '/'
      }
    ]);

    await page.evaluate(() => {
      localStorage.setItem('accessToken', 'Bearer mock-access-token');
      localStorage.setItem('refreshToken', 'mock-refresh-token');
    });
    await page.routeFromHAR('./tests/hars/order.har', {
      url: '**/api/orders',
      update: false,
    });

    await page.reload();

    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();
    await expect(page.getByText('Биокотлета из марсианской Магнолии')).toBeVisible();

    const addButtons = page.locator('button', { hasText: 'Добавить' });
    await addButtons.nth(0).click();
    await addButtons.nth(1).click();

    const orderButton = page.locator('button', { hasText: 'Оформить заказ' });
    await expect(orderButton).toBeVisible();
    await orderButton.click();

    const modal = page.locator('#modals');
    await expect(modal.getByText('1337')).toBeVisible();

    await modal.locator('button').first().click();
    await expect(modal.getByText('1337')).not.toBeVisible();

    await expect(page.locator('.constructor-element', { hasText: 'Краторная булка N-200i' })).not.toBeVisible();
  });
});