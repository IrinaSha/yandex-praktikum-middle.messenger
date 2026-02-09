import {
  describe, expect, jest, test, beforeEach,
} from '@jest/globals';
import { ApiBase } from './api-base';
import { ResourcesApi } from './resources-api';

const AVATAR_PATH = 'test-path';
const EXPECTED_GET_ARG = `/${AVATAR_PATH}`;
const MOCK_GET_RESULT = { url: 'path' };

describe('ResourcesApi', () => {
  let api: ResourcesApi;

  beforeEach(() => {
    api = new ResourcesApi();
  });

  test('should call get with correct path', async () => {
    const getSpy = jest
      .spyOn(ApiBase.prototype as any, 'get')
      .mockResolvedValue(MOCK_GET_RESULT);

    await api.getAvatarUrl(AVATAR_PATH);

    expect(getSpy).toHaveBeenCalledWith(EXPECTED_GET_ARG);
  });
});
