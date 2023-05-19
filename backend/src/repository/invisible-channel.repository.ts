import { Injectable } from '@nestjs/common';

import { ChannelRepository } from './channel.repository';

/**
 * private 채널만 관리하는 repository.
 */
@Injectable()
export class InvisibleChannelRepository extends ChannelRepository {}
