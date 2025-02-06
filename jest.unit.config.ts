export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '^(?!.*\\.(int|e2e)\\.spec\\.ts$).*\\.spec\\.ts$', // Exclude e2e and int tests
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};