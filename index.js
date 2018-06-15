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
        
        <form id="js-edit-button-form">
        <label for="edit-button">Edit the Item</label>
        <input type="text" name="edit-button" class="js-edit-button" placeholder="${item.name}">
        <button class="shopping-item-edit js-item-edit">
            <span class="button-label">edit</span>
        </button>

      </form>
        
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');
  const items = shoppingList.map((item) => generateItemElement(item));
  return items.join('');
}



function renderShoppingList(filter, inputValue) {
  let filteredItems = [ ...STORE.items ];
  //console.log(filteredItems);
  if (filter === 'checkboxFilter') {
    filteredItems = filteredItems.filter((item) => item.checked === false);
  } 
  //console.log(filteredItems);
  if (filter === 'buttonFilter') {
    filteredItems = filteredItems.filter((item) => item.name.includes(inputValue) === true);
  }


  if (STORE.sortBy === 'alpha') {
    filteredItems.sort((a, b) => a.name > b.name);
  } else if (STORE.sortBy === 'time') {
    filteredItems.sort((a, b) => a.createdAt < b.createdAt);
  }
  
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(filteredItems);
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
      console.log('Box Is Checked');
      renderShoppingList('checkboxFilter');
    } else {
      console.log('Box is Unchecked');
      renderShoppingList();
    }
  });
}

function handleFilterButtonClicked() {
  $('#js-shopping-list-filter').submit(function(event) {
    event.preventDefault();
    console.log('filterButton Clicked');
    const filterName = $('.js-filter-entry').val();
    $('.js-filter-entry').val('');
    renderShoppingList('buttonFilter', filterName);
  });
}




function handleEditButtonClicked() {
  $('.js-shopping-list').on('click', '.js-item-edit', event => {
    event.preventDefault();
    //console.log('edit Button Clicked');
    
    const editValue = $(event.currentTarget).closest('form').find('input[name=edit-button]').val();
    $('.js-edit-button').val('');
    //console.log(editValue);
    
    const itemId = getItemIdFromElement(event.currentTarget);
    //console.log(itemId);
    
    editListItem(itemId, editValue);
    
    renderShoppingList();
  });
}

function editListItem(itemId, editValue) {
  //console.log(itemId, editValue);
  
  const item = findItemById(itemId);
  //console.log(item);
  item.name = editValue;
}

function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleChangeSortBy();
  handleCheckboxClicked();
  handleFilterButtonClicked();
  handleEditButtonClicked();
}

$(handleShoppingList);