# Deployment Guide

## Production Checklist

### Pre-Deployment

- [ ] Run all tests: `npm test && npm run e2e`
- [ ] Build successfully: `npm run build`
- [ ] Review environment variables
- [ ] Run database migrations
- [ ] Check RLS policies are enabled
- [ ] Review security headers
- [ ] Test in production mode locally

### Environment Variables

Required environment variables for production:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your-production-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

### Database Setup

1. Create Supabase project
2. Run migration scripts in order (scripts/001-004)
3. Verify RLS policies are active
4. Create first admin user manually in profiles table

### Vercel Deployment

1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Set build command: `npm run build`
4. Deploy

### Post-Deployment

- [ ] Verify health endpoint: `/api/health`
- [ ] Test authentication flow
- [ ] Create test issue
- [ ] Verify notifications work
- [ ] Test admin panel access
- [ ] Monitor error rates

## Monitoring

- Use Vercel Analytics for performance monitoring
- Set up Sentry for error tracking (optional)
- Monitor Supabase dashboard for database metrics
- Check `/api/health` endpoint regularly

## Performance Tips

- Enable Edge Runtime for API routes where possible
- Use Vercel's Image Optimization
- Implement CDN caching for static assets
- Monitor and optimize slow database queries
