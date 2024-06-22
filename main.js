const readline = require('node:readline');
const {crawlPage} = require('./src/crawl');
const {printReport} = require('./src/report');

    
// Create a readline interface to ask the user for a URL when starting the application
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Function to ask the user for an URL input
function getBaseURLFromInput(query){ 
    return new Promise(resolve => rl.question(query, resolve));
}


async function main() {  
    // Call the getBaseURLFromInput to get a URL to crawl through and bind it to a baseURL parameter
    const baseURL = await getBaseURLFromInput("Please enter a valid URL to crawl through: ")
    // Close the readline when a URL is provided
    rl.close();

    // Get a list of pages and their counters
    const pages = await crawlPage(baseURL, baseURL, {})
    // Print a report for the crawled page
    printReport(pages)
}

main()