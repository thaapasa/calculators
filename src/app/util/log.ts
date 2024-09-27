export function log(msg: string, ...rest: any[]): void {
  window.console.log.apply(null, [msg, ...rest]);
}

export default log;
