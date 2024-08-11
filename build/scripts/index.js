"use strict";

/* utils */

var checkLength = function checkLength(value, length) {
  return Boolean(value.length === length);
};
var resetValue = function resetValue(element) {
  return element.setAttribute('value', '');
};
var setValue = function setValue(element, value) {
  return element.setAttribute('value', value);
};
var isNumber = function isNumber(value) {
  return value >= 0 && value <= 9;
};
var setTextContent = function setTextContent(element, value) {
  return element.textContent = value;
};
var hideElement = function hideElement(element) {
  return element.classList.add('hidden');
};
var showElement = function showElement(element) {
  return element.classList.remove('hidden');
};
var convertStringToAsterisk = function convertStringToAsterisk(value) {
  return '*'.repeat(value.length);
};

/* functions */

function changeConfirmButton() {
  var confirmKey = document.getElementById('confirm-key');
  if (confirmKey.textContent === 'OK') {
    setTextContent(confirmKey, 'Save');
    return;
  }
  setTextContent(confirmKey, 'OK');
}
function init() {
  var isPinCreated = window.localStorage.getItem('pin');
  if (!isPinCreated) {
    var welcomeContainer = document.getElementById('welcome-container');
    showElement(welcomeContainer);
    var welcomeDialog = document.getElementById('welcome-dialog');
    welcomeDialog.showModal();
    return;
  }
  changeConfirmButton();
  globalPin = '';
  var pinpadLcdNumbersContainer = document.getElementById('pinpad-lcd-numbers-container');
  showElement(pinpadLcdNumbersContainer);
  var pinpadLcdInput = document.getElementById('pinpad-lcd-input');
  setValue(pinpadLcdInput, '');
  var pinpadLcdMessageContainer = document.getElementById('pinpad-lcd-message-container');
  hideElement(pinpadLcdMessageContainer);
  var insertPinContainer = document.getElementById('insert-container');
  showElement(insertPinContainer);
  var insertPinDialog = document.getElementById('insert-dialog');
  insertPinDialog.showModal();
}
function hideMessage() {
  var messageContainer = document.getElementById('message-container');
  hideElement(messageContainer);
}
function setMessage(_ref) {
  var type = _ref.type,
    message = _ref.message;
  var messageContainer = document.getElementById('message-container');
  showElement(messageContainer);
  var messageElement = document.getElementById('message');
  messageElement.classList.add("message--".concat(type));
  setTextContent(messageElement, message);
}

// eslint-disable-next-line no-unused-vars
function closeModal(id) {
  var elementName = id.split('-')[0];
  var elementDialog = document.getElementById("".concat(elementName, "-dialog"));
  elementDialog.close();
  var elementContainer = document.getElementById("".concat(elementName, "-container"));
  hideElement(elementContainer);
  isModalShown = false;
}

// eslint-disable-next-line no-unused-vars
function toggleVisibility() {
  var visibilityOnIcon = document.getElementById('visibility-on-icon');
  visibilityOnIcon.hidden = !visibilityOnIcon.hidden;
  var visibilityOffIcon = document.getElementById('visibility-off-icon');
  visibilityOffIcon.hidden = !visibilityOffIcon.hidden;
  var pinpadLcdInput = document.getElementById('pinpad-lcd-input');
  if (pinpadLcdInput.value === globalPin) {
    isPasswordShown = false;
    setValue(pinpadLcdInput, convertStringToAsterisk(pinpadLcdInput.value));
    return;
  }
  isPasswordShown = true;
  setValue(pinpadLcdInput, globalPin);
}
function onKeyPress(value) {
  var keyPressed = isNumber(value) ? value : value.split('-')[3];
  var pinpadLcdInput = document.getElementById('pinpad-lcd-input');
  var pinpadLcdMessage = document.getElementById('pinpad-lcd-message');
  var pinpadLcdNumbersContainer = document.getElementById('pinpad-lcd-numbers-container');
  var pinpadLcdMessageContainer = document.getElementById('pinpad-lcd-message-container');
  if (keyPressed === 'cancel' || value === 'cancel') {
    globalPin = '';
    resetValue(pinpadLcdInput);
    return;
  }
  if (keyPressed === 'confirm' || value === 'confirm') {
    var isCorrectValue = checkLength(pinpadLcdInput.value, 6);
    if (!isCorrectValue) {
      setMessage({
        type: 'warn',
        message: "El pin debe contener 6 d\xEDgitos."
      });
      hideElement(pinpadLcdNumbersContainer);
      setTextContent(pinpadLcdMessage, 'error');
      showElement(pinpadLcdMessageContainer);
      return;
    }
    hideMessage();
    var pin = pinpadLcdInput.value;
    var isPinCreated = window.localStorage.getItem('pin');
    if (!isPinCreated) {
      hideElement(pinpadLcdNumbersContainer);
      showElement(pinpadLcdMessageContainer);
      setTextContent(pinpadLcdMessage, 'saved');
      savePin(pin);
      return;
    }
    checkPin(pin);
    return;
  }
  if (pinpadLcdInput.value === 'wrong') {
    resetValue();
  }
  if (checkLength(pinpadLcdInput.value, 6)) {
    return;
  }
  hideElement(pinpadLcdMessageContainer);
  globalPin = globalPin.concat(keyPressed);
  showElement(pinpadLcdNumbersContainer);
  isPasswordShown ? setValue(pinpadLcdInput, globalPin) : setValue(pinpadLcdInput, convertStringToAsterisk(globalPin));
}
function savePin(pin) {
  window.localStorage.setItem('pin', pin);
  window.localStorage.setItem('pin-created-at', new Date().toISOString());
  setTimeout(init, 3000);
}
function checkPin(pin) {
  var actualPin = window.localStorage.getItem('pin');
  if (pin !== actualPin) {
    remainingAttempts--;
    if (remainingAttempts === 0) {
      window.location.replace('https://policia.es/');
      return;
    }
    var pinpadLcdInput = document.getElementById('pinpad-lcd-input');
    setValue(pinpadLcdInput, '');
    globalPin = '';
    setMessage({
      type: 'warn',
      message: "\xA1El pin no es correcto, te quedan ".concat(remainingAttempts, " intentos!")
    });
    return;
  }
  window.location.replace('https://www.codebay-innovation.com/');
}

/* */

document.addEventListener('keydown', function (event) {
  event.preventDefault();
  if (isModalShown) {
    return;
  }
  if (isNumber(event.key)) {
    onKeyPress(event.key);
  }
  if (event.key === 'Enter') {
    onKeyPress('confirm');
  }
  if (event.key === 'Escape' || event.key === 'Esc') {
    onKeyPress('cancel');
  }
});
var globalPin = '';
var remainingAttempts = 3;
var isPasswordShown = true;
var isModalShown = true;
init();