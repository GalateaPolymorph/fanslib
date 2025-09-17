import { describe, expect, it } from 'vitest';

describe('Web Utilities', () => {
  it('should test string utilities', () => {
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
    expect(capitalize('hello')).toBe('Hello');
  });

  it('should test array utilities', () => {
    const numbers = [1, 2, 3, 4, 5];
    const doubled = numbers.map(n => n * 2);
    expect(doubled).toEqual([2, 4, 6, 8, 10]);
  });

  it('should test object utilities', () => {
    const user = { name: 'John', age: 30 };
    const keys = Object.keys(user);
    expect(keys).toContain('name');
    expect(keys).toContain('age');
  });
});
