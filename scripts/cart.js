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
 * Function that gets only items from localStorage that do not equal '0'
 * @returns Updates cart object
 */
async function getCart(products) {
  return products.filter((product) => localStorage.getItem(product['id']) !== '0');
}


// --==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--

/**
 * Function that adds a certain product to page
 * @param {any} product 
 */
function addProductToPage(product) {
  const isCartItem = localStorage.getItem(product['id']) === '0';
  const productList = document.querySelector('.product-list-container');

  const listItem = createAndSetAttributes('div', {'class': 'product-item', 'id': product['id']});
  const itemImage = createAndAddEventListener('img', {'src': product.image}, () => openModal(product));
  const itemName = createAndSetAttributes('p', {'class': 'item-title'}, product.name);
  const itemPrice = createAndSetAttributes(
    'p', {'class': 'item-price'},
    `${formatPrice(product.price * parseInt(localStorage.getItem(product.id)))} ${product.currencyLabel}`
  );

  if (isCartItem) {
    const itemButton = createButton(
      'item-button', 
      () => handleAddToCart(product), 
      `
        <div>${renderPlusIcon(24)}</div>
        <div>Добавить</div>
      `
    );

    listItem.appendChild(itemImage);
    listItem.appendChild(itemPrice);
    listItem.appendChild(itemName);
    listItem.appendChild(itemButton);
  } else {
    const buttonsDiv = createAndSetAttributes('div', {'class': 'buttons-div'});
    
    const itemButtonRemove = createButton(
      'item-button-remove', 
      () => handleRemoveFromCart(product), `<div>${renderMinusIcon(24)}</div>`
    );
    const itemCount = createAndSetAttributes(
      'div', {'class': 'item-count'}, localStorage.getItem(product['id'])
    );
    const itemButtonAdd = createButton(
      'item-button-add', () => handleAddToCart(product), `<div>${renderPlusIcon(24)}</div>`
    );

    appendToButtonsDiv([itemButtonRemove, itemCount, itemButtonAdd], buttonsDiv);

    listItem.appendChild(itemImage);
    listItem.appendChild(itemPrice);
    listItem.appendChild(itemName);
    listItem.appendChild(buttonsDiv);
  }

  productList.appendChild(listItem);

  function createAndSetAttributes(tag, attributes, textContent) {
    const element = document.createElement(tag);
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
    if (textContent) {
      element.textContent = textContent;
    }
    return element;
  }

  function createAndAddEventListener(tag, attributes, eventListener) {
    const element = createAndSetAttributes(tag, attributes);
    element.addEventListener('click', eventListener);
    return element;
  }

  function createButton(className, clickHandler, innerHTML) {
    const button = createAndSetAttributes('button', {'class': className});
    button.addEventListener('click', clickHandler);
    button.innerHTML = innerHTML.trim();
    return button;
  }

  function appendToButtonsDiv(elements, parent) {
    elements.forEach(element => parent.appendChild(element));
  }
}

// --==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--

/**
 * Function that adds product to localStorage (Cart)
 * @param {any} product 
 */
function handleAddToCart(product) {
  localStorage.setItem(product['id'], parseInt(localStorage.getItem(product['id'])) + 1);
  console.log(localStorage);

  const productList = document.getElementsByClassName('product-list-container'); 
  console.log(productList[0].children); productList[0].innerHTML = '';

  getCart(products).forEach(addProductToPage);
  updateCartIcon(); updatePage();
}

/**
 * Function that removes product from localStorage (Cart)
 * @param {any} product 
 */
function handleRemoveFromCart(product) {
  localStorage.setItem(product['id'], Math.max(parseInt(localStorage.getItem(product['id'])) - 1, 0));
  console.log(localStorage);

  const productList = document.getElementsByClassName('product-list-container'); 
  console.log(productList[0].children); productList[0].innerHTML = '';

  getCart(products).forEach(addProductToPage);
  updateCartIcon(); updatePage();
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
 * Function that renders Plus icon
 * @param {number} size Size (height and width) of an icon 
 * @returns A HTML svg icon code
 */
function renderPlusIcon(size) {
  return `
<svg 
  style="width: ${size}px; height: ${size}px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
  fill="#FFFFFF" version="1.1" id="Capa_1" viewBox="0 0 490 490" xml:space="preserve"
>
  <g>
    <path 
      d="M227.8,174.1v53.7h-53.7c-9.5,0-17.2,7.7-17.2,17.2s7.7,17.2,17.2,17.2h53.7v53.7c0,9.5,7.7,17.2,17.2,17.2     
      s17.1-7.7,17.1-17.2v-53.7h53.7c9.5,0,17.2-7.7,17.2-17.2s-7.7-17.2-17.2-17.2h-53.7v-53.7c0-9.5-7.7-17.2-17.1-17.2     
      S227.8,164.6,227.8,174.1z"
    />
    <path 
      d="M71.7,71.7C25.5,118,0,179.5,0,245s25.5,127,71.8,173.3C118,464.5,179.6,490,245,490s127-25.5,173.3-71.8     
      C464.5,372,490,310.4,490,245s-25.5-127-71.8-173.3C372,25.5,310.5,0,245,0C179.6,0,118,25.5,71.7,71.7z M455.7,245     
      c0,56.3-21.9,109.2-61.7,149s-92.7,61.7-149,61.7S135.8,433.8,96,394s-61.7-92.7-61.7-149S56.2,135.8,96,96s92.7-61.7,149-61.7     
      S354.2,56.2,394,96S455.7,188.7,455.7,245z"
    />
  </g>
</svg>
  `.trim();
}

/**
 * Function that renders Minus icon
 * @param {number} size Size (height and width) of an icon 
 * @returns A HTML svg icon code
 */
function renderMinusIcon(size) {
  return `  
<svg 
  style="width: ${size}px; height: ${size}px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  fill="#FFFFFF" version="1.1" id="Capa_1" viewBox="0 0 330 330" xml:space="preserve"
>
  <g>
    <path 
      d="M281.633,48.328C250.469,17.163,209.034,0,164.961,0C120.888,0,79.453,17.163,48.289,48.328   
      c-64.333,64.334-64.333,169.011,0,233.345C79.453,312.837,120.888,330,164.962,330c44.073,0,85.507-17.163,116.671-48.328   
      c31.165-31.164,48.328-72.599,48.328-116.672S312.798,79.492,281.633,48.328z M260.42,260.46   
      C234.922,285.957,201.021,300,164.962,300c-36.06,0-69.961-14.043-95.46-39.54c-52.636-52.637-52.636-138.282,0-190.919  
      C95,44.042,128.901,30,164.961,30s69.961,14.042,95.459,39.54c25.498,25.499,39.541,59.4,39.541,95.46   
      S285.918,234.961,260.42,260.46z"
    />
    <path 
      d="M254.961,150H74.962c-8.284,0-15,6.716-15,15s6.716,15,15,15h179.999c8.284,0,15-6.716,15-15S263.245,150,254.961,150z"
    />
  </g>
</svg>
  `.trim();
}

// --==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--

/**
 * Function that formats number (price) to format 123 456.78
 * @param {number} price 
 * @returns A formatted string number
 */
function formatPrice(price) {
  return `${(price).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;
}

// --==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--

function phoneFormat(input) {
  input = input.replace(/\D/g, '').substring(0, 10);
  var size = input.length;
  if (size > 0) { input = "(" + input }
  if (size > 3) { input = input.slice(0,4) + ") " + input.slice(4) }
  if (size > 6) { input = input.slice(0,9) + "-"  + input.slice(9) }
  return input;
}

/**
 * Function that updates page on every action received
 */
function updatePage() {
  console.log(getCart(products));
  const totalPrice = (getCart(products).length === 0)
    ? 0 
    : getCart(products).reduce((sum, item) => {
        return sum + item.price * localStorage.getItem(item.id);
      }, 0);
  if (totalPrice === 0) {
    document.getElementById('delivery_info').setAttribute('style', 'visibility: hidden');
    document.getElementById('empty').setAttribute('style', 'visibility: visible');
    document.getElementById('legal_notice').setAttribute('style', 'visibility: hidden');
  } else {
    document.getElementById('delivery_info').removeAttribute('style');
    document.getElementById('empty').setAttribute('style', 'visibility: hidden');
    document.getElementById('legal_notice').setAttribute('style', 'visibility: visible');
  }
  document.getElementById('total_price').textContent = formatPrice(totalPrice);
}

// --==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--

/**
 * Function that shows snackbar athe the bottom of the screen
 */
function showSnackbar() {
  const snackbar = document.getElementById("snackbar");
  snackbar.className = "show";
  setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 3000);
}

// --==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--

document.addEventListener("DOMContentLoaded", async function() {
  products = await getProducts();
  const cart = await getCart(products);
  console.log(cart);
  cart.forEach((product) => {
    localStorage.setItem(
      product['id'], (localStorage.getItem(product['id']) === 'null') 
        ? '0' : localStorage.getItem(product['id'])
      ); 
  });
  cart.forEach(addProductToPage);
  updatePage(); updateCartIcon();
});