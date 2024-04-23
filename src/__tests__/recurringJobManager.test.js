const { executeJob, handleJobFailure, sendNotificationEmail } = require('../utils/recrurringJobManager');

jest.setTimeout(100000); // Set the timeout to 10 seconds

describe('executeJob function', () => {
    test('should update job status to running and then successful', async () => {
        const job = { _id: 'testId', status: 'pending', save: jest.fn() }; // Mock job object with save function
        await executeJob(job);
        expect(job.status).toBe('successful');
    });

    test('should handle errors and update job status to failed', async () => {
        const job = { _id: 'testId', status: 'pending', save: jest.fn() }; // Mock job object with save function
        // Simulate an error during job execution
        jest.spyOn(console, 'error').mockImplementation(() => {});
        await executeJob(job);
        expect(job.status).toBe('failed');
    });
});

describe('handleJobFailure function', () => {
    test('should handle job failure and update status to failed', async () => {
        const job = { _id: 'testId', status: 'running', max_attempts: 3, save: jest.fn() }; // Mock job object with save function
        await handleJobFailure(job);
        expect(job.status).toBe('failed');
    });

    test('should retry job execution and update status to successful', async () => {
        const job = { _id: 'testId', status: 'running', max_attempts: 3, save: jest.fn() }; // Mock job object with save function
        await handleJobFailure(job);
        expect(job.status).toBe('successful');
    });
});

describe('sendNotificationEmail function', () => {
    test('should send email notification successfully', async () => {
        const job = { _id: 'testId', save: jest.fn() }; // Mock job object with save function
        const info = await sendNotificationEmail(job);
        expect(info).toBeDefined();
    });

    test('should handle error in sending email notification', async () => {
        const job = { _id: 'testId', save: jest.fn() }; // Mock job object with save function
        jest.spyOn(console, 'error').mockImplementation(() => {});
        
        // Expect the promise to be rejected with an error object
        await expect(sendNotificationEmail(job)).rejects.toThrow();
    });
});