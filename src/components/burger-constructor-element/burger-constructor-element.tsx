import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import { constructorActions } from '../../services/slices/constructorSlice';

/**
 * Компонент элемента конструктора бургера
 *
 * Отображает отдельный ингредиент в конструкторе и предоставляет:
 * - кнопки перемещения вверх/вниз
 * - кнопку удаления ингредиента
 *
 * Оптимизирован через memo для предотвращения лишних перерисовок
 */
export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    /**
     * Обработчик перемещения ингредиента вверх
     * Проверяет, что элемент не на первой позиции (index > 0)
     */
    const handleMoveUp = () => {
      if (index > 0) {
        dispatch(
          constructorActions.moveIngredient({
            from: index,
            to: index - 1
          })
        );
      }
    };

    /**
     * Обработчик перемещения ингредиента вниз
     * Проверяет, что элемент не на последней позиции (index < totalItems - 1)
     */
    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        dispatch(
          constructorActions.moveIngredient({
            from: index,
            to: index + 1
          })
        );
      }
    };

    /**
     * Обработчик удаления ингредиента из конструктора
     * Отправляет действие removeIngredient с ID ингредиента
     */
    const handleClose = () => {
      dispatch(constructorActions.removeIngredient({ id: ingredient.id }));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);

export default BurgerConstructorElement;
