/// <reference types="cypress" />
describe('Проверяем доступность приложения', function () {
  it('сервис должен быть доступен по адресу localhost:4000', function () {
    cy.visit('localhost:4000');
  });
});

describe('Конструктор бургера — интеграционные тесты', () => {
  beforeEach(() => {
    cy.viewport(1900, 1200);
    cy.visit('localhost:4000');

    // Перехватываем запросы
    cy.intercept('GET', '**/api/ingredients**', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json' // Только данные пользователя
    }).as('getUser');

    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    // Имитируем авторизацию: сохраняем токены
    cy.fixture('auth.json').then((authMock) => {
      window.localStorage.setItem('accessToken', authMock.accessToken);
      cy.setCookie('refreshToken', authMock.refreshToken);
    });

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser'); // Убеждаемся, что пользователь загружен
  });

  it('Должно отображаться начальное состояние конструктора', () => {
    cy.contains('Соберите бургер').should('be.visible');
    cy.contains('Выберите булки').should('be.visible');
    cy.contains('Выберите начинку').should('be.visible');
  });

  it('Находит ингредиенты', () => {
    cy.get('[data-test^="ingredient-item"]').should('have.length.gte', 1);
  });

  it('Добавление булки в конструктор', () => {
    // Открываем секцию булок
    cy.contains('Булки').click({ force: true });

    // Выбираем первую булку из списка
    cy.get('[data-test^="ingredient-item"]') 
      .first()
      .within(() => {
        cy.contains('Краторная булка N-200i').should('be.visible');
        cy.get('button').click(); // Кнопка добавления
      });

    // Проверяем, что булка появилась в конструкторе (верх и низ)
    cy.contains('Краторная булка N-200i (верх)').should('be.visible');
    cy.contains('Краторная булка N-200i (низ)').should('be.visible');
  });

  it('Отображает ингредиент "Биокотлета из марсианской Магнолии"', () => {
    // 1. Ждём загрузки данных (если нужно)
    cy.wait('@getIngredients');

    // 2. Ищем элемент с увеличенным таймаутом
    cy.contains('Биокотлета из марсианской Магнолии', { timeout: 8000 })
    // 3. Прокручиваем в видимую область
      .scrollIntoView()
      // 4. Проверяем видимость
      .should('be.visible')
      // 5. Дополнительно проверяем CSS 
      .and('not.have.css', 'opacity', '0')
      .and('not.have.css', 'visibility', 'hidden');
  });
  
  it('Добавление начинки в конструктор', () => {
    cy.wait('@getIngredients', { timeout: 8000 });

    cy.contains('Начинки')
      .should('be.visible')
      .click({ force: true });

    // Основной блок: поиск и добавление ингредиента
    cy.contains('Биокотлета из марсианской Магнолии', { timeout: 10000 })
      .scrollIntoView({ offset: { top: -100, left: 0 } })
      .should('be.visible')
      .parents('[data-test^="ingredient-item"]')
      .within(() => {
        cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
        cy.get('button').click();
      });
  });

  it('Открытие и закрытие модального окна ингредиента по крестику', () => {
    cy.get('[data-test^="ingredient-item"]').first().click();
    cy.get('[data-test="modal-ingredient"]').should('be.visible');
    cy.get('[data-test="close-modal-button"]').click();
    cy.get('[data-test="modal-ingredient"]').should('not.exist');
  });

  it('Закрытие модального окна ингредиента по оверлею', () => {
    cy.get('[data-test^="ingredient-item"]').first().click();
    cy.get('[data-test="modal-ingredient"]').should('be.visible');
    cy.get('[data-test="modal-overlay"]').click({ force: true });
    cy.get('[data-test="modal-ingredient"]').should('not.exist');
  });

  it('Проверка итоговой стоимости', () => {
    cy.contains('Булки').click({ force: true });
    cy.get('[data-test^="ingredient-item"]').first().find('button').click();

    cy.contains('Начинки').click({ force: true });
    cy.get('[data-test^="ingredient-item"]').eq(2).find('button').click();

    const bunPrice = 1255;
    const mainPrice = 424;
    const expectedPrice = bunPrice * 2 + mainPrice; // 2934

    cy.get('[data-test="total-price"]').should('contain.text', expectedPrice);
  });  
  
  it('Оформление заказа: авторизация, отправка, отображение номера', () => {
    cy.fixture('order.json').then((orderMock) => {
      const expectedOrderNumber = orderMock.order.number; // Извлекаем номер из мока

      // Действия пользователя: выбор ингредиентов
      cy.contains('Булки').click({ force: true });
      cy.get('[data-test^="ingredient-item"]').first().find('button').click();

      cy.contains('Начинки').click({ force: true });
      cy.get('[data-test^="ingredient-item"]').eq(2).find('button').click();

      // Кликаем "Оформить заказ"
      cy.contains('Оформить заказ').click();

      // Перехватываем и ждём ответ API
      cy.wait('@createOrder', { timeout: 10000 }).then((interception) => {
        // Проверяем статус ответа
        expect(interception.response.statusCode).to.equal(200);
        // Проверяем, что ответ содержит success: true
        expect(interception.response.body.success).to.be.true;
        // Проверяем соответствие номера заказа
        expect(interception.response.body.order.number).to.equal(expectedOrderNumber);
      });

      cy.wait(1000); // небольшая задержка для рендера

      // Закрываем модальное окно
      cy.get('[data-test="close-modal-button"]').click();
      
      // Проверяем, что модалка удалена из DOM
      cy.get('[data-test="order-details-modal"]', {
        includeShadowDom: true, // если используется Shadow DOM
        timeout: 5000
      }).should('not.exist');

      // Проверяем очистку конструктора
      cy.contains('Выберите булки').should('be.visible');
      cy.contains('Выберите начинку').should('be.visible');
    });
  });  
});
