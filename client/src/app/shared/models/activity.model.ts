export interface Activity {
  id: string;
  name?: string | null;
  note?: string | null;
  userId: string;
  stepInstanceId: string;
  createdAt: string;
}

export interface JourneyStepWithProgress {
  id: string;
  journeyInstanceId: string;
  journeyStepId: string;
  userId: string;
  currentCount: number;
  completed: boolean;
  completedAt?: string | null;
  journeyStep: import('./journeys.models.ts').JourneyStep;
  journeyInstance?: {
    id: string;
    journeyId: string;
    status: string;
    journey: import('./journeys.models.ts').Journey;
  };
}

export interface CreateActivityDto {
  name?: string;
  note?: string;
}

export interface UpdateActivityDto {
  name?: string;
  note?: string;
}
