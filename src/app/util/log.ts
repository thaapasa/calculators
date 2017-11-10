export function log(msg: string, ...rest: any[]) {
    window.console.log.apply(null, arguments)
}

export default log
