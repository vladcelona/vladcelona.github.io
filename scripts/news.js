const news = [
  {
    "title": "Breaking News: Example Title 1",
    "image": "https://graceloveslace.com/cdn/shop/products/grace-loves-lace.shop_.wedding-dresses-song-001_small.jpg?v=1634262521",
    "date": "2023-12-07",
    "content": "This is the content for the first news article."
  },
  {
    "title": "Breaking News: Example Title 2",
    "image": "https://graceloveslace.com/cdn/shop/products/grace-loves-lace.shop_.wedding-dresses-song-001_small.jpg?v=1634262521",
    "date": "2023-12-07",
    "content": "This is the content for the second news article."
  },
  {
    "title": "Special Report: Example Title 3",
    "image": "https://graceloveslace.com/cdn/shop/products/grace-loves-lace.shop_.wedding-dresses-song-001_small.jpg?v=1634262521",
    "date": "2023-12-07",
    "content": "This is the content for the third news article."
  }
];

// Function to add a news to the products list
function addNewsToPage(news) {
  var newsList = document.querySelector('.news-list-container');

  var listItem = document.createElement('div');
  listItem.setAttribute('class', 'news-item');

  var itemImage = document.createElement('img');
  itemImage.src = news.image;

  var itemTitle = document.createElement('p');
  itemTitle.setAttribute('class', 'news-title');
  itemTitle.textContent = news.title;

  var itemContent = document.createElement('p');
  itemContent.setAttribute('class', 'item-content');
  itemContent.textContent = news.content.split(/(\s+)/).slice(0, 100).join(' ');

  var itemButton = document.createElement('button');
  itemButton.setAttribute('class', 'item-button');
  itemButton.innerHTML = `
<div>
  <svg style="width: 24px; height: 24px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#FFFFFF" version="1.1" id="Capa_1" viewBox="0 0 451 451" xml:space="preserve">
    <g>
      <path d="M447.05,428l-109.6-109.6c29.4-33.8,47.2-77.9,47.2-126.1C384.65,86.2,298.35,0,192.35,0C86.25,0,0.05,86.3,0.05,192.3   s86.3,192.3,192.3,192.3c48.2,0,92.3-17.8,126.1-47.2L428.05,447c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4   C452.25,441.8,452.25,433.2,447.05,428z M26.95,192.3c0-91.2,74.2-165.3,165.3-165.3c91.2,0,165.3,74.2,165.3,165.3   s-74.1,165.4-165.3,165.4C101.15,357.7,26.95,283.5,26.95,192.3z"/>
    </g>
  </svg>
</div>
<div>Смотреть</div>
  `.trim();
  
  listItem.appendChild(itemImage);
  listItem.appendChild(itemTitle);
  listItem.appendChild(itemContent);
  listItem.appendChild(itemButton);

  newsList.appendChild(listItem);
}

function handleAddToCart(product) {
  localStorage.setItem(product['id'], parseInt(localStorage.getItem(product['id'])) + 1);
  console.log(localStorage);

  const productList = document.getElementsByClassName('product-list-container'); 
  console.log(productList[0].children); productList[0].innerHTML = '';



  updateCartIcon();
}

function handleRemoveFromCart(product) {
  localStorage.setItem(product['id'], Math.max(parseInt(localStorage.getItem(product['id'])) - 1, 0));
  console.log(localStorage);

  const productList = document.getElementsByClassName('product-list-container'); 
  console.log(productList[0].children); productList[0].innerHTML = '';



  updateCartIcon();
}

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

/**
 * Functino that opens modal window and adds content into it
 * @param {any} item 
 */
function openModal(item) {
  const modalOverlay = document.getElementById('modal_overlay');
  const modalContent = document.getElementById('modal_content');
  
  modalOverlay.style.display = 'flex';
  modalContent.innerHTML = `
<span id="close_modal" onclick="closeModal()">&times;</span>
  `.trim();
  
  const modalHeader = document.createElement('h3');
  modalHeader.setAttribute('class', 'modal-header');
  modalHeader.setAttribute('style', 'font-weight: bold');

  const modalImage = document.createElement('img');
  modalImage.setAttribute('class', 'modal-image');

  if (item.id !== null) {
    modalHeader.textContent = item.name;
    modalImage.src = item.image;

    const modalPrice = document.createElement('p');
    modalPrice.setAttribute('class', 'modal-item-price');
    modalPrice.setAttribute('style', 'font-weight: bold; font-size: 20px');
    modalPrice.textContent = `${formatPrice(item.price)} ${item.currencyLabel}`;

    if (localStorage.getItem(item['id']) === '0') {
      var itemButton = document.createElement('button');
      itemButton.setAttribute('class', 'item-button');
      itemButton.addEventListener('click', () => { handleAddToCart(item); openModal(item); });
      itemButton.innerHTML = `
  <div>
    <svg style="width: 24px; height: 24px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#FFFFFF" version="1.1" id="Capa_1" viewBox="0 0 490 490" xml:space="preserve">
      <g>
        <g>
          <g>
            <path d="M227.8,174.1v53.7h-53.7c-9.5,0-17.2,7.7-17.2,17.2s7.7,17.2,17.2,17.2h53.7v53.7c0,9.5,7.7,17.2,17.2,17.2     s17.1-7.7,17.1-17.2v-53.7h53.7c9.5,0,17.2-7.7,17.2-17.2s-7.7-17.2-17.2-17.2h-53.7v-53.7c0-9.5-7.7-17.2-17.1-17.2     S227.8,164.6,227.8,174.1z"/>
            <path d="M71.7,71.7C25.5,118,0,179.5,0,245s25.5,127,71.8,173.3C118,464.5,179.6,490,245,490s127-25.5,173.3-71.8     C464.5,372,490,310.4,490,245s-25.5-127-71.8-173.3C372,25.5,310.5,0,245,0C179.6,0,118,25.5,71.7,71.7z M455.7,245     c0,56.3-21.9,109.2-61.7,149s-92.7,61.7-149,61.7S135.8,433.8,96,394s-61.7-92.7-61.7-149S56.2,135.8,96,96s92.7-61.7,149-61.7     S354.2,56.2,394,96S455.7,188.7,455.7,245z"/>
          </g>
        </g>
      </g>
    </svg>
  </div>
  <div>Добавить</div>
      `.trim();

      const descriptionHeader = document.createElement('h3');
      descriptionHeader.setAttribute('class', 'modal-content-header');
      descriptionHeader.setAttribute('style', 'font-weight: bold; margin-top: 16px');
      descriptionHeader.textContent = `Описание`;

      const description = document.createElement('div');
      description.setAttribute('style', 'white-space: pre-line;');
      description.textContent = `${item.description}`;

      const propertiesHeader = document.createElement('h3');
      propertiesHeader.setAttribute('class', 'modal-content-header');
      propertiesHeader.setAttribute('style', 'font-weight: bold; margin-top: 16px');
      propertiesHeader.textContent = `Характеристики`;

      const properties = document.createElement('div');
      properties.setAttribute('class', 'properties-container');
      
      item.properties.map((property, index) => {
        const propertyDiv = document.createElement('div');
        propertyDiv.setAttribute('class', 'property-item');
        propertyDiv.innerHTML = `
<div class="property-name">
  <b>${property.name}</b>
</div>
<div class="property-value">
  ${property.value}
</div>
        `.trim();
        properties.appendChild(propertyDiv);
      });
      
      modalContent.appendChild(modalHeader);
      modalContent.appendChild(modalImage);
      modalContent.appendChild(modalPrice);
      modalContent.appendChild(itemButton);
      modalContent.appendChild(descriptionHeader);
      modalContent.appendChild(description);
      modalContent.appendChild(propertiesHeader);
      modalContent.appendChild(properties);
    } else {
      var buttonsDiv = document.createElement('div');
      buttonsDiv.setAttribute('class', 'buttons-div');
  
      var itemButtonRemove = document.createElement('button');
      itemButtonRemove.setAttribute('class', 'item-button-remove');
      itemButtonRemove.addEventListener('click', () => { handleRemoveFromCart(item); openModal(item); });
      itemButtonRemove.innerHTML = `
<div>
  <svg style="width: 24px; height: 24px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#FFFFFF" version="1.1" id="Capa_1" viewBox="0 0 330 330" xml:space="preserve">
    <g>
      <path d="M281.633,48.328C250.469,17.163,209.034,0,164.961,0C120.888,0,79.453,17.163,48.289,48.328   c-64.333,64.334-64.333,169.011,0,233.345C79.453,312.837,120.888,330,164.962,330c44.073,0,85.507-17.163,116.671-48.328   c31.165-31.164,48.328-72.599,48.328-116.672S312.798,79.492,281.633,48.328z M260.42,260.46   C234.922,285.957,201.021,300,164.962,300c-36.06,0-69.961-14.043-95.46-39.54c-52.636-52.637-52.636-138.282,0-190.919   C95,44.042,128.901,30,164.961,30s69.961,14.042,95.459,39.54c25.498,25.499,39.541,59.4,39.541,95.46   S285.918,234.961,260.42,260.46z"/>
      <path d="M254.961,150H74.962c-8.284,0-15,6.716-15,15s6.716,15,15,15h179.999c8.284,0,15-6.716,15-15S263.245,150,254.961,150z"/>
    </g>
  </svg>
</div>
      `.trim();
  
      var itemCount = document.createElement('div');
      itemCount.setAttribute('class', 'item-count');
      itemCount.textContent = localStorage.getItem(item['id']);
  
      var itemButtonAdd = document.createElement('button');
      itemButtonAdd.setAttribute('class', 'item-button-add');
      itemButtonAdd.addEventListener('click', () => { handleAddToCart(item); openModal(item); });
      itemButtonAdd.innerHTML = `
<div>
  <svg style="width: 24px; height: 24px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#FFFFFF" version="1.1" id="Capa_1" viewBox="0 0 490 490" xml:space="preserve">
    <g>
      <g>
        <g>
          <path d="M227.8,174.1v53.7h-53.7c-9.5,0-17.2,7.7-17.2,17.2s7.7,17.2,17.2,17.2h53.7v53.7c0,9.5,7.7,17.2,17.2,17.2     s17.1-7.7,17.1-17.2v-53.7h53.7c9.5,0,17.2-7.7,17.2-17.2s-7.7-17.2-17.2-17.2h-53.7v-53.7c0-9.5-7.7-17.2-17.1-17.2     S227.8,164.6,227.8,174.1z"/>
          <path d="M71.7,71.7C25.5,118,0,179.5,0,245s25.5,127,71.8,173.3C118,464.5,179.6,490,245,490s127-25.5,173.3-71.8     C464.5,372,490,310.4,490,245s-25.5-127-71.8-173.3C372,25.5,310.5,0,245,0C179.6,0,118,25.5,71.7,71.7z M455.7,245     c0,56.3-21.9,109.2-61.7,149s-92.7,61.7-149,61.7S135.8,433.8,96,394s-61.7-92.7-61.7-149S56.2,135.8,96,96s92.7-61.7,149-61.7     S354.2,56.2,394,96S455.7,188.7,455.7,245z"/>
        </g>
      </g>
    </g>
  </svg>
</div>
      `.trim();

      const descriptionHeader = document.createElement('h3');
      descriptionHeader.setAttribute('class', 'modal-content-header');
      descriptionHeader.setAttribute('style', 'font-weight: bold; margin-top: 16px');
      descriptionHeader.textContent = `Описание`;

      const description = document.createElement('div');
      description.setAttribute('style', 'white-space: pre-line;');
      description.textContent = `${item.description}`;

      const propertiesHeader = document.createElement('h3');
      propertiesHeader.setAttribute('class', 'modal-content-header');
      propertiesHeader.setAttribute('style', 'font-weight: bold; margin-top: 16px');
      propertiesHeader.textContent = `Характеристики`;

      const properties = document.createElement('div');
      properties.setAttribute('class', 'properties-container');
      
      item.properties.map((property, index) => {
        const propertyDiv = document.createElement('div');
        propertyDiv.setAttribute('class', 'property-item');
        propertyDiv.innerHTML = `
<div class="property-name">
  <b>${property.name}</b>
</div>
<div class="property-value">
  ${property.value}
</div>
        `.trim();
        properties.appendChild(propertyDiv);
      });
  
      buttonsDiv.appendChild(itemButtonRemove);
      buttonsDiv.appendChild(itemCount);
      buttonsDiv.appendChild(itemButtonAdd);

      modalContent.appendChild(modalHeader);
      modalContent.appendChild(modalImage);
      modalContent.appendChild(modalPrice);
      modalContent.appendChild(buttonsDiv);
      modalContent.appendChild(descriptionHeader);
      modalContent.appendChild(description);
      modalContent.appendChild(propertiesHeader);
      modalContent.appendChild(properties);
    }
  } else {
    modalHeader.textContent = item.title;
    modalImage.src = item.image;

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalImage);
  }

  setTimeout(() => {
    modalOverlay.style.opacity = '1';
  }, 100);
}

/**
 * Function that closes modal window and delets content inside of it
 */
function closeModal() {
  const modalOverlay = document.getElementById('modal_overlay');
  const modalContent = document.getElementById('modal_content');

  modalContent.style.transform = 'translateY(-50px)'; // Apply transition to modal content
  modalOverlay.style.opacity = '0';

  modalContent.innerHTML = `
<span id="close_modal" onclick="closeModal()">&times;</span>
  `.trim();

  setTimeout(() => {
    modalOverlay.style.display = 'none';
    modalContent.style.transform = 'translateY(0)'; // Reset transform when closing
  }, 500);
}

document.addEventListener("DOMContentLoaded", function() {
  console.log(localStorage);
  news.forEach(addNewsToPage);
});

function formatPrice(price) {
  return `${(price).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;
}