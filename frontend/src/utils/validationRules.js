import { YEAR_RANGE, FILE_CONSTRAINTS } from '../constants/formConstants.js';

export const VALIDATION_RULES = {
  fullName: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Full name must contain only letters and spaces, minimum 2 characters'
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  phone: {
    required: true,
    pattern: /^[\+]?[\d\s\-\(\)]{10,}$/,
    message: 'Please enter a valid phone number (minimum 10 digits)'
  },
  medicalSchool: {
    required: true,
    minLength: 3,
    message: 'Medical school name is required (minimum 3 characters)'
  },
  graduationYear: {
    required: true,
    pattern: /^\d{4}$/,
    min: YEAR_RANGE.MIN,
    max: YEAR_RANGE.MAX,
    message: 'Please enter a valid graduation year'
  },
  city: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'City name must contain only letters and spaces, minimum 2 characters'
  },
  usmleId: {
    required: false,
    pattern: /^[A-Z0-9-]+$/,
    message: 'USMLE ID should contain only uppercase letters, numbers, and hyphens'
  },
  mbbsRegNo: {
    required: false,
    pattern: /^[A-Z0-9\/\-]+$/,
    message: 'Registration number should contain only uppercase letters, numbers, slashes, and hyphens'
  },
  nationality: {
    required: false,
    minLength: 2,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Nationality must contain only letters and spaces'
  },
  address: {
    required: false,
    minLength: 10,
    message: 'Address should be at least 10 characters long'
  },
  // Education validations
  medicalSchoolName: {
    required: true,
    minLength: 3,
    message: 'Medical school name is required (minimum 3 characters)'
  },
  country: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Country name is required and must contain only letters and spaces'
  },
  joiningDate: {
    required: true,
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    message: 'Please enter a valid joining date'
  },
  completionDate: {
    required: true,
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    message: 'Please enter a valid completion date'
  },
  percentage: {
    required: false,
    pattern: /^\d{1,3}(\.\d{1,2})?$/,
    min: 0,
    max: 100,
    message: 'Percentage must be between 0 and 100'
  },
  // USMLE validations
  step2ckScore: {
    required: false,
    pattern: /^\d{3}$/,
    min: 194,
    max: 300,
    message: 'Step 2 CK score must be between 194 and 300'
  },
  // Experience validations
  title: {
    required: true,
    minLength: 3,
    message: 'Title is required (minimum 3 characters)'
  },
  organization: {
    required: true,
    minLength: 2,
    message: 'Organization name is required (minimum 2 characters)'
  },
  hospital: {
    required: true,
    minLength: 2,
    message: 'Hospital name is required (minimum 2 characters)'
  },
  duration: {
    required: true,
    minLength: 3,
    message: 'Duration is required (e.g., "6 months", "2 years")'
  },
  position: {
    required: true,
    minLength: 2,
    message: 'Position is required (minimum 2 characters)'
  },
  role: {
    required: true,
    minLength: 2,
    message: 'Role is required (minimum 2 characters)'
  },
  description: {
    required: false,
    minLength: 10,
    message: 'Description should be at least 10 characters long'
  },
  // Publication validations
  publicationTitle: {
    required: true,
    minLength: 5,
    message: 'Publication title is required (minimum 5 characters)'
  },
  journal: {
    required: true,
    minLength: 3,
    message: 'Journal name is required (minimum 3 characters)'
  },
  year: {
    required: true,
    pattern: /^\d{4}$/,
    min: 1990,
    max: new Date().getFullYear() + 1,
    message: 'Please enter a valid year'
  },
  // Conference validations
  conferenceName: {
    required: true,
    minLength: 5,
    message: 'Conference name is required (minimum 5 characters)'
  },
  conferenceRole: {
    required: true,
    minLength: 3,
    message: 'Your role in the conference is required'
  },
  // Achievement validations
  achievementTitle: {
    required: true,
    minLength: 3,
    message: 'Achievement title is required (minimum 3 characters)'
  },
  achievementDescription: {
    required: false,
    minLength: 10,
    message: 'Description should be at least 10 characters long'
  },
  achievementDate: {
    required: false,
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    message: 'Please enter a valid date'
  },
  url: {
    required: false,
    pattern: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&=]*)$/,
    message: 'Please enter a valid URL (must start with http:// or https://)'
  },
  // Skills validation
  skills: {
    required: false,
    minLength: 10,
    message: 'Skills description should be at least 10 characters long'
  },
  significantAchievements: {
    required: false,
    minLength: 10,
    message: 'Achievements description should be at least 10 characters long'
  }
};

export const validateField = (fieldName, value, customRule = null) => {
  const rule = customRule || VALIDATION_RULES[fieldName];
  if (!rule) return '';

  // Required validation
  if (rule.required && (!value || value.toString().trim() === '')) {
    return `${fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
  }

  // Skip other validations if field is empty and not required
  if (!value || value.toString().trim() === '') return '';

  // Pattern validation
  if (rule.pattern && !rule.pattern.test(value)) {
    return rule.message;
  }

  // Length validation
  if (rule.minLength && value.toString().length < rule.minLength) {
    return rule.message;
  }

  if (rule.maxLength && value.toString().length > rule.maxLength) {
    return rule.message;
  }

  // Number range validation
  if (rule.min !== undefined && parseFloat(value) < rule.min) {
    return rule.message;
  }
  if (rule.max !== undefined && parseFloat(value) > rule.max) {
    return rule.message;
  }

  return '';
};

export const validateFile = (file, fileType = 'PHOTO') => {
  const constraints = FILE_CONSTRAINTS[fileType];
  
  if (!file) return '';
  
  // Size validation
  if (file.size > constraints.MAX_SIZE) {
    const maxSizeMB = constraints.MAX_SIZE / (1024 * 1024);
    return `File size should be less than ${maxSizeMB}MB`;
  }
  
  // Type validation
  if (!constraints.ACCEPTED_TYPES.includes(file.type)) {
    return `Please select a valid file type: ${constraints.ACCEPTED_EXTENSIONS}`;
  }
  
  return '';
};

export const validateLanguage = (language) => {
  const errors = {};
  
  if (!language.language || language.language.trim() === '') {
    errors.language = 'Language selection is required';
  }
  
  if (!language.fluency || language.fluency.trim() === '') {
    errors.fluency = 'Fluency level is required';
  }
  
  return errors;
};

// Validate entire form section
export const validateFormSection = (sectionName, data) => {
  const errors = {};
  
  switch (sectionName) {
    case 'basicDetails':
      const requiredFields = ['fullName', 'email', 'phone', 'medicalSchool', 'graduationYear', 'city'];
      const optionalFields = ['usmleId', 'mbbsRegNo', 'nationality', 'address'];
      
      [...requiredFields, ...optionalFields].forEach(field => {
        const error = validateField(field, data[field]);
        if (error) errors[field] = error;
      });
      
      // Validate languages
      if (data.languages && data.languages.length > 0) {
        data.languages.forEach((lang, index) => {
          const langErrors = validateLanguage(lang);
          if (Object.keys(langErrors).length > 0) {
            errors[`language_${index}`] = langErrors;
          }
        });
      }
      break;
      
    case 'education':
      ['medicalSchoolName', 'country', 'joiningDate', 'completionDate'].forEach(field => {
        const error = validateField(field, data[field]);
        if (error) errors[field] = error;
      });
      
      // Validate percentages
      ['firstYearPercentage', 'secondYearPercentage', 'preFinalYearPercentage', 'finalYearPercentage'].forEach(field => {
        if (data[field]) {
          const error = validateField('percentage', data[field]);
          if (error) errors[field] = error;
        }
      });
      break;
      
    case 'usmleScores':
      if (data.step2ckScore) {
        const error = validateField('step2ckScore', data.step2ckScore);
        if (error) errors.step2ckScore = error;
      }
      break;
      
    default:
      break;
  }
  
  return errors;
};