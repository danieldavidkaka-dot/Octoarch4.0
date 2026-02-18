import { STRATEGIC_TEMPLATES } from './strategic';
import { TECHNICAL_TEMPLATES } from './technical';
import { COMMUNICATION_TEMPLATES } from './communication'; // ✅ Nuevos templates

export const ARCH_LIBRARY = {
    ...STRATEGIC_TEMPLATES,
    ...TECHNICAL_TEMPLATES,
    ...COMMUNICATION_TEMPLATES // ✅ Integración
};