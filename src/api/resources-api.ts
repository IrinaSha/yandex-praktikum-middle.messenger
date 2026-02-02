import { ApiBase } from './api-base';

export class ResourcesApi extends ApiBase {
  constructor() {
    super('/resources');
  }

  public getAvatarUrl(avatarPath: string | null): Promise<any> {
    return this.get(`/${avatarPath}`);
  }
}
