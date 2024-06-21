async function main() {
    const readline = require('node:readline');
    const {crawlPage} = require('./src/crawl');
    const {printReport} = require('./src/report');

    /*const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    
    rl.question('Please enter a URL to crawl through:', inputURL => {
        console.log(`Stating crawl of ${baseURL}`);
        rl.close();
    });*/

    /* Node is always the first argument,
    the script file being run is the second,
    provided arguments are third */
    if (process.argv.length < 3) {
        console.log("No website provided.");
        process.exit(1);
    };
    if (process.argv.length > 3) {
        console.log('Please enter only 1 website');
        process.exit(1);
    };

    const baseURL = process.argv[2]
    
    const pages = await crawlPage(baseURL, baseURL, {})
    printReport(pages)

    
    
    

    //console.log(crawlPage('https://wagslane.dev/garbagepath'))


}


main()





