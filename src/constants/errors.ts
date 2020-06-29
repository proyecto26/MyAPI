export default {
  // COMMON ERRORS
  UNIQUE_VIOLATION: 'Another record with the same identifier already exists',

  // USER CUSTOM ERRORS
  USER_INVALID_PASSWORD: 'It is required to activate the account to be able to enter, please check your email to proceed with the activation',
  USER_INACTIVE: 'This account is inactive, please contact our call center at number (XX) XXX XX XX',
  USER_EMAIL_ALREADY_EXISTS: 'A user with the entered email already exists',
  USER_DOCUMENT_ALREADY_EXISTS: 'A user with the entered document already exists',
  USER_HAS_DOCUMENT_TYPE: 'There are users with the selected document type',

  // ROLE CUSTOM ERRORS
  ROLE_USER_DELETION: 'User role cannot be removed',
  ROLE_ADMIN_DELETION: 'Admin role cannot be removed',
}