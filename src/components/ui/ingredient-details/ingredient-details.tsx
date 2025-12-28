import React, { FC, memo } from 'react';
import styles from './ingredient-details.module.css';
import { IngredientDetailsUIProps } from './type';

export const IngredientDetailsUI: FC<IngredientDetailsUIProps> = memo(
  ({ ingredientData }) => {
    const { name, image_large, calories, proteins, fat, carbohydrates } =
      ingredientData;

    return (
      <div className={styles.content} data-test='modal-ingredient'>
        <img
          className={styles.img}
          alt='изображение ингредиента'
          src={image_large}
          data-test='ingredient-image-large'
        />
        <h3
          className='text text_type_main-medium mt-2 mb-4'
          data-test='ingredient-name'
        >
          {name}
        </h3>
        <ul
          className={`${styles.nutritional_values} text_type_main-default`}
          data-test='nutritional-values'
        >
          <li className={styles.nutritional_value} data-test='calories-row'>
            <p className={`text mb-2 ${styles.text}`}>Калории, ккал</p>
            <p className={`text text_type_digits-default`}>{calories}</p>
          </li>
          <li className={styles.nutritional_value} data-test='proteins-row'>
            <p className={`text mb-2 ${styles.text}`}>Белки, г</p>
            <p className={`text text_type_digits-default`}>{proteins}</p>
          </li>
          <li className={styles.nutritional_value} data-test='fat-row'>
            <p className={`text mb-2 ${styles.text}`}>Жиры, г</p>
            <p className={`text text_type_digits-default`}>{fat}</p>
          </li>
          <li
            className={styles.nutritional_value}
            data-test='carbohydrates-row'
          >
            <p className={`text mb-2 ${styles.text}`}>Углеводы, г</p>
            <p className={`text text_type_digits-default`}>{carbohydrates}</p>
          </li>
        </ul>
      </div>
    );
  }
);
