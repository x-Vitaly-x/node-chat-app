var expect = require('expect');
var {isRealString} = require("./validation");

describe('isRealString', () => {
    it('should reject non-string values', () => {
        var str = 1234;
        expect(isRealString(str)).toBe(false);
    });

    it('should reject strings with only spaces', () => {
        var str = '       ';
        expect(isRealString(str)).toBe(false);
    });

    it('should allow strings with non-space characters', () => {
        var str = 'Test account';
        expect(isRealString(str)).toBe(true);
    });
});