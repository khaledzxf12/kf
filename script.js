let contacts = JSON.parse(localStorage.getItem('contacts')) || [];

const contactForm = document.getElementById('contact-form');
const formTitle = document.getElementById('form-title');
const editIdInput = document.getElementById('edit-id');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const imageInput = document.getElementById('image');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const searchInput = document.getElementById('search-input');
const contactsList = document.getElementById('contacts-list');
const noContacts = document.getElementById('no-contacts');

const defaultAvatar = 'https://via.placeholder.com/150/4f46e5/ffffff?text=User';

function saveContacts() {
  localStorage.setItem('contacts', JSON.stringify(contacts));
}

function renderContacts(searchTerm = '') {
  contactsList.innerHTML = '';
  
  const filteredContacts = contacts.filter(contact => {
    const term = searchTerm.toLowerCase();
    return contact.name.toLowerCase().includes(term) || contact.email.toLowerCase().includes(term);
  });

  if (filteredContacts.length === 0) {
    noContacts.classList.remove('hidden');
  } else {
    noContacts.classList.add('hidden');
    filteredContacts.forEach(contact => {
      const card = document.createElement('div');
      card.className = 'contact-card';
      card.innerHTML = `
        <img class="avatar" src="${contact.image || defaultAvatar}" alt="${contact.name}" onerror="this.src='${defaultAvatar}'">
        <div class="contact-info">
          <h3>${contact.name}</h3>
          <p>${contact.email}</p>
          <p>${contact.phone}</p>
        </div>
        <div class="card-actions">
          <button class="btn btn-secondary" onclick="editContact('${contact.id}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteContact('${contact.id}')">Delete</button>
        </div>
      `;
      contactsList.appendChild(card);
    });
  }
}

function resetForm() {
  contactForm.reset();
  editIdInput.value = '';
  formTitle.textContent = 'Add New Contact';
  submitBtn.textContent = 'Add Contact';
  cancelBtn.classList.add('hidden');
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = editIdInput.value;
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const image = imageInput.value.trim();

  if (id) {
    contacts = contacts.map(contact => 
      contact.id === id ? { id, name, email, phone, image } : contact
    );
  } else {
    const newContact = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      image
    };
    contacts.push(newContact);
  }

  saveContacts();
  renderContacts(searchInput.value);
  resetForm();
});

function editContact(id) {
  const contact = contacts.find(c => c.id === id);
  if (!contact) return;

  editIdInput.value = contact.id;
  nameInput.value = contact.name;
  emailInput.value = contact.email;
  phoneInput.value = contact.phone;
  imageInput.value = contact.image || '';

  formTitle.textContent = 'Edit Contact';
  submitBtn.textContent = 'Save Changes';
  cancelBtn.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteContact(id) {
  contacts = contacts.filter(contact => contact.id !== id);
  saveContacts();
  renderContacts(searchInput.value);
  if (editIdInput.value === id) {
    resetForm();
  }
}

cancelBtn.addEventListener('click', resetForm);

searchInput.addEventListener('input', (e) => {
  renderContacts(e.target.value);
});

renderContacts();