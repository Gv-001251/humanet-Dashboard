const isProduction = process.env.NODE_ENV === 'production';

const baseCookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: isProduction,
  path: '/'
};

const accessTokenCookieOptions = {
  ...baseCookieOptions,
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
};

const refreshTokenCookieOptions = {
  ...baseCookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

const clearCookieOptions = {
  ...baseCookieOptions,
  maxAge: 0
};

module.exports = {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  clearCookieOptions
};
