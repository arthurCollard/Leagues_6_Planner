const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';


export const DEV_FLAGS = {
  guide: isDev,
};

export const PROD_FLAGS = {
  // Add prod-only features here
};

export const FLAGS = { ...PROD_FLAGS, ...(isDev ? DEV_FLAGS : {}) };
