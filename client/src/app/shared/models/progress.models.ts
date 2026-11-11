export interface Activity {
  id: string;
  name: string | null;
  note: string | null;
  userId: string;
  stepInstanceId: string;
  createdAt: string;
}

export interface ProgressJourneyStep {
  id: string;
  journeyId: string;
  title: string;
  description: string | null;
  targetCount: number;
  sortOrder: number;
  videoUrl: string | null;
  groupChatPrompt: string | null;
  requiresGroupPost: boolean;
}

export interface ProgressJourney {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  type: 'INDIVIDUAL' | 'GROUP';
}

export interface ProgressJourneyInstance {
  id: string;
  journeyId: string;
  userId: string | null;
  groupId: string | null;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  journey: ProgressJourney;
  group: {
    id: string;
    name: string;
  } | null;
}

export interface StepProgress {
  id: string;
  journeyStepId: string;
  journeyInstanceId: string;
  userId: string;
  currentCount: number;
  completed: boolean;
  completedAt: string | null;
  journeyStep: ProgressJourneyStep;
  activities: Activity[];
  journeyInstance: ProgressJourneyInstance;
}

export interface CreateActivityPayload {
  name?: string;
  note?: string;
}

export interface UpdateActivityPayload {
  name?: string;
  note?: string;
}

export interface JournalEntry {
  id: string;
  activityId: string;
  stepProgressId: string;

  name: string | null;
  note: string | null;
  createdAt: string;

  journeyId: string;
  journeyTitle: string;
  journeyIcon: string | null;
  journeyType: 'INDIVIDUAL' | 'GROUP';
  groupName: string | null;

  stepTitle: string;
}
