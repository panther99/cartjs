/*
 * Cart.js
 * 
 * Author: Nikola Stojaković (panther99)
 * Description: Simple cart system which uses browser's localStorage.
 */

if (!window.localStorage) {
  alert("Your browser doesn't support local storage!");
  throw new Error("Local storage feature is unsupported.");
}

if (!localStorage.getItem("cartjs")) {
  localStorage.setItem("cartjs", "{}");
}

function CartJS(cart) {
  // name of the cart
  var cartName = cart;

  // current items stored in the cart
  var items = {};

  // counter
  var id = 0;

  // properties of the items stored in cart
  var props = [];

  // options
  var options = {
    development: false
  };

  // returns the name of current CartJS instance
  function getCartName() {
    return cartName;
  }

  // function for defining properties of items stored in cart (should be called right after 
  // creation of the CartJS instance)
  function defineProperties(itemProps) {
    if (!Array.isArray(itemProps)) {
      throw new Error("Invalid parameter provided!");
    }

    for (var i = 0; i < itemProps.length; i++) {
      props.push(itemProps[i]);
      trace("Property '" + itemProps[i] + "' is defined.");
    }
  }
  
  // adds new item to the current CartJS instance
  function addItem(itemProps) {
    if (props.length === 0) {
      throw new Error("You need to define properties of cart items before adding items!");
    }

    // creates empty item
    items[id] = {};
    trace("id: " + id);

    // checks if all provided properties are defined
    for (var i = 0; i < props.length; i++) {
      if (itemProps[props[i]] == null) {
        throw new Error("Property " + props[i] + " is not provided!");
        delete items[id];
      }

      items[id][props[i]] = itemProps[props[i]];
      trace(props[i] + ": " + itemProps[props[i]]);
    }

    // increments the counter
    id++;
  }

  // edits item if it exists in current CartJS instance
  function editItem(id, itemProps) {
    // checks if item exists
    if (items[id] == null) {
      throw new Error("Item with id " + id + " doesn't exist!");
    }

    // loop through provided properties and change item according to them
    for (var prop in itemProps) {
      if (itemProps.hasOwnProperty(prop)) {
        if (props.indexOf(prop) > -1) {
          items[id][prop] = itemProps[prop];
          trace(prop + ": " + itemProps[prop]);
        } else {
          throw new Error("Property " + prop + " isn't defined in properties of CartJS instance!");
        }
      }
    }
  }

  // removes the item with specified id from current CartJS instance
  function removeItem(id) {
    if (items[id] == null) {
      throw new Error("Item with id " + id + " doesn't exists.");
    } else {
      delete items[id];
    }
  }

  // gets the item if it exists in current CartJS instance
  function getItem(id) {
    if (items[id] != null) {
      return items[id];
    } else {
      throw new Error("Item with id " + id + " doesn't exists.");
    }
  }

  // returns all the items currently available in CartJS instance
  function getItems() {
    return items;
  }

  // function for synchronizing local storage and local list of items
  function sync() {
    var localStorageContent = JSON.parse(localStorage.getItem("cartjs"));
    trace("Local storage content: " + localStorageContent);
    if (Object.keys(items).length === 0) {
      // check if object with name of current CartJS instance
      // exists in local storage, obtain it and push it to the items
      if (localStorageContent[cartName] === null) {
        localStorageContent[cartName] = items;
        localStorage.setItem("cartjs", JSON.stringify(localStorageContent));
      } else {
        if (id === 0) {
          // script is just loaded, fetch the data from local storage
          items = localStorageContent[cartName];
        } else {
          // no more items, update the local storage
          localStorageContent[cartName] = items;
          localStorage.setItem("cartjs", JSON.stringify(localStorageContent));
        }
      }
    } else {
      // update the local storage
      localStorageContent[cartName] = items;
      localStorage.setItem("cartjs", JSON.stringify(localStorageContent));
    }
  }

  // provides messages in console on certain actions if development mode is turned on
  function trace(message) {
    if (options.development) {
      console.log(message);
    }
  }

  // turns development mode on
  function developmentModeOn() {
    if (options.development) {
      console.log("Development mode is already turned on.");
    } else {
      options.development = true;
      console.log("Development mode is turned on.");
    }
  }
  
  // turns development mode off
  function developmentModeOff() {
    if (!options.development) {
      console.log("Development mode is already turned off.");
    } else {
      options.development = false;
      console.log("Development mode is turned off.");
    }
  }

  var publicAPI = {
    getCartName: getCartName,
    defineProperties: defineProperties,
    addItem: addItem,
    editItem: editItem,
    removeItem: removeItem,
    getItem: getItem,
    getItems: getItems,
    developmentModeOn: developmentModeOn,
    developmentModeOff: developmentModeOff
  };

  return publicAPI;
}