import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { constructorSelectors } from '../../services/slices/constructorSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { userSelectors } from '../../services/slices/userSlice';
import { orderSelectors, orderActions } from '../../services/slices/orderSlice';
import { createOrder } from '../../services/thunks/orderThunk';
import { useEffect } from 'react';
import { constructorActions } from '../../services/slices/constructorSlice';

/**
 * Компонент конструктора бургера
 *
 * Отвечает за:
 * - отображение текущего состава бургера (булка + ингредиенты)
 * - расчёт итоговой стоимости
 * - обработку заказа (с проверкой авторизации)
 * - управление модальным окном заказа
 */
export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();

  // Получаем текущее состояние конструктора бургера
  const constructorItems = useSelector(
    constructorSelectors.constructorBurgerElement
  );

  // Состояние запроса на создание заказа
  const orderRequest = useSelector(orderSelectors.newOrderRequestSelect);

  // Данные успешного заказа (для отображения в модальном окне)
  const orderModalData = useSelector(orderSelectors.newOrderSelect);

  const navigate = useNavigate();
  const location = useLocation();

  // Текущий авторизованный пользователь
  const user = useSelector(userSelectors.userSelect);

  /**
   * Обработчик клика по кнопке "Оформить заказ"
   * 1. Проверяет авторизацию пользователя
   * 2. Проверяет наличие булки и отсутствие активного запроса
   * 3. Формирует массив ID ингредиентов
   * 4. Отправляет запрос на создание заказа
   */
  const onOrderClick = () => {
    // Если пользователь не авторизован — перенаправляем на страницу входа
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    // Если нет булки или уже идёт запрос на создание заказа — прерываем выполнение
    if (!constructorItems.bun || orderRequest) return;

    // Формируем массив ID ингредиентов:
    // - ID нижней булки
    // - ID всех начинок
    // - ID верхней булки (такая же, как нижняя)
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds));
  };

  /**
   * Закрывает модальное окно заказа
   * Очищает данные о текущем заказе в сторе
   */
  const closeOrderModal = () => {
    dispatch(orderActions.clearNewOrder());
  };

  /**
   * Очистка конструктора после успешного создания заказа
   * Срабатывает при появлении данных заказа в сторе
   */
  useEffect(() => {
    if (orderModalData) {
      dispatch(constructorActions.clearConstructor());
    }
  }, [orderModalData, dispatch]);

  /**
   * Рассчитывает итоговую стоимость бургера
   * - Учитывает двойную цену булки (верх + низ)
   * - Суммирует цены всех ингредиентов
   * Пересчитывается только при изменении состава конструктора
   */
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      (constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ) || 0),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

export default BurgerConstructor;
