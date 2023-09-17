/**
 * @typedef {Object} User
 * @property {number} id - The user's unique identifier.
 * @property {string} username - The user's username.
 * @property {string} email - The user's email address.
 * @property {Date} createdAt - The date when the user was created.
 */

/**
 * Create a new user.
 * @param {string} username - The user's username.
 * @param {string} email - The user's email address.
 * @returns {User} The created user.
 */
const createUser = (username, email) => {
  const user = {
    id: Date.now(), // Simulate a unique ID
    username,
    email,
    createdAt: new Date()
  };
  return user;
}

/**
 * Get user by ID.
 * @param {number} id - The user's unique identifier.
 * @returns {User|null} The found user, or null if not found.
 */
const getUserById = (id) => {
  // Simulate fetching user from a database
  const user =  /* Fetch user by ID */ {
    id: 1,
    username: 'nunofhfontes',
    email: 'email@gmail.com',
    createdAt: new Date()
  }
  return user || null;
}

module.exports = {
  createUser,
  getUserById
};
  