/* utils */
const checkLength = (value, length) => Boolean(value.length === length);

const resetValue = element => element.setAttribute('value', '');

const setValue = (element, value) => element.setAttribute('value', value);

const isNumber = value => value >= 0 && value <= 9;

/* functions */

function changeConfirmButton() {
  const confirmKey = document.getElementById('confirm-key');
  if (confirmKey.textContent === 'OK') {
    confirmKey.textContent = 'Save';
    return;
  }
  confirmKey.textContent = 'OK';
}

function init() {
  const isPinCreated = window.localStorage.getItem('pin');

  if (!isPinCreated) {
    const welcomeContainer = document.getElementById('welcome-container');
    welcomeContainer.hidden = false;

    const welcomeDialog = document.getElementById('welcome-dialog');
    welcomeDialog.showModal();

    return;
  }

  changeConfirmButton();

  globalPin = '';

  const pinpadLcdInput = document.getElementById('pinpad-lcd-input');
  setValue(pinpadLcdInput, '');

  const insertPinContainer = document.getElementById('insert-container');
  insertPinContainer.hidden = false;

  const insertPinDialog = document.getElementById('insert-dialog');
  insertPinDialog.showModal();
}

function hideMessage() {
  const messageContainer = document.getElementById('message-container');
  messageContainer.hidden = true;
}

function setMessage({ type, message }) {
  const messageContainer = document.getElementById('message-container');
  messageContainer.hidden = false;

  const messageElement = document.getElementById('message');
  messageElement.classList.add(`message--${type}`);
  messageElement.textContent = message;
}

// eslint-disable-next-line no-unused-vars
function closeModal(id) {
  const elementName = id.split('-')[0];

  const elementDialog = document.getElementById(`${elementName}-dialog`);
  elementDialog.close();

  const elementContainer = document.getElementById(`${elementName}-container`);
  elementContainer.hidden = true;
}

// eslint-disable-next-line no-unused-vars
function toggleVisibility() {
  const visibilityOnIcon = document.getElementById('visibility-on-icon');
  visibilityOnIcon.hidden = !visibilityOnIcon.hidden;

  const visibilityOffIcon = document.getElementById('visibility-off-icon');
  visibilityOffIcon.hidden = !visibilityOffIcon.hidden;

  const pinpadLcdInput = document.getElementById('pinpad-lcd-input');

  if (pinpadLcdInput.value === globalPin) {
    const pinWithAsterisks = '*'.repeat(globalPin.length);
    setValue(pinpadLcdInput, pinWithAsterisks);
    return;
  }

  setValue(pinpadLcdInput, globalPin);
}

function addNumberToPin(value) {
  const keyPressed = isNumber(value) ? value : value.split('-')[3];
  const pinpadLcdInput = document.getElementById('pinpad-lcd-input');

  if (keyPressed === 'cancel') {
    globalPin = '';
    resetValue(pinpadLcdInput);
    return;
  }

  if (keyPressed === 'confirm') {
    const isCorrectValue = checkLength(pinpadLcdInput.value, 6);

    if (!isCorrectValue) {
      setMessage({ type: 'warn', message: `El pin debe contener 6 dígitos.` });

      setValue(pinpadLcdInput, 'error');
      return;
    }

    hideMessage();
    const pin = pinpadLcdInput.value;
    const isPinCreated = window.localStorage.getItem('pin');

    if (!isPinCreated) {
      setValue(pinpadLcdInput, 'saved');
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

  globalPin = globalPin.concat(keyPressed);
  setValue(pinpadLcdInput, globalPin);
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

/* */

document.addEventListener('keydown', event => {
  if (isNumber(event.key)) {
    addNumberToPin(event.key);
  }
});

let globalPin = '';
let remainingAttempts = 3;

init();
