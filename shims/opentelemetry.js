// shim for @opentelemetry/api
module.exports = {
  trace: () => ({
    getTracer: () => ({ startSpan: () => ({ end: () => {} }) }),
  }),
  context: {},
};
