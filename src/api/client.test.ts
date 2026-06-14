import { describe, it, expect } from 'vitest';
import client from './client';

describe('Axios Client Test', () => {
  it('should be configured with correct default prefix', () => {
    expect(client.defaults.baseURL).toContain('/api/v1');
  });

  it('should have application/json Content-Type header by default', () => {
    expect(client.defaults.headers['Content-Type']).toBe('application/json');
  });
});
