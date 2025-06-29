# Dynamic Quote Generator with Server Sync

## Overview

This is a dynamic quote generator web application that allows users to:

- View random quotes
- Add new quotes
- Filter quotes by category
- Import/export quotes
- Synchronize with a mock server

Quotes are stored locally using `localStorage` and periodically synchronized with a mock API server. This project simulates client-server data consistency, local caching, and conflict resolution.


## Features

- Display a random quote
- Filter by category
- Add a quote (text + category)
- Save quotes in `localStorage`
- Import/export quotes from/to JSON
- Dynamic category filtering
- Sync quotes with a remote server API
- Conflict detection between local and remote data
- Automatic synchronization every 5 minutes (300,000 ms)


## Data Structure

Each quote is stored as an object with the following structure:

```json
{
  "text": "Example quote text",
  "category": "CategoryName"
}
```

All quotes are stored in a list called `quoteList`.


## Components and Functions

### HTML Elements Referenced

- `#quoteDisplay`: Area where the current quote is shown
- `#newQuote`: Button to generate a new quote
- `#newQuoteText`: Input for the quote text
- `#newQuoteCategory`: Input for the quote category
- `#categoryFilter`: Dropdown filter for categories
- `#export`: Anchor tag used to export the quotes as JSON


### JavaScript Functions

#### Random Quote

- `random(n)`  
  Returns a random integer from `0` to `n-1`.

- `showRandomQuote()`  
  Picks and returns a random quote's text from `quoteList`.

- `generateButton.addEventListener("click")`  
  Displays a random quote from the filtered list.


#### Add Quote

- `addQuote()`  
  - Validates form input
  - Adds the quote to `quoteList`
  - Updates `localStorage`
  - Calls `populateCategories()`

- `createAddQuoteForm(text, category)`  
  - Pushes a new quote into the `quoteList` array
  - Clears input fields
  - Saves updated quotes to `localStorage`


#### Filter Quotes

- `populateCategories()`  
  - Populates the dropdown filter with all unique categories from `quoteList`

- `filterQuotes()`  
  - Filters the `quoteList` based on the selected category in the dropdown


#### Export/Import

- `updateExportURL()`  
  - Creates a downloadable JSON blob link with all quotes

- `importFromJsonFile(event)`  
  - Reads a selected `.json` file
  - Parses and adds its content to the local `quoteList`
  - Updates `localStorage`


#### Syncing with Server

- `API_URL`  
  URL to the mock API endpoint

- `fetchQuotesFromServer()`  
  - Fetches quotes from the server (GET request)
  - Returns a list of quote objects

- `postQuoteToServer(quoteObj)`  
  - Posts a single quote to the server (POST request)

- `syncLocalWithServer()`  
  - Fetches remote data and compares it to local data
  - If the data differs, local data is overwritten by server data
  - Message shown: **"Quotes synced with server!"**

- `initializeSync(intervalMs = 300000)`  
  - Immediately runs `syncLocalWithServer()`
  - Sets up an interval to repeat the sync every 5 minutes


## How Sync Works

1. `initializeSync()` is called on page load
2. It fetches the latest quotes from the server
3. Compares the server data to `quoteList`
4. If they differ:
    - Local data is replaced by server data
    - `localStorage` is updated
    - UI is repopulated
    - Message shown: **"Quotes synced with server!"**
5. If identical:
    - Message shown: **"Quotes synced with server!"**
6. This process repeats every 5 minutes


## Setup Instructions

1. Clone or download this project
2. Open `index.html` in a browser
3. Use the interface to:
   - Add new quotes
   - Filter and view quotes
   - Import/export data
   - Observe synchronization behavior


## Dependencies

- Plain JavaScript (no frameworks)
- `localStorage` and `sessionStorage` APIs
- Fetch API for HTTP requests


## Notes

- This project uses a mock API endpoint. No real persistence is performed on the server.
- To simulate actual server-side sync, a backend with POST/GET/PUT logic would be required.
- Conflict resolution currently prefers **server data** as the source of truth.


