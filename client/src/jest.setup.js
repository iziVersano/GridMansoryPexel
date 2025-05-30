// Inject VITE_PEXELS_API_KEY into Jest environment
process.env.VITE_PEXELS_API_KEY = 'H2DLMUIjOmHTaj7Y0ULLdmQCd5xUDlknmNlG7S8BLDJNCEF8545SFXGW';

// Mock import.meta.env for Jest tests
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_PEXELS_API_KEY: 'H2DLMUIjOmHTaj7Y0ULLdmQCd5xUDlknmNlG7S8BLDJNCEF8545SFXGW',
      },
    },
  },
  writable: true,
  configurable: true,
});

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;