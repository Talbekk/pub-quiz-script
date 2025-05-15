import prisma from '../../test_utils/__mocks__/prisma';
import { describe, expect, it, vi } from 'vitest';
import { getAllQuizzes, getQuizByID } from '.';
import { mockQuizzes } from '../../test_utils/__mocks__/quizzes';

vi.mock('../../client', () => ({
    default: prisma,
}));

describe('quizService:', () => {

    describe('getAllQuizzes', () => {

        it('getAllQuizzes should return a list of quizzes', async () => {
            prisma.quizzes.findMany.mockResolvedValue(mockQuizzes);

            const quizzes = await getAllQuizzes();
            expect(quizzes).toBeInstanceOf(Array);
            expect(quizzes.length).toBe(2);
            expect(quizzes[0]).toHaveProperty('id', '1');
            expect(quizzes[1]).toHaveProperty('id', '2');
        });
    });

    describe('getQuizByID', () => {

        it('getQuizByID should return a quiz by ID', async () => {
            const quizid = 'some-unique-id';
            prisma.quizzes.findFirst.mockResolvedValue({ id: quizid, created_at: 1234567890, start_datetime: 1234567890, end_datetime: 1234567891, entries: [], url: [] });

            const quiz = await getQuizByID(quizid);
            expect(quiz).toBeDefined();
            expect(quiz).toHaveProperty('id', quizid);
            expect(quiz).toHaveProperty('created_at', 1234567890);
            expect(quiz).toHaveProperty('start_datetime', 1234567890);
            expect(quiz).toHaveProperty('end_datetime', 1234567891);
            expect(quiz).toHaveProperty('entries', []);
            expect(quiz).toHaveProperty('url', []);
        });

        it('getQuizByID should throw an error if quiz is not found', async () => {
            const quizid = 'non-existent-id';
            prisma.quizzes.findFirst.mockResolvedValue(null);
            await expect(getQuizByID(quizid)).rejects.toThrow('Quiz not found');
        });

    });

});