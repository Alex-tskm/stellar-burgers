import { ProfileOrdersUI } from '@ui-pages';
import { FC } from 'react';

import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchProfileOrders } from '../../services/thunks/feedsThunk';
import { feedsSelectors } from '../../services/slices/feedsSlice';
import { userSelectors } from '../../services/slices/userSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(userSelectors.userSelect);
  const userOrders = useSelector(feedsSelectors.feedOrdersSelect);

  // Загружаем заказы пользователя
  useEffect(() => {
    if (user) {
      dispatch(fetchProfileOrders());
    }
  }, [dispatch, user]);

  if (!userOrders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={userOrders} />;
};
