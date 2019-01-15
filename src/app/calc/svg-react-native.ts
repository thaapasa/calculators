import * as xmljs from 'xml-js'
import log from '../util/log'
import { pairsToObject, flatten } from '../util/util'
import { hyphenCaseToCamelCase, toUpperCaseFirst } from '../util/strings'

export async function svgToReactNative(src: string): Promise<string> {
    try {
        const xml: xmljs.Element = xmljs.xml2js(src, { compact: false }) as xmljs.Element
        const svg = xml.elements && xml.elements.find(e => e.name === 'svg')

        delete xml.declaration

        const result = {
            ...xml,
            elements: [fixSvgForRN(svg!)],
        }
        return xmljs.js2xml(result, { compact: false, spaces: 2 })
    } catch (e) {
        log('Error when fixing XML:', e)
        return 'Invalid SVG'
    }
}

function fixSvgForRN(svg: xmljs.Element): xmljs.Element {
    const attrs = svg.attributes
    return fixElement({
        ...svg,
        elements: svg.elements ? svg.elements.filter(e => e.name !== 'title' && e.name !== 'desc').map(fixElement) : undefined,
        attributes: attrs ? { width: attrs.width, height: attrs.height, viewBox: attrs.viewBox } : undefined,
    })
}

function fixElement(element: xmljs.Element): xmljs.Element {
    return {
        ...element,
        name: toUpperCaseFirst(element.name || ''),
        elements: element.elements && element.elements.map(fixElement),
        attributes: element.attributes && fixAttributes(element.attributes),
    }
}

function fixAttributes(attrs: xmljs.Attributes): xmljs.Attributes {
    return pairsToObject(flatten(Object.keys(attrs).map(k => fixAttribute(k, attrs[k]))))
}

function fixAttribute(key: string, value?: string | number): Array<[string, string | number | undefined]> {
    if (key === 'style') {
        const styles = (value as string).split(';')
        const sar: Array<[string, string]> = styles.filter(Boolean).map<[string, string]>((def: string) => {
            const [k, v] = def.split(':')
            return [hyphenCaseToCamelCase(k), v]
        })
        return sar
    }
    if (key === 'serif:id') {
        return []
    }
    return [[hyphenCaseToCamelCase(key), value]]
}
