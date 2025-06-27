const quote = document.querySelector("#quoteDisplay");
const generateButton = document.querySelector("#newQuote");

const createQuote = document.querySelector("#newQuoteText");
const createCategory = document.querySelector("#newQuoteCategory");

let quoteList = [
    {
        text: "People who think they know everything are a great annoyance to those of us who do.",
        category: "Funny"
    },
    {
        text: "I think music in itself is healing. It's an explosive expression of humanity. It's something we are all touched by. No matter what culture we're from, everyone loves music.",
        category: "Music"
    },
    {
        text: "Music washes away from the soul the dust of everyday life.",
        category: "Music"
    },
];

function random(n) {
    return Math.floor((Math.random() * n));
}

function showRandomQuote() {
    return quoteList[random(quoteList.length)].text;
}

function createAddQuoteForm(text, category) {
    quoteList.push({text: text, category: category})
}

function newQuote() {
    quote.textContent = showRandomQuote();
}

function addQuote() {
    tempQuote = createQuote.value.trim();
    tempCat = createCategory.value.trim();
    if (!tempQuote || !tempCat){
        alert("Please ensure you have filled all the fields.");
    } else {
        quoteList.push({text: tempQuote, category: tempCat})
        createQuote.value = "";
        createCategory.value = "";
    }
}

// innerHTML



