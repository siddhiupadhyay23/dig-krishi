// Test setup and configuration
const { MongoMemoryServer } = require('mongodb-memory-server');

// Increase timeout for database operations
jest.setTimeout(30000);

// Setup global test database
let mongod;

beforeAll(async () => {
  // This will create an new instance of "MongoMemoryServer" and automatically start it
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  // Set the test database URI as environment variable
  process.env.TEST_MONGODB_URI = uri;
  process.env.NODE_ENV = 'test';
});

afterAll(async () => {
  // Stop the MongoMemoryServer
  if (mongod) {
    await mongod.stop();
  }
});

// Mock console methods in test environment to reduce noise
if (process.env.NODE_ENV === 'test') {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };
}
