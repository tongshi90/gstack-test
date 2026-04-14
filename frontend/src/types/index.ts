export interface News {
  id: number;
  title: string;
  content: string;
  category: 'SCHOOL_INTRO' | 'CAMPUS_NEWS' | 'EXCELLENT_TEACHERS_STUDENTS';
  coverImage?: string;
  publishTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  isPinned: boolean;
  publishTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentInfo {
  name: string;
  gender: 'male' | 'female';
  birthDate: string;
  idCard: string;
  address: string;
  phone: string;
}

export interface ParentInfo {
  name: string;
  phone: string;
  workUnit?: string;
}

export interface ParentsInfo {
  father: ParentInfo;
  mother: ParentInfo;
}

export interface Registration {
  id: number;
  registrationNumber: string;
  student: StudentInfo;
  parents: ParentsInfo;
  status: 'draft' | 'submitted';
  createdAt: string;
  updatedAt: string;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
}

export type NewsCategory = 'SCHOOL_INTRO' | 'CAMPUS_NEWS' | 'EXCELLENT_TEACHERS_STUDENTS';
export const NEWS_CATEGORIES: readonly NewsCategory[] = ['SCHOOL_INTRO', 'CAMPUS_NEWS', 'EXCELLENT_TEACHERS_STUDENTS'] as const;

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  SCHOOL_INTRO: '学校简介',
  CAMPUS_NEWS: '校园动态',
  EXCELLENT_TEACHERS_STUDENTS: '优秀师生',
};