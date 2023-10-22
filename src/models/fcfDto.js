/**
 * @typedef {Object} FcfDto
 * @property {string} ticker - The stock's unique identifier.
 * @property {Map} fcfData - The stock's FCF alond the years.
 * @property {Date} createdAt - The date when the object was created.
 */

/**
 * Create a new FCF DTO.
 * @param {string} ticker - The stocks's unique identifier.
 * @param {string} fcfData - FCF Data.
 * @returns {FcfDto} The created user.
 */
const createFcfDto = (ticker, fcfData) => {
    const user = {
      ticker,
      fcfData,
      createdAt: new Date()
    };
    return user;
  }

  