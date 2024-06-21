const {normalizeURL} = require('../src/crawl')
const {test, expect} = require('@jest/globals')
const {getURLsFromHTML} = require('../src/crawl')

test('normalizeURL - strip protocol', () => {
    const input = 'https://maps.google.com';
    const actual = normalizeURL(input);
    const expected = 'maps.google.com';
    expect(actual).toEqual(expected)
});
test('normalizeURL - wrong protocol', () => {
    const input = 'ftp://maps.google.com';
    const expected = 'ftp: protocol not supported. Please check your URL.';
    expect(() => {normalizeURL(input)}).toThrow(expected);
});
test('normalizeURL - root path', () => {
    const input = 'https://maps.google.com/';
    const actual = normalizeURL(input);
    const expected = 'maps.google.com';
    expect(actual).toEqual(expected)
});
test('normalizeURL - trailing / in path', () => {
    const input = 'https://maps.google.com/path/';
    const actual = normalizeURL(input);
    const expected = 'maps.google.com/path';
    expect(actual).toEqual(expected)
});
test('normalizeURL - port', () => {
    const input = 'https://maps.google.com:8080';
    const actual = normalizeURL(input);
    const expected = 'maps.google.com';
    expect(actual).toEqual(expected)
});


test('getURLsFromHTML - absolute', () => {
    const htmlBody = `
    <html>
        <body>
            <a href="https://www.google.com">Google</a>
            <a href="http://www.microsoft.com">Microsoft</a>
        </body
    </html>
    `
    const baseURL = 'www.google.com'
    const actual = getURLsFromHTML(htmlBody, baseURL);
    const expected = ['www.google.com', "www.microsoft.com"];
    expect(actual).toEqual(expected)
});
test('getURLsFromHTML - relative', () => {
    const htmlBody = `
    <html>
        <body>
            <a href="/googlepath/">Google</a>
        </body
    </html>
    `
    const baseURL = 'https://www.google.com'
    const actual = getURLsFromHTML(htmlBody, baseURL);
    const expected = ['www.google.com/googlepath'];
    expect(actual).toEqual(expected)
});
test('getURLsFromHTML - both', () => {
    const htmlBody = `
    <html>
        <body>
            <a href="/googlepath/">Google</a>
            <a href="https://www.google.com/googlepath2/">Google</a>
        </body
    </html>
    `
    const baseURL = 'https://www.google.com'
    const actual = getURLsFromHTML(htmlBody, baseURL);
    const expected = ['www.google.com/googlepath', 'www.google.com/googlepath2'];
    expect(actual).toEqual(expected)
});
test('getURLsFromHTML - invalid', () => {
    const htmlBody = `
    <html>
        <body>
            <a href="www.google.com/googlepath2/">Google</a>
        </body
    </html>
    `
    const baseURL = 'https://www.google.com'
    expect(() => {getURLsFromHTML(htmlBody, baseURL)}).toThrow(TypeError('Invalid URL'));
});
