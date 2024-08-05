// const divTest = document.createElement('div');
// const textTest = document.createTextNode('prueba');

// divTest.append(textTest);

// const pinpadModal = document.getElementById('pinpad');
// pinpadModal.append(divTest);

const { localStorage } = window;

const isPinCreated = localStorage.getItem('pin-created-at');
console.log(isPinCreated);

// TODO change condition to is not created
if (!isPinCreated) {
  alert('Pin is not created');
  localStorage.setItem('pin-created-at', new Date().toISOString());

  const welcomeContainer = document.getElementById('welcome-container');
  welcomeContainer.hidden = false;

  const welcomeDialog = document.getElementById('welcome-dialog');
  welcomeDialog.showModal();
}

// eslint-disable-next-line no-unused-vars
function closeModal() {
  const welcomeDialog = document.getElementById('welcome-dialog');
  welcomeDialog.close();

  const welcomeContainer = document.getElementById('welcome-container');
  welcomeContainer.hidden = true;
}
