// API endpoint URL - usar siempre la URL real para evitar problemas de proxy
const API_URL = 'https://www.lokdis.com/back-end-lokdis-app';

/**
 * Updates or creates a user in the backend
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} - API response
 */
export const updateUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/update-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error(`Backend error ${response.status}: ${await response.text()}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Formats the current date in a format like 'YYYY-MM-DD HH:MM:SS'
 * @returns {string} - Formatted date string
 */
export const getCurrentFormattedDate = () => {
  const now = new Date();
  
  const pad = (num) => String(num).padStart(2, '0');
  
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * Validates that a user is at least 14 years old
 * @param {number} day - Day of birth
 * @param {number} month - Month of birth (1-12)
 * @param {number} year - Year of birth
 * @returns {boolean} - True if the user is at least 14 years old
 */
export const validateUserAge = (day, month, year) => {
  const today = new Date();
  let age = today.getFullYear() - year;
  
  // Adjust age if birthday hasn't occurred yet this year
  if (today.getMonth() + 1 < month || 
      (today.getMonth() + 1 === month && today.getDate() < day)) {
    age--;
  }
  
  return age >= 14;
};

/**
 * Validates date inputs
 * @param {Object} dateParams - Object containing day, month, year
 * @returns {Object} - Validation result with isValid flag and error message
 */
export const validateBirthdate = (day, month, year) => {
  // Check that all values are present
  if (!day || !month || !year) {
    return { 
      isValid: false, 
      error: 'Please complete all date fields' 
    };
  }
  
  // Convert to numbers and validate
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  
  if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
    return { 
      isValid: false, 
      error: 'Please enter a valid date' 
    };
  }
  
  // Basic date validation
  if (monthNum < 1 || monthNum > 12) {
    return { 
      isValid: false, 
      error: 'Invalid month' 
    };
  }
  
  // Get max days in this month
  const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
  if (dayNum < 1 || dayNum > daysInMonth) {
    return { 
      isValid: false, 
      error: 'Invalid day for selected month' 
    };
  }
  
  // Verify year is within reasonable range
  const currentYear = new Date().getFullYear();
  if (yearNum < currentYear - 120 || yearNum > currentYear) {
    return { 
      isValid: false, 
      error: 'Invalid year' 
    };
  }
  
  // Verify age requirement (at least 14 years old)
  if (!validateUserAge(dayNum, monthNum, yearNum)) {
    return { 
      isValid: false, 
      error: 'You must be at least 14 years old to register' 
    };
  }
  
  // All validations passed
  return { 
    isValid: true, 
    error: null,
    formattedDate: `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
  };
}; 