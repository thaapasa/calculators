import { hex_md5 } from "../../app/calc/md5"
import chai from "chai"
const expect = chai.expect

describe("MD5", function() {
    it("should calculate empty string correctly", () => {
        expect(hex_md5("")).to.equal("d41d8cd98f00b204e9800998ecf8427e")
    })
    it("should calculate hash correctly", () => {
        expect(hex_md5("abc")).to.equal("900150983cd24fb0d6963f7d28e17f72")
        expect(hex_md5("TheTest&!String")).to.equal("10397b78536d4e37ff52f1320bb59e39")
    })
})
