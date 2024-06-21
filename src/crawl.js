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


function getURLsFromHTML(htmlBody, baseURL) {
    const urls = []
    const dom = new JSDOM(htmlBody);
    const linksInDOM = dom.window.document.querySelectorAll('a');    

    for (const link of linksInDOM) {
        if (link.href[0] === '/') {
            const absoluteLink = `${baseURL}${link}`;
            urls.push(normalizeURL(absoluteLink))
        } else {
            urls.push(normalizeURL(link))
        }        
    }

    return urls
    }



module.exports = {
    normalizeURL,
    getURLsFromHTML
};