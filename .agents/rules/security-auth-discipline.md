# Rule: Security Discipline for Authentication & Verification

1. **No In-UI Secret Leakage**: Never display generated one-time passwords (OTPs), verification codes, session tokens, or temporary passwords directly on the user-facing screen or auto-fill them into input fields unless explicitly instructed by the user in writing.
2. **No Hardcoded Test PINs / Bypass Codes**: Never introduce fallback backdoor PINs (such as `123456` or `admin`) into production logic or verification routines. If mock testing is needed, isolate it in dedicated test suites or require explicit user authorization.
3. **Strict Delivery Channel Integrity**: Always enforce the real delivery mechanism (e.g., EmailJS, SMTP, SMS API). If external services fail or are misconfigured, report the transparent error message from the provider rather than compromising the security boundary.
