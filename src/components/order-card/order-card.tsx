import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '@ui';
import { useAppSelector } from '../../services/store';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const ingredients = useAppSelector((state) => state.ingredients.ingredients);

  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    const ingredientDetails = order.ingredients.reduce(
      (acc: { ingredientsInfo: TIngredient[]; total: number }, item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) {
          acc.ingredientsInfo.push(ingredient);
          acc.total += ingredient.price;
        }
        return acc;
      },
      { ingredientsInfo: [], total: 0 }
    );

    const ingredientsToShow = ingredientDetails.ingredientsInfo.slice(0, maxIngredients);
    
    const remains =
      ingredientDetails.ingredientsInfo.length > maxIngredients
        ? ingredientDetails.ingredientsInfo.length - maxIngredients
        : 0;

    const date = new Date(order.createdAt);

    return {
      ...order,
      ingredientsInfo: ingredientDetails.ingredientsInfo,
      ingredientsToShow,
      remains,
      total: ingredientDetails.total,
      date
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});