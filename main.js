document.addEventListener('DOMContentLoaded', function () {
  const submitBook = document.getElementById('inputBook');
  submitBook.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });
  const searchBook = document.getElementById('searchBook');
  searchBook.addEventListener('submit', function(event){
    event.preventDefault();
    const searchValue = document.getElementById('searchBookTitle').toLowerCase();
    console.log(filterResults(books,searchValue));
  })
});

function filterResults(list, keyword) {
  return list.filter((buku) => buku.title.toLowerCase().includes(keyword));
}

function addBook() {
  const judulBuku = document.getElementById('inputBookTitle').value;
  const authorBuku = document.getElementById('inputBookAuthor').value;
  const bookYear = document.getElementById('inputBookYear').value;
  const inputBookIsComplete = document.getElementById("inputBookIsComplete").checked;
  const generatedID = generateId();

  objekBuku = generateObjekBuku(generatedID, judulBuku, authorBuku, bookYear, inputBookIsComplete);
  books.push(objekBuku)

  document.dispatchEvent(new Event(RENDER_EVENT))
}
function generateId() {
  return +new Date;
}
function generateObjekBuku(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  }
}

const books = [];
const RENDER_EVENT = 'render-book';

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  incompleteBookshelfList.innerHTML = '';

  const completeBookshelfList = document.getElementById('completeBookshelfList');
  completeBookshelfList.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete) completeBookshelfList.append(bookElement);
    else incompleteBookshelfList.append(bookElement);
  }
})

function makeBook(objekBuku) {
  const judulBuku = document.createElement('h3');
  judulBuku.innerText = objekBuku.title;

  const author = document.createElement('p');
  author.innerText = 'Penulis : ' + objekBuku.author;

  const tahun = document.createElement('p');
  tahun.innerText = 'Tahun : ' + objekBuku.year;

  const bookItem = document.createElement('article');
  bookItem.classList.add('book_item');
  bookItem.setAttribute('id', `todo-${objekBuku.id}`)
  bookItem.append(judulBuku, author, tahun);

  if (objekBuku.isComplete) {
    const greenButton = document.createElement('button')
    greenButton.classList.add('green');
    greenButton.innerText = 'Belum selesai di Baca';

    const redButton = document.createElement('button')
    redButton.classList.add('red');
    redButton.innerText = 'Hapus Buku';

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');
    buttonContainer.append(greenButton, redButton)

    redButton.addEventListener('click', function(){
      removeBook(objekBuku.id)
    })

    bookItem.append(buttonContainer);
  } else {
    const greenButton = document.createElement('button')
    greenButton.classList.add('green');
    greenButton.innerText = 'Selesai dibaca';

    const redButton = document.createElement('button')
    redButton.classList.add('red');
    redButton.innerText = 'Hapus Buku';

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');
    buttonContainer.append(greenButton, redButton);

    greenButton.addEventListener('click', function () {
      addBooktoComplete(objekBuku.id)
    })
    redButton.addEventListener('click', function(){
      removeBook(objekBuku.id)
    })

    bookItem.append(buttonContainer);
  }
  return bookItem;
}

function addBooktoComplete(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isComplete = true;

  document.dispatchEvent(new Event(RENDER_EVENT));
}
function removeBook(bookId){
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id == bookId) {
      return bookItem;
    }
  }
  return null;
}
function findBookIndex(bookId){
  for (const index in books){
    if (books[index].id === bookId){
      return index;
    }
  }
  return -1;
}