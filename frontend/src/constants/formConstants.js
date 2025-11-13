
export const GENDER_OPTIONS = [
  { value: '', label: 'Select Gender' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
];

export const LANGUAGE_OPTIONS = [
  'English',
  'Hindi', 
  'Spanish',
  'French',
  'German',
  'Mandarin',
  'Arabic',
  'Portuguese',
  'Russian',
  'Japanese'
];

export const FLUENCY_OPTIONS = [
  { value: '', label: 'Select Fluency' },
  { value: 'native', label: 'Native' },
  { value: 'fluent', label: 'Fluent' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'basic', label: 'Basic' },
  { value: 'beginner', label: 'Beginner' }
];

export const USMLE_STEP1_OPTIONS = [
  { value: 'not-taken', label: 'Not Taken' },
  { value: 'pass', label: 'Pass' },
  { value: 'fail', label: 'Fail' }
];

export const PUBLICATION_TYPES = [
  { value: 'research-article', label: 'Research Article' },
  { value: 'case-report', label: 'Case Report' }
];

export const FILE_CONSTRAINTS = {
  PHOTO: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ACCEPTED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    ACCEPTED_EXTENSIONS: '.jpg,.jpeg,.png,.gif'
  },
  CV: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ACCEPTED_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ACCEPTED_EXTENSIONS: '.pdf,.doc,.docx'
  },
  DOCUMENT: {   
    MAX_SIZE: 5 * 1024 * 1024, // 5 MB
    ACCEPTED_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'],
    ACCEPTED_EXTENSIONS: '.pdf, .doc, .docx, .jpg, .jpeg, .png',
  },
};

export const YEAR_RANGE = {
  MIN: 1990,
  MAX: new Date().getFullYear() + 10
};