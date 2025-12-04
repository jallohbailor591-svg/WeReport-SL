# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously at WeReport. If you discover a security vulnerability, please follow these steps:

### How to Report

1. **DO NOT** create a public GitHub issue for the vulnerability
2. Email security@wereport.sl with details:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
3. Use subject line: "Security Vulnerability Report - [Brief Description]"

### What to Expect

- **Acknowledgment**: Within 24 hours
- **Initial Assessment**: Within 72 hours
- **Regular Updates**: Every 7 days until resolved
- **Resolution Timeline**: Critical issues within 7 days, others within 30 days

### Disclosure Policy

- We request 90 days before public disclosure
- We will credit reporters in our security advisories (unless you prefer anonymity)
- We may provide a bug bounty for significant findings

## Security Measures

### Authentication & Authorization
- Supabase Auth with JWT tokens
- Role-based access control (RBAC)
- Row Level Security (RLS) on all tables
- Session management with secure cookies

### Data Protection
- All data encrypted in transit (TLS 1.3)
- Database encryption at rest
- Input sanitization on all endpoints
- Output encoding to prevent XSS

### API Security
- Rate limiting on all endpoints
- CORS configuration
- CSRF protection
- Request validation with Zod schemas

### Infrastructure
- Security headers (CSP, HSTS, X-Frame-Options)
- Regular dependency updates
- Automated security scanning
- Penetration testing quarterly

### Monitoring
- Error tracking with Sentry
- Audit logging for admin actions
- Real-time alerts for suspicious activity
- Regular security log reviews

## Security Best Practices for Developers

1. **Never commit secrets** to version control
2. **Validate all inputs** server-side
3. **Use prepared statements** for database queries
4. **Implement proper error handling** without exposing sensitive info
5. **Keep dependencies updated** regularly
6. **Follow principle of least privilege** for permissions
7. **Review code** for security issues before merging
8. **Test security** as part of CI/CD pipeline

## Compliance

WeReport complies with:
- GDPR (General Data Protection Regulation)
- ISO 27001 guidelines
- OWASP Top 10 security risks mitigation

## Contact

For non-security bugs, please use GitHub Issues.
For security concerns, email: security@wereport.sl
