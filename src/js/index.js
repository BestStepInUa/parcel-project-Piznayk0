import axios from "axios";

const BASE_API_URL = 'https://books-backend.p.goit.global/books';


const Refs = {
    categoriesList: document.querySelector('.categories-list'),
    bookCaregoriesContainer: document.querySelector('.book-categories-container'),
    bookCardsList: document.querySelector('.book-cards-list')
}

getCategories()
    .then(categories => {
        Refs.categoriesList.innerHTML = createCategoriesListMarkup(categories);
        
    })
    .catch((err) => {
        console.error(err);        
        // Notify.failure('Oops! Something went wrong! Try reloading the page!');
    })

getTopBooks()
    .then(topBooks => {
        topBooks.forEach(category => {
            Refs.bookCaregoriesContainer.insertAdjacentHTML('beforeend', createBooksCategoriesCardsMarkup(category));            
        });
    })  
    .catch((err) => {
        console.error(err);        
        // Notify.failure('Oops! Something went wrong! Try reloading the page!');
    }) 

async function getCategories() {        
    return await axios.get(`${BASE_API_URL}/category-list`)
        .then(resp => {
            console.log('getCategories fetch data:\n', resp.data);
            if (!resp.status) {
                throw new Error(resp.status || resp.statusText);
            }
            return resp.data;                                             
        });
};         

async function getTopBooks() {
    return await axios.get(`${BASE_API_URL}/top-books`)
        .then(resp => {
            console.log('getTopBooks fetch data:\n', resp.data);
            if (!resp.status) {
                throw new Error(resp.status || resp.statusText);
            }
            return resp.data;                                             
        });
}

function createCategoriesListMarkup(categories) {
    const result = categories.map(
        ({ list_name }) =>
            `<li class="categories-list-item">${list_name}</li>`
    ).sort((a,b) => a.localeCompare(b));    
    result.unshift(`<li class="categories-list-item active">All categories</li>`);
    return result.join('');
}

function createBooksCategoriesCardsMarkup({ list_name, books } ) {
    const bookCards = books.map(({ _id, book_image, author, title }) => 
        `<li class="book-cards-list-item">
            <img
            class="book-card-img"
            src="${book_image}"
            alt="${title}"
            data-book-id="${_id}"
            loading="lazy"
            />
            <p class="book-card-title">${title}</p>
            <p class="book-card-author">${author}</p>
        </li>`                               
    ).join('');

    return `<div class="book-category-container">
                <h2 class="book-category-title">${list_name}</h2>
                <ul class="book-cards-list">
                ${bookCards}                  
                </ul>
                <button type="button" class="see-more-btn">See more</button>             
            </div>`     
};
