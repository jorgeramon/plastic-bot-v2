import { Environment } from '@common/enums/environment';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Endpoints } from '@twitch/enums/endpoints';
import { RefreshToken } from '@twitch/decorators/refresh-token';
import { ITwitchResponse } from '@twitch/interfaces/twitch-response';
import { ITwitchStream } from '@twitch/interfaces/twitch-stream';
import { ITwitchSubscription } from '@twitch/interfaces/twitch-subscription';
import { ITwitchToken } from '@twitch/interfaces/twitch-token';
import { ITwitchUser } from '@twitch/interfaces/twitch-user';
import axios, { AxiosResponse } from 'axios';
import { URLSearchParams } from 'url';
import { ITwitchGame } from '@twitch/interfaces/twitch-game';

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
  async getUserById(id: string): Promise<ITwitchUser | null> {
    this.logger.debug(`Getting "${id}" user information...`);

    const response: AxiosResponse<ITwitchResponse<ITwitchUser>> =
      await axios.get(Endpoints.USERS, {
        params: {
          id,
        },
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Client-Id': this.CLIENT_ID,
        },
      });

    return response.data.data[0] || null;
  }

  @RefreshToken()
  async getUserByLogin(login: string): Promise<ITwitchUser | null> {
    this.logger.debug(`Getting "${login}" user information...`);

    const response: AxiosResponse<ITwitchResponse<ITwitchUser>> =
      await axios.get(Endpoints.USERS, {
        params: {
          login,
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
      await axios.get(Endpoints.SUBSCRIPTIONS, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Client-Id': this.CLIENT_ID,
        },
        params: {
          first: 100,
        },
      });

    return response.data.data;
  }

  @RefreshToken()
  async createSubscription(id: string): Promise<ITwitchSubscription> {
    this.logger.debug(`Subscribing to "${id}"...`);

    const response: AxiosResponse<ITwitchResponse<ITwitchSubscription>> =
      await axios.post(
        Endpoints.SUBSCRIPTIONS,
        {
          type: 'stream.online',
          version: 1,
          condition: {
            broadcaster_user_id: id,
          },
          transport: {
            method: 'webhook',
            callback: Endpoints.CALLBACK,
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

  @RefreshToken()
  async deleteSubscription(id: string): Promise<void> {
    this.logger.debug(`Deleting subscription "${id}"...`);

    await axios.delete(Endpoints.SUBSCRIPTIONS, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Client-Id': this.CLIENT_ID,
      },
      params: {
        id,
      },
    });
  }

  @RefreshToken()
  async getStreamByUser(id: string): Promise<ITwitchStream | null> {
    this.logger.debug(`Getting "${id}" stream information...`);

    const response: AxiosResponse<ITwitchResponse<ITwitchStream>> =
      await axios.get(Endpoints.STREAMS, {
        params: {
          user_id: id,
        },
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Client-Id': this.CLIENT_ID,
        },
      });

    return response.data.data[0] || null;
  }

  @RefreshToken()
  async getGameById(id: string): Promise<ITwitchGame | null> {
    this.logger.debug(`Getting "${id}" game information...`);

    const response: AxiosResponse<ITwitchResponse<ITwitchGame>> =
      await axios.get(Endpoints.GAMES, {
        params: {
          id,
        },
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Client-Id': this.CLIENT_ID,
        },
      });

    return response.data.data[0] || null;
  }

  private async authorize(): Promise<void> {
    this.logger.debug('Getting authorization token...');

    const response: AxiosResponse<ITwitchToken> = await axios.post(
      Endpoints.TOKEN,
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
