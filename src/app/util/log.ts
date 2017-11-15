export function log(msg: string, ...rest: any[]): void {
    window.console.log.apply(null, arguments)
}

export default log
