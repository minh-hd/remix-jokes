import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { login, register } from '../utils/session.server';
import { db } from '../utils/db.server';

async function deleteTestUser() {
  const user = await db.user.findUnique({
    where: {
      username: 'testUser',
    },
  });

  if (user) {
    await db.user.delete({
      where: {
        username: 'testUser',
      },
    });
  }
}

describe('login feature', () => {
  test('if an user login with non existing username', async () => {
    await expect(
      login({ username: 'test', password: '1234' }),
    ).resolves.toBeNull();
  });

  test('if an user login with incorrect password', async () => {
    await expect(
      login({ username: 'kody', password: '1234' }),
    ).resolves.toBeNull();
  });

  test('if an user can login with correct credentials', async () => {
    await expect(
      login({ username: 'kody', password: 'twixrox' }),
    ).resolves.toMatchObject({
      id: '033f61a0-90e6-4d0a-bb7f-d2a25737035c',
      username: 'kody',
    });
  });
});

describe('register feature', () => {
  beforeAll(async () => {
    await deleteTestUser();
  });

  test('if an user register with non existing username', async () => {
    await expect(
      register({ username: 'testUser', password: '1234' }),
    ).resolves.toEqual(
      expect.objectContaining({
        userId: expect.any(String),
        username: 'testUser',
      }),
    );
  });

  test('if an user register with an existed username', async () => {
    await expect(
      register({ username: 'kody', password: '1234' }),
    ).resolves.toBeNull();
  });

  afterAll(async () => {
    await deleteTestUser();
  });
});