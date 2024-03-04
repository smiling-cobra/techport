import { beforeAll, afterAll, vi, expect, it, describe } from 'vitest';
import { dateToYYYYMMDD, getSevenDaysOffset } from './dateUtils';

describe('dateToYYYYMMDD', () => {
  it('converts a timestamp to a YYYY-MM-DD string', () => {
    const timestamp = Date.UTC(2020, 0, 1);
    const expectedDateString = '2020-01-01';

    const result = dateToYYYYMMDD(timestamp);
    expect(result).toBe(expectedDateString);
  });

  it('handles leap year correctly', () => {
    const timestamp = Date.UTC(2020, 1, 29); // February 29, 2020
    const expectedDateString = '2020-02-29';

    const result = dateToYYYYMMDD(timestamp);
    expect(result).toBe(expectedDateString);
  });
});

describe('getSevenDaysOffset', () => {
  it('returns the date 7 days before the current date in YYYY-MM-DD format', () => {
    const mockCurrentDate = new Date('2024-03-10T12:00:00Z'); // March 10, 2024
    vi.useFakeTimers().setSystemTime(mockCurrentDate);

    const expectedDate = '2024-03-03'; // 7 days before March 10, 2024

    const result = getSevenDaysOffset();
    expect(result).toBe(expectedDate);

    vi.useRealTimers();
  });
});

