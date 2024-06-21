const {sortURLs} = require('../src/report')
const {test, expect} = require('@jest/globals')

test('sortPages - 2', () => {
    const input = {
        'https://wagslane.dev/path' : 1,
        'https://wagslane.dev' : 3,
    };
    const actual = sortURLs(input);
    const expected = [
        ['https://wagslane.dev', 3],
        ['https://wagslane.dev/path', 1]
    ];
    expect(actual).toEqual(expected)
});
test('sortPages - 5', () => {
    const input = {
        'https://wagslane.dev/whereami' : 4,
        'https://wagslane.dev/path' : 1,
        'https://wagslane.dev' : 3,        
        'https://wagslane.dev/pathofleastresistance' : 2,
        'https://wagslane.dev/hardpath' : 5
    };
    const actual = sortURLs(input);
    const expected = [
        ['https://wagslane.dev/hardpath', 5],
        ['https://wagslane.dev/whereami', 4],
        ['https://wagslane.dev', 3],
        ['https://wagslane.dev/pathofleastresistance', 2],
        ['https://wagslane.dev/path', 1]
    ];
    expect(actual).toEqual(expected)
});