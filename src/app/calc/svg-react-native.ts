import * as xml2js from 'xml2js'
import { xmlToJson } from './xml-json'
import { pairsToObject, isArray, flatten } from '../util/util'
import log from '../util/log'
import { hyphenCaseToCamelCase, hyphenCaseToPascalCase } from '../util/strings'

const xmlBuilder = new xml2js.Builder({ headless: true })

export async function svgToReactNative(src: string): Promise<string> {
    try {
        const { svg } = await xmlToJson<any>(src)
        const result = fixSvgForRN(svg)

        if (2 > 3) {
            return JSON.stringify(result, null, 2)
        }
        return xmlBuilder.buildObject(result).toString()
    } catch (e) {
        log('Error when fixing XML:', e)
        return 'Invalid SVG'
    }

}

function fixSvgForRN(svg: any): any {
    delete svg.title
    delete svg.desc

    svg.$ = { width: svg.$.width, height: svg.$.height, viewBox: svg.$.viewBox }

    const Svg = pairsToObject(flatten(Object.keys(svg).map(k => fixKey(k, svg[k], false))))

    return { Svg }
}

function fixKey(key: string, value: any, isAttributes: boolean): Array<[string, any]> {
    if (key === 'style') {
        const styles = value.split(';')
        const sar = styles.filter(Boolean).map((def: string) => {
            const [k, v] = def.split(':')
            return [hyphenCaseToCamelCase(k), v]
        })
        return sar
    }
    const nsSepPos = key.indexOf(':')
    const keyName = nsSepPos >= 0 ? key.substr(nsSepPos + 1) : key
    const fixedKey = isAttributes ? hyphenCaseToCamelCase(keyName) : hyphenCaseToPascalCase(keyName)
    const fixedValue = fixValue(key, value)
    return [[fixedKey, fixedValue]]
}

function fixValue(key: string, value: any) {
    if (isArray(value)) {
         return value.map((v: any) => fixValue(key, v))
    } else if (typeof value === 'object') {
        return pairsToObject(flatten(Object.keys(value).map(k => fixKey(k, value[k], key === '$'))))
    } else {
        return value
    }
}
