import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import { constructorActions } from '../../services/slices/constructorSlice';

/**
 * Компонент ингредиента бургера
 *
 * Отображает отдельный ингредиент с возможностью добавления в конструктор бургера.
 * Оптимизирован через memo для предотвращения лишних перерисовок.
 *
 * Пропсы:
 * - ingredient: данные об ингредиенте (тип, название, цена, изображение и т.д.)
 * - count: количество данного ингредиента в текущем конструкторе (для отображения счётчика)
 */
export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    /**
     * Обработчик добавления ингредиента в конструктор бургера
     * Отправляет действие addIngredient с объектом ингредиента
     */
    const handleAdd = () => {
      dispatch(constructorActions.addIngredient({ ingredient }));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        // Передаём текущее местоположение как состояние для возможности открытия модального окна
        locationState={{ background: location }}
        handleAdd={handleAdd} // Обработчик клика по кнопке добавления
      />
    );
  }
);

export default BurgerIngredient;
