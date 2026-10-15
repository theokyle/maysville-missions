export type JourneyType = 'INDIVIDUAL' | 'GROUP';

export type JourneyStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

export interface Journey {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  type: JourneyType;
  createdAt: string;
  updatedAt: string;
  steps: JourneyStep[];
}

export interface JourneyStep {
  id: string;
  journeyId: string;
  title: string;
  description: string | null;
  targetCount: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface JourneyInstance {
  id: string;
  journeyId: string;
  journey: Journey;
  userId: string | null;
  groupId: string | null;
  status: JourneyStatus;
  startedAt: string;
  completedAt: string | null;
  stepInstances?: JourneyStepInstance[];
}

export interface JourneyStepInstance {
  id: string;
  journeyInstanceId: string;
  journeyStepId: string;
  currentCount: number;
  completed: boolean;
  completedAt: string | null;
  journeyStep: JourneyStep;
  activities?: Activity[];
}

export interface Activity {
  id: string;
  name: string | null;
  note: string | null;
  userId: string;
  stepInstanceId: string;
  createdAt: string;
}
