import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

Notify.init({
    width: '300px',
    position: 'right-top',
    fontSize: '16px',
    fontFamily: 'DM Sans',
    timeout: 5000,             
});

const BASE_API_URL = 'https://books-backend.p.goit.global/books';

const Refs = {
    categoriesList: document.querySelector('.categories-list'),
    booksPart: document.querySelector('.books-part'),
    booksCaregoriesContainer: document.querySelector('.book-categories-container')    
}

getCategories()
    .then(categories => {
        Refs.categoriesList.innerHTML = createCategoriesListMarkup(categories);
    })
    .catch((err) => {
        console.error(err);
        Notify.failure('Oops! Something went wrong! Try reloading the page!');
    });

getTopBooks()
    .then(categories => {
        if (!categories || categories.length === 0) {
            Refs.booksCaregoriesContainer.insertAdjacentHTML('afterbegin',
                `<p class="books-not-found-message">No books were found in this category😒<br> Please, try other categories😉</p>
                <img
                class="books-not-found-img"
                srcset="./img/empty-bin@1x.png 1x, ./img/empty-bin@2x.png 2x"
                src="./img/empty-bin@1x.png"
                alt="Books not found"
                height="241"
                width="332"
                />`
            );
            return;
        }    
        
        Refs.booksCaregoriesContainer.insertAdjacentHTML('beforeend', createBooksCategoriesCardsMarkup(categories));
    }
    )
    .catch((err) => {
        console.error(err);
        Notify.failure('Oops! Something went wrong! Try reloading the page!');
    });

Refs.categoriesList.addEventListener('click', onLoadCategory);
Refs.booksCaregoriesContainer.addEventListener('click', onSeeMoreBtn);

function onLoadCategory(evt) {
    if (evt.target.nodeName !== "LI") {
        return;
    }

    window.scrollTo(0, 0);

    const curr = evt.target;
    curr.parentElement.querySelector('.categories-list-item.active').classList.remove('active');
    curr.classList.add('active');

    const categoryName = evt.target.dataset.categoryName;
    
    if (categoryName === 'All categories') {
        getTopBooks()
            .then(categories => {
                 if (!categories || categories.length === 0) {                      
                     Refs.booksPart.innerHTML =
                        `<h1 class="books-part-title">Best Sellers
                        <span class="books-part-title-span"> Books</span>
                        </h1>
                        <div class="book-categories-container">
                        <p class="books-not-found-message">No books were found in this category😒<br> Please, try other categories😉</p>
                        <img
                        class="books-not-found-img"
                        srcset="./img/empty-bin@1x.png 1x, ./img/empty-bin@2x.png 2x"
                        src="./img/empty-bin@1x.png"
                        alt="Books not found"
                        height="241"
                        width="332"
                        />
                        </div>`
                     return;
                }    
            
                Refs.booksPart.innerHTML = 
                `<h1 class="books-part-title">Best Sellers
                <span class="books-part-title-span"> Books</span>
                </h1>
                <div class="book-categories-container">
                ${createBooksCategoriesCardsMarkup(categories)}
                </div>`
            }
            )
            .catch((err) => {
                console.error(err);
                Notify.failure('Oops! Something went wrong! Try reloading the page!');
            });
        return
    }    
           
    getBooksInCategory(categoryName)
        .then(books => {
            if (!books || books.length === 0) {
                Refs.booksPart.innerHTML = 
                `${createBooksCaregoryTitle(categoryName)}
                <div class="book-category-wrapper">
                <p class="books-not-found-message">No books were found in this category😒<br> Please, try other categories😉</p>
                <img
                class="books-not-found-img"
                srcset="./img/empty-bin@1x.png 1x, ./img/empty-bin@2x.png 2x"
                src="./img/empty-bin@1x.png"
                alt="Books not found"
                height="241"
                width="332"
                />                                
                </div>`
                return;
            }
            Refs.booksPart.innerHTML = 
            `${createBooksCaregoryTitle(categoryName)}
            <div class="book-category-wrapper">
                <ul class="book-cards-list book-cards-list-one-category">
                ${createBooksInCategoryMarkup(books)}                  
                </ul>                             
            </div>`            
        })
        .catch((err) => {
            console.error(err);
            Notify.failure('Oops! Something went wrong! Try reloading the page!');
        });           
};

function onSeeMoreBtn(evt) {
    if (evt.target.nodeName !== "BUTTON") {
        return;
    }

    window.scrollTo(0, 0);

    const btn = evt.target;
    const categoryName = btn.parentElement.querySelector('.book-category-title').textContent;
    
    getBooksInCategory(categoryName)
        .then(books => {
            if (!books || books.length === 0) {
                Refs.booksPart.innerHTML = 
                `${createBooksCaregoryTitle(categoryName)}
                <div class="book-category-wrapper">
                <p class="books-not-found-message">No books were found in this category😒<br> Please, try other categories😉</p>
                <img
                class="books-not-found-img"
                srcset="./img/empty-bin@1x.png 1x, ./img/empty-bin@2x.png 2x"
                src="./img/empty-bin@1x.png"
                alt="Books not found"
                height="241"
                width="332"
                />                                
                </div>`
                return;
            }
            Refs.booksPart.innerHTML = 
            `${createBooksCaregoryTitle(categoryName)}
            <div class="book-category-wrapper">
                <ul class="book-cards-list book-cards-list-one-category">
                ${createBooksInCategoryMarkup(books)}                  
                </ul>                             
            </div>`            
        })
        .catch((err) => {
            console.error(err);
            Notify.failure('Oops! Something went wrong! Try reloading the page!');
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
};

async function getBooksInCategory(category) {
    return await axios.get(`${BASE_API_URL}/category?category=${category}`)
        .then(resp => {
            if (!resp.status) {
                throw new Error(resp.status || resp.statusText);
            }
            return resp.data;                                             
        });
};

function createCategoriesListMarkup(categories) {
    const result = categories.map(
        ({ list_name }) =>
            `<li class="categories-list-item" data-category-name="${list_name}">${list_name}</li>`
    ).sort((a,b) => a.localeCompare(b));    
    result.unshift(`<li class="categories-list-item active" data-category-name="All categories">All categories</li>`);
    result.push(`<li class="categories-list-item active" data-category-name="Bug categoty for test">All categories</li>`);
    return result.join('');
};

function createBooksCategoriesCardsMarkup(categories) {
    return categories.map(({ list_name, books }) => {              
        return `<div class="book-category-container">
                <h2 class="book-category-title">${list_name}</h2>
                <ul class="book-cards-list">
                ${createBooksInCategoryMarkup(books)}                  
                </ul>
                <button type="button" class="see-more-btn">See more</button>             
            </div>`
    }).join('');
};

function createBooksCaregoryTitle(categoryName) {
    const categoryNameArr = categoryName.split(' ');
    const categoryTitleSpan = categoryNameArr.pop();
    const mainCategoryTitlePart = categoryNameArr.join(' ');
    return `<h1 class="books-part-title">${mainCategoryTitlePart} <span class="books-part-title-span">${categoryTitleSpan}</span></h1>`
};

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
};