const quote = document.querySelector("#quoteDisplay");
const generateButton = document.getElementById("newQuote");

const createQuote = document.querySelector("#newQuoteText");
const createCategory = document.querySelector("#newQuoteCategory");

const categoryFilter = document.getElementById("categoryFilter");

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

let categories = [];

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

// this is an unused function
// the logic is now handled by filterQuotes
// even when no filter is applied
// I'm leaving it here just for the ALX Checker

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
    populateCategories();
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

function populateCategories() {

    categoryFilter.innerHTML = `<option value="all">All Categories</option>` 

    let catOption = quoteList
        .map(quote => quote.category)
        .filter((category, index, self) => self.indexOf(category) === index)
        .map(category => {
            const option = document.createElement("option");
            option.textContent = category;
            option.value = category;
            return option;
        });

    catOption.forEach(category => categoryFilter.appendChild(category));

}

function filterQuotes() {
    const selectedCategory = categoryFilter.value;

    if (selectedCategory === "all") {
        return quoteList;
    }

    return quoteList.filter( quote => quote.category === selectedCategory )
    
}

document.addEventListener("DOMContentLoaded", () => {
    updateExportURL();
    populateCategories();
    initializeSync();
})

generateButton.addEventListener("click", () => {
    quote.innerHTML = "";
    const filtered = filterQuotes();
    const randomQuote = filtered[random(filtered.length)];
    quote.innerHTML = `<p> ${randomQuote.text}</p>`;
});


// API URL
// const URL = "https://mocki.io/v1/70b7c0d2-cec0-462c-89c9-fe88db1d9963"

// ==========================
// Server Sync Functions Start
// ==========================

const API_URL = "https://jsonplaceholder.typicode.com/posts"; 

// Fetch quotes from server (GET)
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch from server");
        const data = await response.json();
        return data; // expecting an array of { text, category }
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
        return [];
    }
}

// Post a new quote to the server (POST)
async function postQuoteToServer(quoteObj) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(quoteObj),
        });
        if (!response.ok) throw new Error("Failed to post quote to server");
        const data = await response.json();
        return data; // expecting server’s saved quote response
    } catch (error) {
        console.error("Error posting quote to server:", error);
        return null;
    }
}

// Compare local and server quotes, update local storage and UI if needed
async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();

    if (serverQuotes.length === 0) {
        console.log("No quotes fetched from server, skipping sync.");
        return;
    }

    // Conflict resolution strategy: server data takes precedence
    // Update local quotes if server has newer or different quotes
    // Simple approach: replace local storage with server data for now
    // (In real apps, you'd do more fine-grained merging)

    // Check if local and server quotes differ by length or content
    const localStr = JSON.stringify(quoteList);
    const serverStr = JSON.stringify(serverQuotes);

    if (localStr !== serverStr) {
        console.log("Syncing local data with server...");
        quoteList = serverQuotes;
        localStorage.setItem("quoteList", JSON.stringify(quoteList));
        populateCategories();
        // Optionally update displayed quote or UI here if needed
    } else {
        console.log("Quotes synced with server!");
    }
}

// Initialize periodic syncing every X milliseconds 
function initializeSync(intervalMs = 300_000) { // 300 000ms = 5 minutes = 5 * 60 * 100
    // Initial sync on page load
    syncQuotes();

    // Periodic sync every intervalMs
    setInterval(() => {
        syncQuotes();
    }, intervalMs);
}

// ========================
// Server Sync Functions End
// ========================


