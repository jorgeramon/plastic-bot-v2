import { DatabaseModule } from "@database/database.module";
import { Module } from "@nestjs/common";
import { AccountGateway } from "@streamer/gateways/account";
import { StreamerService } from "./services/streamer";

@Module({
  imports: [DatabaseModule],
  providers: [
    AccountGateway,
    StreamerService
  ]
})
export class StreamerModule {}