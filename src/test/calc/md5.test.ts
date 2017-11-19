import { hex_md5 } from '../../app/calc/md5'

describe('MD5', () => {
    it('should calculate empty string correctly', () => {
        expect(hex_md5('')).toEqual('d41d8cd98f00b204e9800998ecf8427e')
    })
    it('should calculate hash correctly', () => {
        expect(hex_md5('abc')).toEqual('900150983cd24fb0d6963f7d28e17f72')
        expect(hex_md5('TheTest&!String')).toEqual('10397b78536d4e37ff52f1320bb59e39')
    })
})
