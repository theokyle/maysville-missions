export type JourneyType = 'INDIVIDUAL' | 'GROUP';

export type JourneyStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

export interface JourneyStep {
  id: string;
  journeyId: string;
  title: string;
  description?: string | null;
  targetCount: number;
  sortOrder: number;
  videoUrl?: string | null;
  groupChatPrompt?: string | null;
  requiresGroupPost: boolean;
}

export interface Journey {
  id: string;
  title: string;
  description?: string | null;
  icon?: string | null;
  type: JourneyType;
  videoUrl?: string | null;
  steps: JourneyStep[];
  createdAt?: string;
  updatedAt?: string;
}

export interface JourneyStepProgress {
  id: string;
  journeyInstanceId: string;
  journeyStepId: string;
  userId: string;
  currentCount: number;
  completed: boolean;
  completedAt?: string | null;
  journeyStep: JourneyStep;
  activities: Activity[];
}

export interface JourneyEnrollment {
  id: string;
  journeyId: string;
  userId?: string | null;
  groupId?: string | null;
  status: JourneyStatus;
  startedAt: string;
  completedAt?: string | null;
  journey: Journey;
  stepInstances: JourneyStepProgress[];
}

export interface Activity {
  id: string;
  name: string | null;
  note: string | null;
  userId: string;
  stepInstanceId: string;
  createdAt: string;
}
