import { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/userOrdersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.userOrders.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
