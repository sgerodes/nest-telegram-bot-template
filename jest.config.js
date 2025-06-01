module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: './',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    moduleNameMapper: {
        '@database/(.*)': '<rootDir>/src/database/$1',
        '@i18n/(.*)': '<rootDir>/configuration/i18n/$1',
        "@telegram/(.*)": '<rootDir>/src/telegram/$1',
        "@configuration/(.*)": '<rootDir>/configuration/$1',
        "@language/(.*)": '<rootDir>/src/language/$1',
    },
};
