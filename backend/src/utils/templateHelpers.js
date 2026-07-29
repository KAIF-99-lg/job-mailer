/**
 * Generate greeting based on available HR/company info.
 * @param {string|null} hrName
 * @param {string|null} company
 * @returns {string}
 */
const generateGreeting = (hrName, company) => {
  if (hrName && hrName.trim()) {
    return `Dear ${hrName.trim()},`;
  }
  if (company && company.trim()) {
    return `Dear Hiring Team at ${company.trim()},`;
  }
  return 'Dear Hiring Manager,';
};

/**
 * Replace template variables with actual values.
 * Supports: {{company}}, {{hrName}}, {{role}}, {{candidateName}},
 *           {{phone}}, {{email}}, {{linkedin}}, {{github}}, {{leetcode}}, {{greeting}}
 * @param {string} template - Raw template string
 * @param {object} variables - Key-value map of replacements
 * @returns {string}
 */
const replaceTemplateVariables = (template, variables) => {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(regex, value || '');
  });
  return result;
};

/**
 * Generate email subject line.
 * @param {string} role
 * @param {string} candidateName
 * @param {string|null} customSubject
 * @returns {string}
 */
const generateSubject = (role, candidateName, customSubject = null) => {
  const base = (customSubject && customSubject.trim()) ? customSubject.trim() : `Application for ${role} | ${candidateName}`;
  return replaceTemplateVariables(base, { candidateName, role });
};

/**
 * Pause execution for a given number of milliseconds.
 * Used for sequential email sending with delay.
 * @param {number} ms
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = { generateGreeting, replaceTemplateVariables, generateSubject, sleep };
