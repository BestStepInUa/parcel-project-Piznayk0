import axios from "axios";

const BASE_API_URL = 'https://books-backend.p.goit.global/books';


const Refs = {
    categoriesList: document.querySelector('.categories-list'),
    booksPart: document.querySelector('.books-part'),
    booksCaregoriesContainer: document.querySelector('.book-categories-container'),
    booksCaregoryTitle: document.querySelector('.books-part-title'),
    booksCaregoryTitleSpan: document.querySelector('.books-part-title-span')
    // booksCaregoryTitle: document.querySelector('.books-caregory-title'),
    // booksCaregoryTitleSpan: document.querySelector('.books-caregory-title-span')
}

console.log(Refs.categoriesList);
console.log(Refs.booksPart);
console.log(Refs.booksCaregoriesContainer);
console.log(Refs.booksCaregoryTitle);
console.log(Refs.booksCaregoryTitleSpan);


getCategories()
    .then(categories => {
        console.log(categories);
        Refs.categoriesList.innerHTML = createCategoriesListMarkup(categories);
        
    })
    .catch((err) => {
        console.error(err);        
        // Notify.failure('Oops! Something went wrong! Try reloading the page!');
    })

getTopBooks()
    .then(categories => {
        console.log(categories);
        Refs.booksCaregoriesContainer.insertAdjacentHTML('beforeend', createBooksCategoriesCardsMarkup(categories));
    }                       
    )  
    .catch((err) => {
        console.error(err);        
        // Notify.failure('Oops! Something went wrong! Try reloading the page!');
    })

Refs.categoriesList.addEventListener('click', onLoadCategory);

function onLoadCategory(evt) {
    if (evt.target.nodeName !== "LI") {
        return;
    }
    const categoryName = evt.target.dataset.categoryName;        
    // const categoryNameArr = categoryName.split(' ');
    // console.log(categoryNameArr);
    // const categoryTitleSpan = categoryNameArr.pop();
    // console.log(categoryTitleSpan);
    // const mainCategoryTitlePart = categoryNameArr.join(' ');
    // console.log(mainCategoryTitlePart);
    
    getBooksInCategory(categoryName)
        .then(books => {
            console.log(books);
            Refs.booksPart.innerHTML = 
            `${createBooksCaregoryTitle(categoryName)}
            <div class="book-category-container">
                <ul class="book-cards-list">
                ${createBooksInCategoryMarkup(books)}                  
                </ul>                             
            </div>`            
        })
        .catch((err) => {
            console.error(err);
            // Notify.failure('Oops! Something went wrong! Try reloading the page!');
        });           
}

async function getCategories() {        
    return await axios.get(`${BASE_API_URL}/category-list`)
        .then(resp => {
            if (!resp.status) {
                throw new Error(resp.status || resp.statusText);
            }
            return resp.data;                                             
        });
};         

async function getTopBooks() {
    return await axios.get(`${BASE_API_URL}/top-books`)
        .then(resp => {
            if (!resp.status) {
                throw new Error(resp.status || resp.statusText);
            }
            return resp.data;                                             
        });
}

async function getBooksInCategory(category) {
    return await axios.get(`${BASE_API_URL}/category?category=${category}`)
        .then(resp => {
            if (!resp.status) {
                throw new Error(resp.status || resp.statusText);
            }
            return resp.data;                                             
        });
}

function createCategoriesListMarkup(categories) {
    const result = categories.map(
        ({ list_name }) =>
            `<li class="categories-list-item" data-category-name="${list_name}">${list_name}</li>`
    ).sort((a,b) => a.localeCompare(b));    
    result.unshift(`<li class="categories-list-item active" data-category-name="All categories">All categories</li>`);
    return result.join('');
}

function createBooksCategoriesCardsMarkup(categories) {
    return categories.map(({ list_name, books }) => {
        const booksCards = books.map(({ _id, book_image, author, title }) =>
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
                ${booksCards}                  
                </ul>
                <button type="button" class="see-more-btn">See more</button>             
            </div>`
    }).join('');
}

function createBooksCaregoryTitle(categoryName) {
    const categoryNameArr = categoryName.split(' ');
    const categoryTitleSpan = categoryNameArr.pop();
    const mainCategoryTitlePart = categoryNameArr.join(' ');
    return `<h1 class="books-part-title">${mainCategoryTitlePart} <span class="books-part-title-span">${categoryTitleSpan}</span>`
}

function createBooksInCategoryMarkup(books) {
    return books.map(({ _id, book_image, author, title }) =>
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

}