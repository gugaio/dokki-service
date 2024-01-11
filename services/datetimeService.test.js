const datetimeService = require('./datetimeService');

describe('datetimeService', () => {
    describe('currentDatetimeISOString', () => {
        it('should return the current datetime', () => {
            const mockDate = new Date('2022-01-01T00:00:00Z');
            jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

            const result = datetimeService.currentDatetime();
            const currentDatetime = new Date('2022-01-01T00:00:00Z');

            expect(result).toEqual(currentDatetime);

            jest.restoreAllMocks();
        });
    });
});
