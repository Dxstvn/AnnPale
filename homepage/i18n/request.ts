import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
const locales = ['en', 'fr', 'ht'];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  // If invalid, default to 'en' instead of throwing notFound
  const validLocale = locales.includes(locale as any) ? locale : 'en';

  try {
    return {
      locale: validLocale,
      messages: {
        common: (await import(`../locales/${validLocale}/common.json`)).default,
        auth: (await import(`../locales/${validLocale}/auth.json`)).default,
        creator: (await import(`../locales/${validLocale}/creator.json`)).default,
        fan: (await import(`../locales/${validLocale}/fan.json`)).default,
        errors: (await import(`../locales/${validLocale}/errors.json`)).default,
        checkout: (await import(`../locales/${validLocale}/checkout.json`)).default,
        orders: (await import(`../locales/${validLocale}/orders.json`)).default,
      }
    };
  } catch (error) {
    console.warn(`Failed to load translations for locale: ${validLocale}`, error);
    // Return empty messages as fallback
    return {
      locale: validLocale,
      messages: {
        common: {},
        auth: {},
        creator: {},
        fan: {},
        errors: {},
        checkout: {},
        orders: {},
      }
    };
  }
});