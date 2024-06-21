const jsdom = require("jsdom");
const { JSDOM } = jsdom;


function normalizeURL(url) {
    // Try creating a new URL object
    try {
        const urlObject = new URL(url);
    } catch (error) {
        console.log(`Invalid URL. Details: ${error.message}`);
    };

    // If possible to create a new URL object (it has the correct format), declare it 
    const urlObject = new URL(url);
    
    // We need only the hostname and pathname parts of the URL object
    let cleanURL = `${urlObject.hostname}${urlObject.pathname}`

    // Strip the trailing / char if the pathname is not just root
    if (!(cleanURL.pathname === '/') && cleanURL[cleanURL.length - 1] === '/') {
        cleanURL = `${urlObject.hostname}${urlObject.pathname.slice(0, -1)}`
    }

    // We will only look for URLs using http and https protocols - throw an error if the protocol is different
    if (urlObject.protocol === 'http:' || urlObject.protocol === 'https:'){
        return cleanURL;
    } else {
        throw new Error(`${urlObject.protocol} protocol not supported. Please check your URL.`);
    };    
};


// This function takes a HTML body from a site and extracts all links (<a> elements)
function getURLsFromHTML(htmlBody, baseURL) {
    const urls = []                             // This list holds all the links
    const dom = new JSDOM(htmlBody);            // JSDOM enables us to parse the HTML body
    const linksInDOM = dom.window.document.querySelectorAll('a');       // Selects all <a> elements

    for (const link of linksInDOM) {
        // If the link starts with / - it is a relative link, so append the base URL to it to get an absolute link
        if (link.href[0] === '/') {
            const absoluteLink = `${baseURL}${link}`;
            urls.push(normalizeURL(absoluteLink))
        } else {
            urls.push(normalizeURL(link))
        }        
    }
    return urls
}


async function crawlPage(baseURL, currentURL, urlList) {
    console.log(`Actively crawling: ${currentURL}`);

    // Skip URLs with hostnames different than base hostname
    const baseURLObject = new URL(baseURL);
    const currentURLObject = new URL(currentURL);
    if (baseURLObject.hostname !== currentURLObject.hostname) {
        return urlList
    };

    // If we have already crawled the current page, increment in urlList and skip it
    const normalizedCurrentURL = normalizeURL(currentURL);
    if (urlList[normalizedCurrentURL] > 0 ) {
        urlList[normalizedCurrentURL] += 1
        return urlList
    }

    // If the current URL is not already in the urlList, initiate it with value 1
    urlList[normalizedCurrentURL] = 1


    try {
        // Try fetching the HTML from the current URL
        const request = await fetch(currentURL);

        // If we get a HTTP response of 4xx or 5xx, log that on the console
        if (request.status > 399) {
            console.log(`Error in fetch on page: ${currentURL} with status code: ${request.status}`)
            return urlList
        };

        // If the crawled page isn't a HTTP one, log that on the console
        const contentType = request.headers.get("content-type")
        if (!contentType.includes("text/html")) {
            console.log(`Non-HTML response on page: ${currentURL}. Received type: ${contentType}`)
            return urlList
        };

    } catch (err) {
        // If there was an error when trying to fetch the HTML from a current URL, log the error on the console
        console.log(err.message)
    };

    // If the testing was successful, request the HTML from the current url, and declare its HTML body as the response
    const request = await fetch(currentURL);
    const response = await request.text()

    // Run the getURLsFromHTML on that HTML body and add the links to urlList. If they're already inside, increment their counter
    const extractedLinks = getURLsFromHTML(response, baseURL)
    
    // Recursively crawl through all the links from the main page
    for (const link of extractedLinks) {
        urlList = await crawlPage(baseURL, `http://${link}`, urlList);     
    };
    return urlList
}


module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
};