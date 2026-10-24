import type { AccessAttr, AccessCategory } from '../types';

export const ACCESS_GROUPS: Record<AccessCategory, AccessAttr[]> = {
  mobility: ['stepFree', 'accessibleWashroom', 'accessibleParking', 'seating'],
  vision: ['largePrint', 'audioDescription'],
  hearing: ['interpreter', 'captions'],
  sensory: ['lowNoise', 'noFlashing', 'quietSpace', 'lowCrowd'],
  cognitive: ['plainLanguage', 'supportPerson'],
};

export const ACCESS_CATEGORIES = Object.keys(ACCESS_GROUPS) as AccessCategory[];
