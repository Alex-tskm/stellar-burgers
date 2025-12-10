import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { userSelectors } from '../../services/slices/userSlice';
import { Preloader } from '../ui/preloader';

interface ProtectedRouteProps {
  /**
   * Если true — маршрут доступен только для неавторизованных пользователей
   * Например, страница входа / регистрации
   * @default false
   */
  onlyUnAuth?: boolean;

  /**
   * Вложенный компонент/маршрут, который нужно защитить
   */
  children: ReactElement;
}

/**
 * Защищённый маршрут — компонент-обёртка для контроля доступа к маршрутам
 *
 * Логика работы:
 * 1. Пока идёт проверка авторизации (isAuthChecked = false) — показываем Preloader
 * 2. Если маршрут только для неавторизованных (onlyUnAuth=true), но пользователь авторизован — перенаправляем назад
 * 3. Если маршрут защищённый (onlyUnAuth=false), но пользователь не авторизован — отправляем на /login
 * 4. Во всех остальных случаях рендерим children
 */
export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  // Получаем данные пользователя из хранилища
  const user = useSelector(userSelectors.userSelect);

  // Флаг, указывающий, завершена ли проверка авторизации
  const isAuthChecked = useSelector(userSelectors.isAuthCheckedSelect);

  // Текущий URL и состояние навигации
  const location = useLocation();

  // Шаг 1: Пока идёт проверка авторизации — показываем прелоадер
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Шаг 2: Маршрут только для неавторизованных, но пользователь уже авторизован
  if (onlyUnAuth && user) {
    // Определяем, куда перенаправить:
    // - если есть state.from (предыдущая страница) — идём туда
    // - иначе — на главную (/)
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  // Шаг 3: Маршрут требует авторизации, но пользователь не вошёл в систему
  if (!onlyUnAuth && !user) {
    return (
      <Navigate
        to='/login'
        state={{ from: location }} // Сохраняем текущий маршрут для возврата после входа
        replace
      />
    );
  }

  // Шаг 4: Все проверки пройдены — рендерим защищённый контент
  return children;
};

export default ProtectedRoute;
