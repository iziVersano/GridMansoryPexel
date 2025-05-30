import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import 'dotenv/config';

global.TextEncoder = TextEncoder as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

