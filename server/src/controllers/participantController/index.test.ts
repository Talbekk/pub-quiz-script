import { describe, it, expect, vi, Mock, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { ThrowError } from '../../middlewares/errorHandler';
import { getAllParticipants, getParticipantByID } from '../../services/participantService';
import { mockParticipant1, mockParticipants } from '../../test_utils/__mocks__/participants';

vi.mock('../../services/participantService', () => ({
    getPaginatedParticipants: vi.fn(),
    getParticipantByID: vi.fn(),
}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe('Participant Controller', () => {

    describe('getParticipants', () => {
        it('GET /participants should return a list of participants', async () => {
            const mockResponse = {
                status: true,
                message: 'Participants Successfully fetched',
                data: mockParticipants,
            };

            const mockGetAllParticipants = vi
                .fn()
                .mockResolvedValue(mockParticipants);

            (getAllParticipants as Mock) = mockGetAllParticipants;
            const response = await request(app).get('/participants');
            expect(mockGetAllParticipants).toHaveBeenCalled();
            expect(response.body).toEqual(mockResponse);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(2);
            expect(response.body.data[0].full_name).toBe('Bruce Wayne');
            expect(response.body.data[1].full_name).toBe('James Bond');
        });

        it('GET /participants should handle empty results gracefully', async () => {
            const mockResponse = {
                status: true,
                message: 'Participants Successfully fetched',
                data: [],
            };

            const mockGetAllParticipants = vi.fn().mockResolvedValue([]);

            (getAllParticipants as Mock) = mockGetAllParticipants;
            const response = await request(app).get('/participants');
            expect(mockGetAllParticipants).toHaveBeenCalled();
            expect(response.body).toEqual(mockResponse);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(0);
            expect(response.body).toEqual(mockResponse);
        });
    });

    describe('getParticipant', () => {
        it('GET /participants/:userid should return a participant by ID', async () => {
            const mockResponse = {
                status: true,
                message: 'Participant Successfully fetched',
                data: mockParticipant1,
            };

            const mockGetParticipantByID = vi.fn().mockResolvedValue(mockParticipant1);

            (getParticipantByID as Mock) = mockGetParticipantByID;
            const response = await request(app).get('/participants/1');
            expect(mockGetParticipantByID).toHaveBeenCalledWith('1');
            expect(response.body).toEqual(mockResponse);
            expect(response.status).toBe(200);
            expect(response.body.data.full_name).toBe('Bruce Wayne');
        });

        it('GET /participants/:userid should handle not found error gracefully', async () => {
            const mockResponse = {
                status: false,
                message: 'Participant not found',
                data: { id: '999' },
            };

            const mockGetParticipantByID = vi.fn().mockImplementation(() => {
                throw new ThrowError(404, 'Participant not found', {
                    id: '999',
                });
            });
            (getParticipantByID as Mock) = mockGetParticipantByID;
            const response = await request(app).get('/participants/999');
            expect(mockGetParticipantByID).toHaveBeenCalledWith('999');
            expect(response.body).toEqual(mockResponse);
            expect(response.status).toBe(404);
        });
    });
});
