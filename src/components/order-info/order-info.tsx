import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/orderSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useAppDispatch();

  const ingredients: TIngredient[] = useAppSelector(
    (state) => state.ingredients.ingredients
  );
  const feedOrders = useAppSelector((state) => state.feed.orders);
  const userOrders = useAppSelector((state) => state.userOrders.orders);
  const modalOrder = useAppSelector((state) => state.order.orderModalData);
  const orderData =
    feedOrders.find((order) => order.number === Number(number)) ||
    userOrders.find((order) => order.number === Number(number)) ||
    (modalOrder?.number === Number(number) ? modalOrder : null);

  useEffect(() => {
    if (!orderData && number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number, orderData]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;
    const date = new Date(orderData.createdAt);
    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = { ...ingredient, count: 1 };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return { ...orderData, ingredientsInfo, date, total };
  }, [orderData, ingredients]);

  if (!orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
