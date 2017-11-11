// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min
}

export function isDefined(value: any): boolean {
    return value !== undefined && value !== null
}

export function isNumber(value: any): boolean {
    return value !== undefined && value !== null && typeof value == "number" && !isNaN(value)
}

export function isString(value: any): boolean {
    return value !== undefined && value !== null && typeof value == "string"
}

export function isObject(value: any): boolean {
    return value !== undefined && value !== null && typeof value == "object"
}

export function isArray(value: any): boolean {
    return Array.isArray(value)
}

export function noop(): void {}

export function identity<T>(value: T): T { return value }

export function nonEmpty(value: any): boolean {
    return value && value.length && value.length > 0
}

export function combine(a: any, b: any): string {
    return `${a}${b}`
}

export function combineWith(separator: string) {
    return (a: any, b: any) => `${a}${separator}${b}`
}

const consoleMethods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
]

// Avoid `console` errors in browsers that lack a console.
export function fixConsole() {
    if (window.console === undefined) {
        (window as any).console = {}
    }
    const c = window.console
    consoleMethods.forEach(method => {
        // Only stub undefined methods.
        if (!c[method]) {
            c[method] = noop
        }
    })
}
