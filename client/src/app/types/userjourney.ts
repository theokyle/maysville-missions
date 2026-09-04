export interface UserJourney {
  id: string;

  status: JourneyStatus;

  startedAt: string;

  completed: boolean;
  completedAt: string | null;

  journey: Journey;

  taskProgress: UserTaskProgress[];
}

export interface Journey {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;

  tasks?: JourneyTask[];
}

export interface JourneyTask {
  id: string;
  title: string;
  description: string | null;

  targetCount: number;
  sortOrder: number;
}

export interface UserTaskProgress {
  id: string;

  currentCount: number;
  completed: boolean;
  completedAt: string | null;

  journeyTask: JourneyTask;

  //   activities: Activity[];
}

// export interface Activity {
//   id: string;
//   name: string | null;
//   note: string | null;
//   createdAt: string;
// }

export type JourneyStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
