import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} from './constructorSlice';
import { TConstructorIngredient } from '../../utils/types';

describe('Тестирование constructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const mockBun = {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    price: 100,
    image: '',
    image_mobile: '',
    image_large: '',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    id: 'test-bun-id'
  } as TConstructorIngredient;

  const mockIngredient1 = {
    _id: '2',
    name: 'Начинка 1',
    type: 'main',
    price: 200,
    image: '',
    image_mobile: '',
    image_large: '',
    proteins: 20,
    fat: 20,
    carbohydrates: 20,
    calories: 200,
    id: 'test-ing-1'
  } as TConstructorIngredient;

  const mockIngredient2 = {
    _id: '3',
    name: 'Начинка 2',
    type: 'sauce',
    price: 300,
    image: '',
    image_mobile: '',
    image_large: '',
    proteins: 30,
    fat: 30,
    carbohydrates: 30,
    calories: 300,
    id: 'test-ing-2'
  } as TConstructorIngredient;

  it('должен возвращать initial state при неизвестном экшене', () => {
    const result = constructorReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(result).toEqual(initialState);
  });

  it('должен обрабатывать добавление булки', () => {
    const action = { type: addIngredient.type, payload: mockBun };
    const result = constructorReducer(initialState, action);
    
    expect(result.bun).toEqual(mockBun);
    expect(result.ingredients).toHaveLength(0);
  });

  it('должен обрабатывать добавление начинки', () => {
    const action = { type: addIngredient.type, payload: mockIngredient1 };
    const result = constructorReducer(initialState, action);
    
    expect(result.bun).toBeNull();
    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0]).toEqual(mockIngredient1);
  });

  it('должен обрабатывать удаление ингредиента', () => {
    const stateWithIngredient = {
      bun: null,
      ingredients: [mockIngredient1, mockIngredient2]
    };
    
    const action = { type: removeIngredient.type, payload: 'test-ing-1' };
    const result = constructorReducer(stateWithIngredient, action);
    
    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0].id).toBe('test-ing-2');
  });

  it('должен перемещать ингредиент вверх', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [mockIngredient1, mockIngredient2]
    };
    
    const action = { type: moveIngredientUp.type, payload: 1 };
    const result = constructorReducer(stateWithIngredients, action);
    
    expect(result.ingredients[0].id).toBe('test-ing-2');
    expect(result.ingredients[1].id).toBe('test-ing-1');
  });

  it('должен перемещать ингредиент вниз', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [mockIngredient1, mockIngredient2]
    };
    
    const action = { type: moveIngredientDown.type, payload: 0 };
    const result = constructorReducer(stateWithIngredients, action);
    
    expect(result.ingredients[0].id).toBe('test-ing-2');
    expect(result.ingredients[1].id).toBe('test-ing-1');
  });

  it('должен очищать конструктор', () => {
    const fullState = {
      bun: mockBun,
      ingredients: [mockIngredient1, mockIngredient2]
    };
    
    const action = { type: clearConstructor.type };
    const result = constructorReducer(fullState, action);
    
    expect(result).toEqual(initialState);
  });
});