import { Journey, JourneyStepProgress } from './journeys.models';

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  joinedAt: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  members?: GroupMember[];
  journeyInstances?: GroupJourneyEnrollment[];
  createdAt: string;
  updatedAt: string;
}

export interface GroupJourneyEnrollment {
  id: string;
  journeyId: string;
  groupId: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  startedAt: string;
  completedAt: string | null;
  journey: Journey;
  stepInstances: JourneyStepProgress[];
}
