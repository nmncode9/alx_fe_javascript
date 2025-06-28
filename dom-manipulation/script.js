const quote = document.querySelector("#quoteDisplay");
const generateButton = document.getElementById("newQuote");

const createQuote = document.querySelector("#newQuoteText");
const createCategory = document.querySelector("#newQuoteCategory");

let quoteList = JSON.parse(localStorage.getItem("quoteList")) || [
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
    localStorage.setItem("quoteList", JSON.stringify(quoteList));
    createQuote.value = "";
    createCategory.value = "";
}

function newQuote() {
    const paraQuote = document.createElement("p");
    quote.appendChild(paraQuote);
    quote.innerHTML = `${showRandomQuote()}`;
}

function addQuote() {
    const quote = createQuote.value.trim();
    const category = createCategory.value.trim();

    if (!quote || !category){
        alert("Please ensure you have filled all the fields.");
        return;
    }
    
    createAddQuoteForm(quote, category);
}

function updateExportURL() {

    var blob = new Blob(
        [JSON.stringify(quoteList),],
        {
            type : "application/json;charset=utf-8"
        }
    );

    exportURL = URL.createObjectURL(blob);
    document.getElementById("export").setAttribute("href", exportURL)

}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quoteList.push(...importedQuotes);
        localStorage.setItem("quoteList", JSON.stringify(quoteList));
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

document.addEventListener("DOMContentLoaded", updateExportURL)

generateButton.addEventListener("click", newQuote);


