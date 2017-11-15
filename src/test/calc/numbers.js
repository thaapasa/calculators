import chai from 'chai'
import * as n from '../../app/calc/numbers'
const expect = chai.expect

describe('Numbers', () => {
    describe('binary string -> int', () => {
        it('should work for valid input', () => {
            expect(n.binaryStrToInt('1')).to.equal(1)
            expect(n.binaryStrToInt('10')).to.equal(2)
            expect(n.binaryStrToInt('1111')).to.equal(15)
            expect(n.binaryStrToInt('10000')).to.equal(16)
            expect(n.binaryStrToInt('100000000')).to.equal(256)
        })
        it('should leave numbers as-is', () => {
            expect(n.binaryStrToInt(123)).to.equal(123)
        })
        it('should fail correctly for invalid input', () => {
            expect(n.binaryStrToInt('')).to.be.NaN
            expect(n.binaryStrToInt('102')).to.be.NaN
            expect(n.binaryStrToInt('abc')).to.be.NaN
            expect(n.binaryStrToInt('abc')).to.be.NaN
            expect(n.binaryStrToInt(null)).to.be.NaN
            expect(n.binaryStrToInt(undefined)).to.be.NaN
            expect(n.binaryStrToInt({ a: 1 })).to.be.NaN
        })
    })
    
    describe('int -> binary string', () => {
        it('should work for valid input', () => {
            expect(n.intToBinaryStr(0)).to.equal('0')
            expect(n.intToBinaryStr(1)).to.equal('1')
            expect(n.intToBinaryStr(5)).to.equal('101')
            expect(n.intToBinaryStr(127)).to.equal('1111111')
        })
        it('should also convert valid strings', () => {
            expect(n.intToBinaryStr('5')).to.equal('101')
            expect(n.intToBinaryStr('127')).to.equal('1111111')
        })
        it('should fail correctly for invalid input', () => {
            expect(n.intToBinaryStr(null)).to.be.undefined
            expect(n.intToBinaryStr(undefined)).to.be.undefined
            expect(n.intToBinaryStr({ a: 1 })).to.be.undefined
            expect(n.intToBinaryStr(NaN)).to.be.undefined
        })
    })

})
