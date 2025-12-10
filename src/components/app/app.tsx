import '../../index.css';
import styles from './app.module.css';

import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  useMatch
} from 'react-router-dom';
import { useEffect } from 'react';

import { useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/thunks/ingredientsThunk';
import { fetchUser } from '../../services/thunks/userThunk';

import {
  AppHeader,
  Modal,
  IngredientDetails,
  ProtectedRoute,
  OrderInfo
} from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Состояние для отображения модального окна (если есть background-маршрут)
  const background = location.state?.background;

  // Эффект: загрузка данных пользователя при инициализации приложения
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // Эффект: загрузка списка ингредиентов при монтировании компонента
  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  /**
   * Обработчик закрытия модального окна
   * Возвращает на предыдущий экран (на 1 шаг назад в истории навигации)
   */
  const handleModalClose = () => {
    navigate(-1);
  };

  // Получаем номер заказа из URL для профиля и ленты заказов
  const profileMatch = useMatch('/profile/orders/:number')?.params.number;
  const feedMatch = useMatch('/feed/:number')?.params.number;
  const orderNumber = profileMatch || feedMatch;

  return (
    <div className={styles.app}>
      <AppHeader />

      {/* Основной набор маршрутов (без модальных окон) */}
      <Routes location={background || location}>
        {/* Публичные маршруты (доступны всем) */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />

        {/* Защищённые маршруты для НЕавторизованных пользователей */}
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* Защищённые маршруты для авторизованных пользователей */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        {/* Страница 404 — маршрут по умолчанию для несуществующих путей */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна (отображаются поверх основного контента при наличии background) */}
      {background && (
        <Routes>
          {/* Модальное окно для деталей ингредиента */}
          <Route
            path='/ingredients/:id'
            element={
              <Modal onClose={handleModalClose} title='Детали ингредиента'>
                <IngredientDetails />
              </Modal>
            }
          />

          {/* Модальное окно для информации о заказе из ленты */}
          <Route
            path='/feed/:number'
            element={
              <Modal
                onClose={handleModalClose}
                title={`#${orderNumber && orderNumber.padStart(6, '0')}`}
              >
                <OrderInfo />
              </Modal>
            }
          />

          {/* Модальное окно для информации о заказе из профиля */}
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal
                  onClose={handleModalClose}
                  title={`#${orderNumber && orderNumber.padStart(6, '0')}`}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
