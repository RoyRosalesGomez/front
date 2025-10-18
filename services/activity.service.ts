// front/services/activity.service.ts
import { api } from '@/lib/api';

export type ActivityType =
  | 'USER_CREATED'
  | 'USER_STATUS_CHANGED'
  | 'PRODUCT_SUBMITTED'
  | 'PRODUCT_APPROVED'
  | 'PRODUCT_REJECTED'
  | 'VETSHOP_CREATED'
  | 'VETSHOP_TOGGLED'
  | 'VETSHOP_UPDATED';

export type Activity = {
  id: number;
  type: ActivityType;
  title: string;
  description: string;
  createdAt: string;
  meta?: any;
};

export class ActivityService {
  static async getRecent(days = 5, limit = 25): Promise<Activity[]> {
    return api.activities.recent(days, limit);
  }
}
