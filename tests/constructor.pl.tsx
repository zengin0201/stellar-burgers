import { test, expect } from '@playwright/test';

const mockIngredients = {
  success: true,
  data: [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      __v: 0
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
      __v: 0
    }
  ]
};

const mockUser = {
  success: true,
  user: {
    email: 'test@yandex.ru',
    name: 'TestUser'
  }
};

const mockOrder = {
  success: true,
  name: 'Краторный марсианский бургер',
  order: {
    number: 1337
  }
};

test.describe('Тестирование страницы конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/ingredients', (route) => {
      route.fulfill({ json: mockIngredients });
    });

    await page.route('**/api/auth/user', (route) => {
      route.fulfill({ json: mockUser });
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

    await page.route('**/api/orders', (route) => {
      route.fulfill({ json: mockOrder });
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