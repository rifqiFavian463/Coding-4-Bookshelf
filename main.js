document.addEventListener("DOMContentLoaded", function () {
  const submitBook = document.getElementById("inputBook");
  submitBook.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()){
    loadDataFromStorage();
  }
});

document.querySelector('#searchSubmit').addEventListener('click', function (event) {
  event.preventDefault();

  const titleQuery = document.querySelector('#searchBookTitle').value;

  if (titleQuery != '') {
    const filteredBooks = books.filter((value) => value.title.includes(titleQuery));
    renderBooks(filteredBooks);
  }
  else document.dispatchEvent(new Event(RENDER_EVENT));
});

const renderBooks = (bookData) => {
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  incompleteBookshelfList.innerHTML = '';

  const completeBookshelfList = document.getElementById('completeBookshelfList');
  completeBookshelfList.innerHTML = '';

  for (const bookItem of bookData) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete) completeBookshelfList.append(bookElement);
    else incompleteBookshelfList.append(bookElement);
  }
}

function addBook() {
  const judulBuku = document.getElementById("inputBookTitle").value;
  const authorBuku = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const inputBookIsComplete = document.getElementById(
    "inputBookIsComplete"
  ).checked;
  const generatedID = generateId();

  objekBuku = generateObjekBuku(
    generatedID,
    judulBuku,
    authorBuku,
    bookYear,
    inputBookIsComplete
  );
  books.push(objekBuku);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function generateId() {
  return +new Date();
}
function generateObjekBuku(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  incompleteBookshelfList.innerHTML = "";

  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  completeBookshelfList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete) completeBookshelfList.append(bookElement);
    else incompleteBookshelfList.append(bookElement);
  }
});

function makeBook(objekBuku) {
  const judulBuku = document.createElement("h3");
  judulBuku.innerText = objekBuku.title;

  const author = document.createElement("p");
  author.innerText = "Penulis : " + objekBuku.author;

  const tahun = document.createElement("p");
  tahun.innerText = "Tahun : " + objekBuku.year;

  const bookItem = document.createElement("article");
  bookItem.classList.add("book_item");
  bookItem.setAttribute("id", `todo-${objekBuku.id}`);
  bookItem.append(judulBuku, author, tahun);

  if (objekBuku.isComplete) {
    const greenButton = document.createElement("button");
    greenButton.classList.add("green");
    greenButton.innerText = "Belum selesai di Baca";

    const redButton = document.createElement("button");
    redButton.classList.add("red");
    redButton.innerText = "Hapus Buku";

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action");
    buttonContainer.append(greenButton, redButton);

    greenButton.addEventListener("click", function () {
      undoBook(objekBuku.id);
    });

    redButton.addEventListener("click", function () {
      removeBook(objekBuku.id);
    });

    bookItem.append(buttonContainer);
  } else {
    const greenButton = document.createElement("button");
    greenButton.classList.add("green");
    greenButton.innerText = "Selesai dibaca";

    const redButton = document.createElement("button");
    redButton.classList.add("red");
    redButton.innerText = "Hapus Buku";

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action");
    buttonContainer.append(greenButton, redButton);

    greenButton.addEventListener("click", function () {
      addBooktoComplete(objekBuku.id);
    });
    redButton.addEventListener("click", function () {
      removeBook(objekBuku.id);
    });

    bookItem.append(buttonContainer);
  }
  return bookItem;
}

function undoBook(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isComplete = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBooktoComplete(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isComplete = true;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id == bookId) {
      return bookItem;
    }
  }
  return null;
}
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKS_SHELF'

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT))
  }
}

function isStorageExist() {
  if (typeof (storage) === undefined) {
    alert ('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function(){
  console.log(localStorage.getItem(STORAGE_KEY))
})

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}

