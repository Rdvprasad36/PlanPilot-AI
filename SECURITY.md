# Security Policy

## Threat Model (STRIDE)
- **Spoofing**: Prevented via Zod request validation and structured schemas.
- **Tampering**: Prevented via server-side checksum and Zod output repair.
- **Repudiation**: Request ID correlation logging via Pino.
- **Information Disclosure**: Gemini API key resides solely in server environment variables (`GEMINI_API_KEY`).
- **Denial of Service**: Rate limiting (20 req/min/IP) and body size limits (10 KB).
- **Elevation of Privilege**: Strict CSP headers and helmet protection.

## Reporting Vulnerabilities
Please report security issues privately to the repository maintainers.
