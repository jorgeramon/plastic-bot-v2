import { Environment } from '@common/enums/environment';
import { TwitchEndpoints } from '@common/enums/twitch-endpoints';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from '@twitch/decorators/refresh-token';
import { ITwitchResponse } from '@twitch/interfaces/twitch-response';
import { ITwitchSubscription } from '@twitch/interfaces/twitch-subscription';
import { ITwitchToken } from '@twitch/interfaces/twitch-token';
import { ITwitchUser } from '@twitch/interfaces/twitch-user';
import axios, { AxiosResponse } from 'axios';
import { URLSearchParams } from 'url';

@Injectable()
export class TwitchApiService {
  private token: string;

  private readonly CLIENT_ID: string;
  private readonly CLIENT_SECRET: string;
  private readonly VERIFICATION_SECRET: string;
  private readonly logger: Logger = new Logger(TwitchApiService.name);

  constructor(private readonly configService: ConfigService) {
    this.CLIENT_ID = this.configService.get<string>(Environment.TWITCH_CLIENT);
    this.CLIENT_SECRET = this.configService.get<string>(
      Environment.TWITCH_SECRET,
    );
    this.VERIFICATION_SECRET = this.configService.get<string>(
      Environment.TWITCH_VERIFICATION_SECRET,
    );
  }

  @RefreshToken()
  async getUserByAccount(account: string): Promise<ITwitchUser | null> {
    this.logger.debug(`Getting "${account}" user information...`);

    const response: AxiosResponse<ITwitchResponse<ITwitchUser>> =
      await axios.get(TwitchEndpoints.USERS, {
        params: {
          login: account,
        },
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Client-Id': this.CLIENT_ID,
        },
      });

    return response.data.data[0] || null;
  }

  // TODO: Agregar parámetros para soportar paginación
  @RefreshToken()
  async getSubscriptions(): Promise<ITwitchSubscription[]> {
    this.logger.debug('Getting current subscriptions...');

    const response: AxiosResponse<ITwitchResponse<ITwitchSubscription>> =
      await axios.get(`${TwitchEndpoints.SUBSCRIPTIONS}/?first=100`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Client-Id': this.CLIENT_ID,
        },
      });

    return response.data.data;
  }

  @RefreshToken()
  async createSubscription(id: string): Promise<ITwitchSubscription> {
    this.logger.debug(`Subscribing to "${id}"...`);

    const response: AxiosResponse<ITwitchResponse<ITwitchSubscription>> =
      await axios.post(
        TwitchEndpoints.SUBSCRIPTIONS,
        {
          type: 'stream.online',
          version: 1,
          condition: {
            broadcaster_user_id: id,
          },
          transport: {
            method: 'webhook',
            callback: TwitchEndpoints.CALLBACK,
            secret: this.VERIFICATION_SECRET,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Client-Id': this.CLIENT_ID,
          },
        },
      );

    return response.data.data[0];
  }

  private async authorize(): Promise<void> {
    this.logger.debug('Getting authorization token...');

    const response: AxiosResponse<ITwitchToken> = await axios.post(
      TwitchEndpoints.TOKEN,
      new URLSearchParams({
        client_id: this.CLIENT_ID,
        client_secret: this.CLIENT_SECRET,
        grant_type: 'client_credentials',
      }).toString(),
    );

    this.token = response.data.access_token;

    this.logger.debug(`Token: ${this.token}`);
  }
}
