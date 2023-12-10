async function getProducts() {
  const response = await fetch(`${window.location.origin}/scripts/assets/products.json`);
  return (await response).json();
}

async function getNews() {
  const response = await fetch(`${window.location.origin}/scripts/assets/news.json`);
  console.log(`${window.location.origin}/scripts/assets/news.json`);
  console.log(response.status);
  return response.json();
}

let products = [];
let news = [];

// --==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--

/**
 * Function that adds a certain news item to page
 * @param {any} news
 */
function addNewsToPage(news) {
  const newsList = document.querySelector('.news-list-container');

  const listItem = document.createElement('div');
  listItem.setAttribute('class', 'news-item');

  const itemImage = document.createElement('img');
  itemImage.addEventListener('click', () => { openModal(news); });
  itemImage.src = news.image;

  const itemTitle = document.createElement('p');
  itemTitle.setAttribute('class', 'news-title');
  itemTitle.setAttribute('style', 'height: 48px;');
  itemTitle.textContent = news.title;

  const itemContent = document.createElement('p');
  itemContent.setAttribute('class', 'item-content');
  itemContent.setAttribute('style', 'height: 210px');
  itemContent.textContent = news.content.split(/(\s+)/).slice(0, 100).join(' ');

  const itemButton = document.createElement('button');
  itemButton.setAttribute('class', 'item-button');
  itemButton.addEventListener('click', () => { openModal(news); });
  itemButton.innerHTML = `
<div>${renderMagnifierIcon(24)}</div>
<div>Смотреть</div>
  `.trim();

  listItem.appendChild(itemImage);
  listItem.appendChild(itemTitle);
  listItem.appendChild(itemContent);
  listItem.appendChild(itemButton);

  newsList.appendChild(listItem);
}

// --==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--

/**
 * Function that update cart count icon at the top right side of the screen
 */
function updateCartIcon() {
  let cartLength = 0;
  for (let key of Object.keys(localStorage)) {
    if (localStorage[key] !== '0' && localStorage[key] !== "NaN") { cartLength++ }
  }
  
  document.querySelector('.cart-item-count').textContent = (cartLength === 0) ? '' : cartLength;
}

// --==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--

/**
 * Function that opens modal window and adds content into it
 * @param {any} item 
 */
function openModal(item) {
  const modalOverlay = document.getElementById('modal_overlay');
  const modalContent = document.getElementById('modal_content');
  let buttonsDiv; // Declare buttonsDiv outside the conditional block

  modalOverlay.style.display = 'flex';
  modalContent.innerHTML = `
    <span id="close_modal" onclick="closeModal()">&times;</span>
  `.trim();

  const modalHeader = createAndSetAttributes(
    'h3', {'class': 'modal-header', 'style': 'font-weight: bold'}
  );
  const modalImage = createAndSetAttributes('img', {'class': 'modal-image'});

  if (item.id !== undefined) {
    modalHeader.textContent = item.name;
    modalImage.src = item.image;

    const modalPrice = createAndSetAttributes(
      'p', {'class': 'modal-item-price', 'style': 'font-weight: bold; font-size: 20px'}
    );
    modalPrice.textContent = `${formatPrice(item.price)} ${item.currencyLabel}`;

    if (localStorage.getItem(item['id']) === '0') {
      const itemButton = createButton('item-button', () => { 
        handleAddToCart(item); openModal(item); }, 
        `
          <div>${renderPlusIcon(24)}</div>
          <div>Добавить</div>
        `
      );

      buttonsDiv = createAndSetAttributes('div', {'class': 'buttons-div'});

      const descriptionHeader = createAndSetAttributes(
        'h3', {'class': 'modal-content-header', 'style': 'font-weight: bold; margin-top: 16px'}
      );
      descriptionHeader.textContent = `Описание`;

      const description = createAndSetAttributes('div', {'style': 'white-space: pre-line;'});
      description.textContent = `${item.description}`;

      const propertiesHeader = createAndSetAttributes(
        'h3', {'class': 'modal-content-header', 'style': 'font-weight: bold; margin-top: 16px'}
      );
      propertiesHeader.textContent = `Характеристики`;

      const properties = createAndAppend(
        'div', {'class': 'properties-container'}, 
        item.properties.map((property) => createPropertyDiv(property))
      );

      appendToModalContent([
        modalHeader, modalImage, modalPrice, itemButton, descriptionHeader, 
        description, propertiesHeader, properties
      ]);
    } else {
      buttonsDiv = createAndSetAttributes('div', {'class': 'buttons-div'});

      const itemButtonRemove = createButton(
        'item-button-remove', 
        () => { handleRemoveFromCart(item); openModal(item); }, 
        `<div>${renderMinusIcon(24)}</div>`
      );
      const itemCount = createAndSetAttributes(
        'div', {'class': 'item-count'}, localStorage.getItem(item['id'])
      );
      const itemButtonAdd = createButton(
        'item-button-add', 
        () => { handleAddToCart(item); openModal(item); }, 
        `<div>${renderPlusIcon(24)}</div>`
      );

      const descriptionHeader = createAndSetAttributes(
        'h3', {'class': 'modal-content-header', 'style': 'font-weight: bold; margin-top: 16px'}
      );
      descriptionHeader.textContent = `Описание`;

      const description = createAndSetAttributes('div', {'style': 'white-space: pre-line;'});
      description.textContent = `${item.description}`;

      const propertiesHeader = createAndSetAttributes(
        'h3', {'class': 'modal-content-header', 'style': 'font-weight: bold; margin-top: 16px'}
      );
      propertiesHeader.textContent = `Характеристики`;

      const properties = createAndAppend(
        'div', {'class': 'properties-container'}, 
        item.properties.map((property) => createPropertyDiv(property))
      );

      appendToModalContent([
        modalHeader, modalImage, modalPrice, buttonsDiv, descriptionHeader, 
        description, propertiesHeader, properties
      ]);
      appendToButtonsDiv([itemButtonRemove, itemCount, itemButtonAdd]);
    }
  } else {
    modalHeader.textContent = item.title;
    modalImage.src = item.image;

    const contentHeader = createAndSetAttributes(
      'h3', {'class': 'modal-content-header', 'style': 'font-weight: bold; margin-top: 16px'}
    );
    contentHeader.textContent = `Содержание`;

    const content = createAndSetAttributes('div', {'style': 'white-space: pre-line; margin-top: 16px'});
    content.textContent = `${item.content}`;

    appendToModalContent([modalHeader, modalImage, contentHeader, content]);
  }

  setTimeout(() => {
    modalOverlay.style.opacity = '1';
  }, 100);

  function createAndSetAttributes(tag, attributes) {
    const element = document.createElement(tag);
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
    return element;
  }

  function createButton(className, clickHandler, innerHTML) {
    const button = createAndSetAttributes('button', {'class': className});
    button.addEventListener('click', clickHandler);
    button.innerHTML = innerHTML.trim();
    return button;
  }

  function createPropertyDiv(property) {
    const propertyDiv = createAndSetAttributes('div', {'class': 'property-item'});
    propertyDiv.innerHTML = `
      <div class="property-name">
        <b>${property.name}</b>
      </div>
      <div class="property-value">
        ${property.value}
      </div>
    `.trim();
    return propertyDiv;
  }

  function createAndAppend(tag, attributes, children) {
    const element = createAndSetAttributes(tag, attributes);
    if (Array.isArray(children)) {
      children.forEach(child => element.appendChild(child));
    } else {
      element.appendChild(children);
    }
    return element;
  }

  function appendToModalContent(elements) {
    elements.forEach(element => modalContent.appendChild(element));
  }

  function appendToButtonsDiv(buttons) {
    buttons.forEach(button => buttonsDiv.appendChild(button));
  }
}

/**
 * Function that closes modal window and delets content inside of it
 */
function closeModal() {
  const modalOverlay = document.getElementById('modal_overlay');
  const modalContent = document.getElementById('modal_content');

  modalContent.style.transform = 'translateY(-50px)';
  modalOverlay.style.opacity = '0';

  modalContent.innerHTML = `
<span id="close_modal" onclick="closeModal()">&times;</span>
  `.trim();

  setTimeout(() => {
    modalOverlay.style.display = 'none';
    modalContent.style.transform = 'translateY(0)';
  }, 500);
}

// --==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--

/**
 * Function that renders Magnifier icon
 * @param {number} size Size (height and width) of an icon 
 * @returns A HTML svg icon code
 */
function renderMagnifierIcon(size) {
  return `
<svg 
  style="width: ${size}px; height: ${size}px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
  fill="#FFFFFF" version="1.1" id="Capa_1" viewBox="0 0 451 451" xml:space="preserve"
>
  <g>
    <path 
      d="M447.05,428l-109.6-109.6c29.4-33.8,47.2-77.9,47.2-126.1C384.65,86.2,298.35,0,192.35,0C86.25,0,0.05,86.3,0.05,192.3   
      s86.3,192.3,192.3,192.3c48.2,0,92.3-17.8,126.1-47.2L428.05,447c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4   
      C452.25,441.8,452.25,433.2,447.05,428z M26.95,192.3c0-91.2,74.2-165.3,165.3-165.3c91.2,0,165.3,74.2,165.3,165.3   
      s-74.1,165.4-165.3,165.4C101.15,357.7,26.95,283.5,26.95,192.3z"
    />
  </g>
</svg>
  `.trim();
}

// --==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--

document.addEventListener("DOMContentLoaded", async function() {
  products = await getProducts();
  news = await getNews();
  news.forEach(addNewsToPage);
  updateCartIcon();
});