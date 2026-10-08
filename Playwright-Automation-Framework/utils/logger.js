/**
 * Minimal structured logger. Kept intentionally tiny - the goal is
 * consistent, greppable prefixes in CI logs, not a logging framework.
 */
const scope = (name) => ({
  info: (msg, meta) => log('INFO', name, msg, meta),
  warn: (msg, meta) => log('WARN', name, msg, meta),
  error: (msg, meta) => log('ERROR', name, msg, meta),
});

function log(level, name, msg, meta) {
  const line = `[${new Date().toISOString()}] [${level}] [${name}] ${msg}`;
  if (meta !== undefined) {
    // eslint-disable-next-line no-console
    console.log(line, meta);
  } else {
    // eslint-disable-next-line no-console
    console.log(line);
  }
}

module.exports = { logger: scope };
