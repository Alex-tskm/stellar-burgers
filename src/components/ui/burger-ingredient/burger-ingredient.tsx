import React, { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import styles from './burger-ingredient.module.css';

import {
  Counter,
  CurrencyIcon,
  AddButton
} from '@zlden/react-developer-burger-ui-components';
import { TBurgerIngredientUIProps } from './type';

export const BurgerIngredientUI: FC<TBurgerIngredientUIProps> = memo(
  ({ ingredient, count, handleAdd, locationState }) => {
    const { image, price, name, _id } = ingredient;

    return (
      <li
        className={styles.container}
        data-test={`ingredient-item-${_id}`} // основной селектор для поиска ингредиента
      >
        <Link
          className={styles.article}
          to={`/ingredients/${_id}`}
          state={locationState}
          data-test={`ingredient-link-${_id}`} // для тестирования перехода
        >
          {count && (
            <Counter
              count={count}
              data-test={`ingredient-counter-${_id}`} // счётчик количества
            />
          )}
          <img
            className={styles.img}
            src={image}
            alt='картинка ингредиента'
            data-test={`ingredient-image-${_id}`} // изображение ингредиента
          />
          <div
            className={`${styles.cost} mt-2 mb-2`}
            data-test={`ingredient-price-container-${_id}`} // контейнер с ценой
          >
            <p
              className='text text_type_digits-default mr-2'
              data-test={`ingredient-price-${_id}`} // цена
            >
              {price}
            </p>
            <CurrencyIcon type='primary' data-test={`currency-icon-${_id}`} />
          </div>
          <p
            className={`text text_type_main-default ${styles.text}`}
            data-test={`ingredient-name-${_id}`} // название ингредиента
          >
            {name}
          </p>
        </Link>
        <AddButton
          text='Добавить'
          onClick={handleAdd}
          extraClass={`${styles.addButton} mt-8`}
          data-test={`add-button-${_id}`} // кнопка добавления
        />
      </li>
    );
  }
);
