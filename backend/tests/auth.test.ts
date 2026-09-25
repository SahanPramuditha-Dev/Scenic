import test from 'node:test';
import assert from 'node:assert/strict';
import type { Request, Response } from 'express';
import { requireAuth } from '../src/modules/auth/auth.middleware';

function responseRecorder() {
  let statusCode = 200;
  let body: unknown;
  const response = {
    status(code: number) { statusCode = code; return this; },
    json(value: unknown) { body = value; return this; },
  } as Response;
  return { response, result: () => ({ statusCode, body }) };
}

test('tracking authentication rejects requests without a bearer token', async () => {
  const { response, result } = responseRecorder();
  let nextCalled = false;
  await requireAuth({ headers: {} } as Request, response, () => { nextCalled = true; });
  assert.equal(result().statusCode, 401);
  assert.equal(nextCalled, false);
});

test('a caller-supplied mock token cannot impersonate a user', async () => {
  const { response, result } = responseRecorder();
  let nextCalled = false;
  const request = { headers: { authorization: 'Bearer mock-token-victim' } } as Request;
  await requireAuth(request, response, () => { nextCalled = true; });
  assert.equal(result().statusCode, 401);
  assert.equal(nextCalled, false);
});
