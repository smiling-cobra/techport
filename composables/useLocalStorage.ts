export const useLocalStorage = () => {

    const getValue = <T>(key: T): T => {
        return localStorage.getItem(key as string) as T;
    };
    
    const setValue = <T>(key: string, value: T) => {
        localStorage.setItem(key, JSON.stringify(value));
    };

    return [getValue, setValue] as const;
};