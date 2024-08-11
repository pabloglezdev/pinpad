/* utils */

const checkLength = (value, length) => Boolean(value.length === length);

const resetValue = element => element.setAttribute('value', '');

const setValue = (element, value) => element.setAttribute('value', value);

const isNumber = value => value >= 0 && value <= 9;

const setTextContent = (element, value) => (element.textContent = value);

const hideElement = element => element.classList.add('hidden');

const showElement = element => element.classList.remove('hidden');

const convertStringToAsterisk = value => '*'.repeat(value.length);

/* functions */

function changeConfirmButton() {
  const confirmKey = document.getElementById('confirm-key');
  if (confirmKey.textContent === 'OK') {
    setTextContent(confirmKey, 'Save');
    return;
  }
  setTextContent(confirmKey, 'OK');
}

function init() {
  const isPinCreated = window.localStorage.getItem('pin');

  if (!isPinCreated) {
    const welcomeContainer = document.getElementById('welcome-container');
    showElement(welcomeContainer);

    const welcomeDialog = document.getElementById('welcome-dialog');
    welcomeDialog.showModal();

    return;
  }

  changeConfirmButton();

  globalPin = '';

  const pinpadLcdNumbersContainer = document.getElementById('pinpad-lcd-numbers-container');
  showElement(pinpadLcdNumbersContainer);

  const pinpadLcdInput = document.getElementById('pinpad-lcd-input');
  setValue(pinpadLcdInput, '');

  const pinpadLcdMessageContainer = document.getElementById('pinpad-lcd-message-container');
  hideElement(pinpadLcdMessageContainer);

  const insertPinContainer = document.getElementById('insert-container');
  showElement(insertPinContainer);

  const insertPinDialog = document.getElementById('insert-dialog');
  insertPinDialog.showModal();
}

function hideMessage() {
  const messageContainer = document.getElementById('message-container');
  hideElement(messageContainer);
}

function setMessage({ type, message }) {
  const messageContainer = document.getElementById('message-container');
  showElement(messageContainer);

  const messageElement = document.getElementById('message');
  messageElement.classList.add(`message--${type}`);
  setTextContent(messageElement, message);
}

function closeModal(id) {
  console.log(id);
  const elementName = id.split('-')[0];

  const elementDialog = document.getElementById(`${elementName}-dialog`);
  elementDialog.close();

  const elementContainer = document.getElementById(`${elementName}-container`);
  hideElement(elementContainer);

  isModalShown = false;
}

function toggleVisibility() {
  const visibilityOnIcon = document.getElementById('visibility-on-icon');
  visibilityOnIcon.hidden = !visibilityOnIcon.hidden;

  const visibilityOffIcon = document.getElementById('visibility-off-icon');
  visibilityOffIcon.hidden = !visibilityOffIcon.hidden;

  const pinpadLcdInput = document.getElementById('pinpad-lcd-input');

  if (pinpadLcdInput.value === globalPin) {
    isPasswordShown = false;
    setValue(pinpadLcdInput, convertStringToAsterisk(pinpadLcdInput.value));
    return;
  }

  isPasswordShown = true;
  setValue(pinpadLcdInput, globalPin);
}

function onKeyPress(value) {
  const keyPressed = isNumber(value) ? value : value.split('-')[3];

  const pinpadLcdInput = document.getElementById('pinpad-lcd-input');
  const pinpadLcdMessage = document.getElementById('pinpad-lcd-message');
  const pinpadLcdNumbersContainer = document.getElementById('pinpad-lcd-numbers-container');
  const pinpadLcdMessageContainer = document.getElementById('pinpad-lcd-message-container');

  if (keyPressed === 'cancel' || value === 'cancel') {
    globalPin = '';
    resetValue(pinpadLcdInput);
    return;
  }

  if (keyPressed === 'confirm' || value === 'confirm') {
    const isCorrectValue = checkLength(pinpadLcdInput.value, 6);

    if (!isCorrectValue) {
      setMessage({ type: 'warn', message: `El pin debe contener 6 dígitos.` });

      hideElement(pinpadLcdNumbersContainer);

      setTextContent(pinpadLcdMessage, 'error');
      showElement(pinpadLcdMessageContainer);
      return;
    }

    hideMessage();

    const pin = pinpadLcdInput.value;
    const isPinCreated = window.localStorage.getItem('pin');

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
  const actualPin = window.localStorage.getItem('pin');

  if (pin !== actualPin) {
    remainingAttempts--;

    if (remainingAttempts === 0) {
      window.location.replace('https://policia.es/');
      return;
    }

    const pinpadLcdInput = document.getElementById('pinpad-lcd-input');
    setValue(pinpadLcdInput, '');
    globalPin = '';

    setMessage({ type: 'warn', message: `¡El pin no es correcto, te quedan ${remainingAttempts} intentos!` });
    return;
  }

  window.location.replace('https://www.codebay-innovation.com/');
}

/* global */

let globalPin = '';
let remainingAttempts = 3;
let isPasswordShown = true;
let isModalShown = true;

/* init */

document.addEventListener('keydown', event => {
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

init();

/* export */

export {
  isModalShown,
  isNumber,
  changeConfirmButton,
  init,
  hideMessage,
  setMessage,
  closeModal,
  toggleVisibility,
  onKeyPress,
  savePin,
  checkPin,
};
