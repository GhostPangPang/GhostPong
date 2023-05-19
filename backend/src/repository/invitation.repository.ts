import { Injectable } from '@nestjs/common';

import { Invitation } from './model/invitation';
import { Repository } from './repository.interface';

@Injectable()
export class InvitationRepository implements Repository<number, Invitation> {
  private readonly invitationList: Map<number, Invitation> = new Map<number, Invitation>();

  insert(invitation: Invitation): number {
    this.invitationList.set(invitation.userId, invitation);
    return invitation.userId;
  }

  update(userId: number, partialItem: Partial<Invitation>): Invitation | undefined {
    const invitation = this.invitationList.get(userId);
    if (invitation === undefined) {
      return undefined;
    }
    const updatedInvitation = { ...invitation, ...partialItem };
    this.invitationList.set(userId, { ...invitation, ...partialItem });
    return updatedInvitation;
  }

  delete(userId: number): boolean {
    return this.invitationList.delete(userId);
  }

  find(userId: number): Invitation | undefined {
    return this.invitationList.get(userId);
  }
}
