const logger = {
  format: {
    printf: jest.fn(),
    timestamp: jest.fn(),
    simple: jest.fn(),
    colorize: jest.fn(),
    combine: jest.fn()
  },
  transports: {
    Console: jest.fn(),
    File: jest.fn()
  },
  createLogger: jest.fn().mockImplementation(function(_) {
    return {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    }
  })
}
  
module.exports = logger
