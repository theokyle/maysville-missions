export interface Journey {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
  tasks: JourneyTask[];
}

export interface JourneyTask {
  id: string;
  title: string;
  description: string | null;
  targetCount: number;
  sortOrder: number;
}
