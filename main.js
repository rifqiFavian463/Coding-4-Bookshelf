document.addEventListener('DOMContentLoaded',function(){
    const submitBook = document.getElementById('inputBook');
    submitBook.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
    });
});

function addBook() {
    const judulBuku = document.getElementById('inputBookTitle').value;
    const authorBuku = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const generatedID = generateId();

    objekBuku = generateObjekBuku (generatedID, judulBuku, authorBuku, bookYear, false);
    books.push(objekBuku)

    document.dispatchEvent(new Event(RENDER_EVENT))
}
function generateId(){
    return +new Date;
}
function generateObjekBuku (id, title, author, year, isComplete){
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

document.addEventListener(RENDER_EVENT, function(){
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';

    const inputBookIsComplete = document.getElementById("inputBookIsComplete");
    if (inputBookIsComplete.checked == true){
        for (const bookItem of books){
            const bookElement = makeBook(bookItem);
            completeBookshelfList.append(bookElement)
        }
        return inputBookIsComplete;
    }else {
        for ( const bookItem of books){
            const bookElement = makeBook(bookItem);
            if (!bookItem.isComplete)
                incompleteBookshelfList.append(bookElement);
            else 
                completeBookshelfList.append(bookElement);
        }
    }
})

function makeBook(objekBuku) {
    const judulBuku = document.createElement('h3');
    judulBuku.innerText = objekBuku.title;

    const author = document.createElement('p');
    author.innerText = 'Penulis : '+ objekBuku.author;

    const tahun = document.createElement('p');
    tahun.innerText = 'Tahun : '+ objekBuku.year;

    const bookItem = document.createElement('article');
    bookItem.classList.add('book_item');
    bookItem.setAttribute('id', `todo-${objekBuku.id}`)
    bookItem.append(judulBuku, author, tahun);

    if (objekBuku.isComplete){
        const greenButton = document.createElement('button')
        greenButton.classList.add('green');
        greenButton.innerText = 'Belum selesai di Baca';

        const redButton = document.createElement('button')
        redButton.classList.add('red');
        redButton.innerText = 'Hapus Buku';

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('action');
        buttonContainer.append(greenButton, redButton)

        bookItem.append(buttonContainer);
    }else {
        const greenButton = document.createElement('button')
        greenButton.classList.add('green');
        greenButton.innerText = 'Selesai dibaca';
        
        const redButton = document.createElement('button')
        redButton.classList.add('red');
        redButton.innerText = 'Hapus Buku';
        
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('action');
        buttonContainer.append(greenButton, redButton);

        greenButton.addEventListener('click', function(){
            addBooktoComplete(objekBuku.id)
        })

        bookItem.append(buttonContainer);
    }
    return bookItem;
}

function addBooktoComplete(bookId){
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isComplete = true;

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBook(bookId){
    for (const bookItem of books){
        if (bookItem.id == bookId){
            return bookItem;
        }
    }
    return null;
}