import rot13 from "../../app/calc/rot13"
import chai from "chai"
const expect = chai.expect

describe("ROT-13", function() {
    it("should calculate empty string correctly", () => {
        expect(rot13("")).to.equal("")
    })
    it("should calculate rotate correctly", () => {
        expect(rot13("abc")).to.equal("nop")
        expect(rot13("TheTest&!String")).to.equal("GurGrfg&!Fgevat")
        expect(rot13("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"))
            .to.equal("NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm")
    })
})
