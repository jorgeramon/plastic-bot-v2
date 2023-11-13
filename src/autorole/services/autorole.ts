import { IAutoRole } from '@autorole/interfaces/autorole';
import { RuntimeException } from '@common/exceptions/runtime';
import { AutoRoleMessageRepository } from '@database/repositories/autorole-message';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AutoRoleService {
  constructor(
    private readonly autoRoleMessageRepository: AutoRoleMessageRepository,
  ) {}

  async addAutoRole(data: IAutoRole): Promise<void> {
    const document = await this.autoRoleMessageRepository.findOneByMessage(
      data.message,
    );

    if (
      document?.roles?.find(
        (x) => x.role === data.role || x.emoji === data.emoji,
      )
    ) {
      throw new RuntimeException(
        'El mensaje ya tiene configurado el mismo rol o el mismo emoji',
      );
    }

    await this.autoRoleMessageRepository.upsertPush(
      data.message,
      data.role,
      data.emoji,
    );
  }
}
