function printReport(urlList) {
    console.log("------------");
    console.log("REPORT");
    console.log("------------");
    
    const sortedURLs = sortURLs(urlList)
    for (const sortedURL of sortedURLs) {
        const url = sortedURL[0]
        const count = sortedURL[1]
        console.log(`Found ${count} links to page ${url}`)
    }

    console.log("------------");
    console.log("END OF REPORT");
    console.log("------------");
}


function sortURLs(urlList) {
    const URLArr = Object.entries(urlList)
    URLArr.sort((a, b)  => {
        aCount = a[1]
        bCount = b[1]
        return b[1] - a[1]
    })
    return URLArr
}

module.exports = {
    sortURLs,
    printReport
}