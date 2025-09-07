function toggleClear(input) {
  const btn = input.parentElement.querySelector('.clear-btn');
  btn.style.display = input.value ? 'block' : 'none';
}

function clearInput(id) {
  const input = document.getElementById(id);
  input.value = '';
  toggleClear(input);
}
