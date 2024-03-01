export const dateToYYYYMMDD = (date: number) => {
    const newDate = new Date(date);
    return newDate.toISOString().split('T')[0];
};

export const getCurrentDate = () => {
    const now = new Date();
    return dateToYYYYMMDD(now.getTime());
};

export const getSevenDaysOffset = () => {
    const DEFAULT_DATE_OFFSET = 7; // 7 Days
    const now = new Date();
    // Creates a new Date object to avoid mutating the original `now` object
    const date7DaysAgo = new Date(now.setDate(now.getDate() - DEFAULT_DATE_OFFSET)).getTime();
    return dateToYYYYMMDD(date7DaysAgo);
};