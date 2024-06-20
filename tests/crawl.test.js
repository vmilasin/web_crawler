const {normalizeURL} = require('../src/crawl')
const {test, expect} = require('@jest/globals')

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

