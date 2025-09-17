import { describe, expect, it } from 'bun:test';

describe('Server', () => {
  it('should test environment setup', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });
});
