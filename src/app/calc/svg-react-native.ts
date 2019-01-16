import * as xmljs from 'xml-js'
import log from '../util/log'
import { pairsToObject, flatten } from '../util/util'
import { toUpperCaseFirst, hyphenCaseToCamelCase } from '../util/strings'

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

type AttributeValue = string | number | undefined

function fixAttributes(attrs: xmljs.Attributes): xmljs.Attributes {
    return renameAttributeKeys(expandStyleAttribute(removeExtraAttrs(attrs)))
}

const attributesToRemove = ['serif:id']
const removeExtraAttrs = (attrs: xmljs.Attributes): xmljs.Attributes => {
    const copy = { ...attrs }
    attributesToRemove.forEach(a => delete copy[a])
    return copy
}

const renameAttributeKeys = (attrs: xmljs.Attributes): xmljs.Attributes =>
    pairsToObject(Object.keys(attrs).map<[string, AttributeValue]>(k => [hyphenCaseToCamelCase(k), attrs[k]]))

const expandStyleAttribute = (attrs: xmljs.Attributes): xmljs.Attributes => {
    const { style, ...rest } = attrs
    return { ...rest, ...expandStyleValue(style)}
}

const expandStyleValue = (value?: string | number): xmljs.Attributes =>
    value && typeof value === 'string' ?
        pairsToObject(flatten(value.split(';')
            .map<Array<[string, string]>>(d => d.indexOf(':') > 0 ?
                [d.split(':', 2) as [string, string]] :
                []))) : {}
