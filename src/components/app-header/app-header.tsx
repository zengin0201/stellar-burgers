import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useAppSelector } from '../../services/store';
import { selectUser } from '../../services/selectors';

export const AppHeader: FC = () => {
  const user = useAppSelector(selectUser);

  return <AppHeaderUI userName={user?.name || ''} />;
};