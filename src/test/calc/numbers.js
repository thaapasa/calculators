import chai from "chai"
import * as n from "../../app/calc/numbers"
const expect = chai.expect

describe("Numbers", () => {

    describe("Binary conversions", () => {
        it("should convert string to number", () => {
            expect(n.binaryStrToInt("1")).to.equal(1)
            expect(n.binaryStrToInt("10")).to.equal(2)
            expect(n.binaryStrToInt("1111")).to.equal(15)
            expect(n.binaryStrToInt("10000")).to.equal(16)
            expect(n.binaryStrToInt("100000000")).to.equal(256)
        })
        it("should fail str->int correctly for invalid input", () => {
            expect(n.binaryStrToInt("")).to.be.NaN
            expect(n.binaryStrToInt("102")).to.be.NaN
            expect(n.binaryStrToInt("abc")).to.be.NaN
            expect(n.binaryStrToInt("abc")).to.be.NaN
        })
        it("should convert numbers to binary strings", () => {
            expect(n.intToBinaryStr(0)).to.equal("0")
            expect(n.intToBinaryStr(1)).to.equal("1")
            expect(n.intToBinaryStr(5)).to.equal("101")
            expect(n.intToBinaryStr(127)).to.equal("1111111")
            expect(n.intToBinaryStr("5")).to.equal("101")
            expect(n.intToBinaryStr("127")).to.equal("1111111")
        })
        it("should fail int->str correctly for invalid input", () => {
            expect(n.intToBinaryStr(null)).to.be.undefined
            expect(n.intToBinaryStr(undefined)).to.be.undefined
            expect(n.intToBinaryStr({ a: 1 })).to.be.undefined
            expect(n.intToBinaryStr(NaN)).to.be.undefined
        })
    })

})
