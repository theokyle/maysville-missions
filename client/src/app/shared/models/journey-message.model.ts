export interface JourneyMessage {
  id: string;
  journeyInstanceId: string;
  userId: string;
  journeyStepId?: string | null;
  parentId?: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string | null;
  };
  replies?: JourneyMessage[];
}

export interface CreateJourneyMessageDto {
  content: string;
  journeyStepId?: string;
}

export interface CreateJourneyReplyDto {
  content: string;
}

export interface UpdateJourneyMessageDto {
  content: string;
}
