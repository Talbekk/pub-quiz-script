import prisma from '../../test_utils/__mocks__/prisma';
import { describe, expect, it, vi } from 'vitest';
import { getPaginatedQuizzes, getQuizByID, updateQuizByID } from '.';
import { mockQuizzes } from '../../test_utils/__mocks__/quizzes';
import { requestPagination } from '../../test_utils/__mocks__/pagination';

vi.mock('../../client', () => ({
    default: prisma,
}));

describe('quizService:', () => {
    describe('getPaginatedQuizzes', () => {
        it('getPaginatedQuizzes should return a paginated list of quizzes', async () => {
            prisma.quizzes.count.mockResolvedValue(50);
            prisma.quizzes.findMany.mockResolvedValue(mockQuizzes);
            prisma.$transaction.mockResolvedValue([50, mockQuizzes]);
            const result = await getPaginatedQuizzes(requestPagination);

            expect(result.quizCount).toBe(50);
            expect(result.quizzes).toEqual(mockQuizzes);
            expect(prisma.quizzes.count).toHaveBeenCalled();
            expect(prisma.quizzes.findMany).toHaveBeenCalledWith({
                skip: 0,
                take: 10,
            });
        });
    });

    describe('getQuizByID', () => {
        it('getQuizByID should return a quiz by ID', async () => {
            const quizid = 'some-unique-id';
            prisma.quizzes.findFirst.mockResolvedValue({
                id: quizid,
                created_at: 1234567890,
                start_datetime: 1234567890,
                end_datetime: 1234567891,
                entries: [],
                url: [],
            });

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

    describe('updateQuizByID', () => {
        it('updateQuizByID should update a quiz by ID', async () => {
            const quizid = 'some-unique-id';
            const updatedData = {
                start_datetime: 1234567890,
                end_datetime: 1234567891,
            };
            prisma.quizzes.findFirst.mockResolvedValue({
                id: quizid,
                created_at: 1234567890,
                start_datetime: 1234567890,
                end_datetime: 1234567891,
                entries: [],
                url: [],
            });
            prisma.quizzes.update.mockResolvedValue({
                id: quizid,
                created_at: 1234567890,
                start_datetime: 1111111111,
                end_datetime: 2222222222,
                entries: [],
                url: [],
            });

            const updatedQuiz = await updateQuizByID(quizid, updatedData);
            expect(updatedQuiz).toBeDefined();
            expect(updatedQuiz).toHaveProperty('start_datetime', 1111111111);
            expect(updatedQuiz).toHaveProperty('end_datetime', 2222222222);
        });

        it('updateQuizByID should throw an error if quiz is not found', async () => {
            const quizid = 'non-existent-id';
            const updatedData = {
                start_datetime: 1234567890,
                end_datetime: 1234567891,
            };
            prisma.quizzes.findFirst.mockResolvedValue(null);
            await expect(updateQuizByID(quizid, updatedData)).rejects.toThrow(
                'Quiz not found',
            );
        });
    });
});
