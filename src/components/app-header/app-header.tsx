import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { userSelectors } from '../../services/slices/userSlice';

export const AppHeader: FC = () => {
  const user = useSelector(userSelectors.userSelect);

  return <AppHeaderUI userName={user?.name || ''} />;
};
