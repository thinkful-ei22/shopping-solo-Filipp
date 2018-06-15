'use strict';

const STORE = {
  items: [
    {id: cuid(), name: 'apples', checked: false},
    {id: cuid(), name: 'oranges', checked: false},
    {id: cuid(), name: 'milk', checked: true},
    {id: cuid(), name: 'bread', checked: false}
  ],
  sortBy: 'alpha',
};

function generateItemElement(item) {
  return `
    <li class="js-item-index-element" data-item-id="${item.id}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');
  const items = shoppingList.map((item) => generateItemElement(item));
  return items.join('');
}



function renderShoppingList(filter) {
  // Make a copy of STORE.items to manipulate for displaying
  let filteredItems = [ ...STORE.items ];
  //console.log(filteredItems);
  if (filter) {
    filteredItems = filteredItems.filter((item) => item.checked === false);
  } 
  console.log(filteredItems);
  // Check STORE.sortBy to determine how to order filteredItems
  if (STORE.sortBy === 'alpha') {
    filteredItems.sort((a, b) => a.name > b.name);
  } else if (STORE.sortBy === 'time') {
    filteredItems.sort((a, b) => a.createdAt < b.createdAt);
  }
  
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  // We're now generating HTML from the filteredItems and not the persistent STORE.items
  const shoppingListItemsString = generateShoppingItemsString(filteredItems);
  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({id: cuid(), name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemId) {
  const item = findItemById(itemId);
  item.checked = !item.checked;
}

function getItemIdFromElement(item) {
  return $(item)
    .closest('.js-item-index-element')
    .data('item-id');
}

function findItemById(id) {
  return STORE.items.find(i => i.id === id);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemId = getItemIdFromElement(event.currentTarget);
    toggleCheckedForListItem(itemId);
    renderShoppingList();
  });
}

function deleteListItem(itemId) {
  const itemIndex = STORE.items.findIndex(i => i.id === itemId);
  STORE.items.splice(itemIndex, 1);
}


function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    const itemId = getItemIdFromElement(event.currentTarget);
    deleteListItem(itemId);
    renderShoppingList();
  });
}

function changeSortBy(sortBy) {
  STORE.sortBy = sortBy;
}

function handleChangeSortBy() {
  $('#js-shopping-list-sortby').change(e => {
    const sortBy = e.target.value;
    changeSortBy(sortBy);
    renderShoppingList();
  });
}

function handleCheckboxClicked() {
  $('input[name=showHide-checkBox]').change(event => {
    if($(event.currentTarget).is(':checked')) {
      //console.log('Box Is Checked');
      renderShoppingList('filter');
    } else {
      //console.log('Box is Unchecked');
      renderShoppingList();
    }
  });
}

function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleChangeSortBy();
  handleCheckboxClicked();
}

$(handleShoppingList);