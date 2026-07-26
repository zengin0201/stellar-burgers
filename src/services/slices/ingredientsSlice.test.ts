import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';

describe('Тестирование ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  const mockIngredients = [
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
    }
  ];

  it('должен возвращать initial state при неизвестном экшене', () => {
    const result = ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(result).toEqual(initialState);
  });

  it('должен обрабатывать fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const result = ingredientsReducer(initialState, action);
    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('должен обрабатывать fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const result = ingredientsReducer(initialState, action);
    expect(result.isLoading).toBe(false);
    expect(result.ingredients).toEqual(mockIngredients);
  });

  it('должен обрабатывать fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка сети' }
    };
    const result = ingredientsReducer(initialState, action);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Ошибка сети');
  });
});