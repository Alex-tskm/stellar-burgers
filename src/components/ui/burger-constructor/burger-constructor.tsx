import React, { FC } from 'react';
import {
  Button,
  ConstructorElement,
  CurrencyIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { BurgerConstructorUIProps } from './type';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorElement, Modal } from '@components';
import { Preloader, OrderDetailsUI } from '@ui';

export const BurgerConstructorUI: FC<BurgerConstructorUIProps> = ({
  constructorItems,
  orderRequest,
  price,
  orderModalData,
  onOrderClick,
  closeOrderModal
}) => (
  <section className={styles.burger_constructor} data-test='burger-constructor'>
    {constructorItems.bun ? (
      <div
        className={`${styles.element} mb-4 mr-4`}
        data-test='bun-top-container'
      >
        <ConstructorElement
          type='top'
          isLocked
          text={`${constructorItems.bun.name} (верх)`}
          price={constructorItems.bun.price}
          thumbnail={constructorItems.bun.image}
          data-test='bun-top'
        />
      </div>
    ) : (
      <div
        className={`${styles.noBuns} ${styles.noBunsTop} ml-8 mb-4 mr-5 text text_type_main-default`}
        data-test='no-buns-top'
      >
        Выберите булки
      </div>
    )}
    <ul className={styles.elements} data-test='ingredients-list'>
      {constructorItems.ingredients.length > 0 ? (
        constructorItems.ingredients.map(
          (item: TConstructorIngredient, index: number) => (
            <BurgerConstructorElement
              ingredient={item}
              index={index}
              totalItems={constructorItems.ingredients.length}
              key={item.id}
              data-test={`ingredient-${index}`}
            />
          )
        )
      ) : (
        <div
          className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
          data-test='no-ingredients'
        >
          Выберите начинку
        </div>
      )}
    </ul>
    {constructorItems.bun ? (
      <div
        className={`${styles.element} mt-4 mr-4`}
        data-test='bun-bottom-container'
      >
        <ConstructorElement
          type='bottom'
          isLocked
          text={`${constructorItems.bun.name} (низ)`}
          price={constructorItems.bun.price}
          thumbnail={constructorItems.bun.image}
          data-test='bun-bottom'
        />
      </div>
    ) : (
      <div
        className={`${styles.noBuns} ${styles.noBunsBottom} ml-8 mb-4 mr-5 text text_type_main-default`}
        data-test='no-buns-bottom'
      >
        Выберите булки
      </div>
    )}
    <div className={`${styles.total} mt-10 mr-4`} data-test='total-section'>
      <div className={`${styles.cost} mr-10`} data-test='cost-container'>
        <p className={`text ${styles.text} mr-2`} data-test='total-price'>
          {price}
        </p>
        <CurrencyIcon type='primary' data-test='currency-icon' />
      </div>
      <Button
        htmlType='button'
        type='primary'
        size='large'
        children='Оформить заказ'
        onClick={onOrderClick}
        data-test='order-button'
      />
    </div>

    {orderRequest && (
      <Modal
        onClose={closeOrderModal}
        title={'Оформляем заказ...'}
        data-test='loading-modal'
      >
        <Preloader data-test='preloader' />
      </Modal>
    )}

    {orderModalData && (
      <Modal
        onClose={closeOrderModal}
        title={orderRequest ? 'Оформляем заказ...' : ''}
        data-test='order-details-modal'
      >
        <OrderDetailsUI
          orderNumber={orderModalData.number}
          data-test='order-details'
        />
      </Modal>
    )}
  </section>
);
