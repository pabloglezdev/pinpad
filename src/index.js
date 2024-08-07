/* utils */
const checkLength = (value, length) => Boolean(value.length === length);

const writeCharacter = (element, character) => element.setAttribute('value', element.value.concat(character));

const resetValue = element => element.setAttribute('value', '');

const setValue = (element, value) => element.setAttribute('value', value);

const isNumber = value => value >= 0 && value <= 9;

/* functions */

function changeConfirmButton() {
  const confirmButton = document.getElementById('pinpad-keyboard-button-confirm');
  if (confirmButton.textContent === 'OK') {
    confirmButton.textContent = 'Save';
    return;
  }
  confirmButton.textContent = 'OK';
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
}

// eslint-disable-next-line no-unused-vars
function closeModal() {
  const welcomeDialog = document.getElementById('welcome-dialog');
  welcomeDialog.close();

  const welcomeContainer = document.getElementById('welcome-container');
  welcomeContainer.hidden = true;
}

// eslint-disable-next-line no-unused-vars
function toggleVisibility() {
  const visibilityOnIcon = document.getElementById('visibility-on-icon');
  const visibilityOffIcon = document.getElementById('visibility-off-icon');

  visibilityOnIcon.hidden = !visibilityOnIcon.hidden;
  visibilityOffIcon.hidden = !visibilityOffIcon.hidden;

  const pinpadLcd = document.getElementById('pinpad-lcd-input');
  if (pinpadLcd.type === 'text') {
    pinpadLcd.type = 'password';
    return;
  }
  pinpadLcd.type = 'text';
}

function addNumberToPin(value) {
  const keyPressed = isNumber(value) ? value : value.split('-')[3];
  const pinpadLcd = document.getElementById('pinpad-lcd-input');

  if (keyPressed === 'cancel') {
    resetValue(pinpadLcd);
    return;
  }

  if (keyPressed === 'confirm') {
    const isCorrectValue = checkLength(pinpadLcd.value, 6);

    if (!isCorrectValue) {
      setValue(pinpadLcd, 'error');
      return;
    }

    const pin = pinpadLcd.value;
    setValue(pinpadLcd, 'saved');
    savePin(pin);
    return;
  }

  if (pinpadLcd.value === 'wrong') {
    resetValue();
  }

  if (checkLength(pinpadLcd.value, 6)) {
    return;
  }

  writeCharacter(pinpadLcd, keyPressed);
}

function savePin(pin) {
  window.localStorage.setItem('pin', pin);
  window.localStorage.setItem('pin-created-at', new Date().toISOString());

  changeConfirmButton();
}

/* */

document.addEventListener('keydown', event => {
  if (isNumber(event.key)) {
    addNumberToPin(event.key);
  }
});

init();
