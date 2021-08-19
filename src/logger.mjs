import pino from 'pino'
import {trim} from 'orb-object'

const __caller_stack_id = 7
const CWD = process.cwd()

Object.defineProperty(global, '__stack', {
  get: function() {
      const orig = Error.prepareStackTrace;

      Error.prepareStackTrace = (_, stack) => stack

      const err = new Error;
      Error.captureStackTrace(err);

      // Do not remove the below line. It makes sure that the stack is available after prepareStackTrace is reset
      const stack = err.stack;
      Error.prepareStackTrace = orig;
      return stack
  }
});

Object.defineProperty(global, '__file', {
  get: _ => __stack[__caller_stack_id].getFileName().slice(CWD.length + 1)
});
  
Object.defineProperty(global, '__line', {
  get: _ => __stack[__caller_stack_id].getLineNumber()
});

Object.defineProperty(global, '__column', {
  get: _ => __stack[__caller_stack_id].getColumnNumber()
});

Object.defineProperty(global, '__method', {
  get: _ => __stack[__caller_stack_id].getMethodName()
});

function logMethod(args, method) {
  if (args.length != 0)
  {
    const fmt = typeof args[0] === 'string'? args.shift(): ''
    const newFmt = args.reduce((str) => str + ' %O', fmt)

    method.apply(this, [newFmt, ...args.map((v) => trim(v))])
  }
}

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: null, // Removes pid and hostname from the log line
  timestamp: false, // Does not add timestamp to the log lines
  prettyPrint: { levelFirst: true, },
  hooks: { logMethod },
  mixin() {
    return {
      location: `${__file}:${__line}`,
    }
  }
})