# Development Guide

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run linting
npm run lint

# Run tests
npm run test

# Build for production
npm run build
```

## Development Workflow

### Daily Development

1. **Pull latest changes**
   ```bash
   git pull origin master
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes and test locally**
   ```bash
   npm run dev
   # Test at http://localhost:3000
   ```

4. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: description of changes"
   ```

5. **Push to GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request on GitHub**

### Before Committing

- [ ] Code passes linting (`npm run lint`)
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] Tests pass (if applicable)
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors in browser
- [ ] Responsive design tested

## Environment Setup

1. **Copy environment template**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in required variables**
   - Supabase credentials
   - OpenAI API key (if using AI features)
   - Other service keys

3. **Never commit `.env.local`** (already in .gitignore)

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── admin/             # CMS admin pages
│   ├── api/               # API routes
│   ├── calculators/       # Calculator pages
│   └── ...
├── components/            # React components
│   ├── admin/            # Admin/CMS components
│   ├── calculators/      # Calculator components
│   ├── common/           # Shared components
│   └── ui/               # UI primitives
├── lib/                   # Utility libraries
│   ├── api.ts            # API client
│   ├── supabase/         # Supabase utilities
│   └── ...
├── types/                 # TypeScript type definitions
├── public/                # Static assets
└── docs/                  # Documentation
```

## Common Tasks

### Adding a New Calculator

1. Create component in `components/calculators/`
2. Create page in `app/calculators/[name]/page.tsx`
3. Add route to navigation config
4. Update calculator index page

### Adding a New API Route

1. Create route file in `app/api/[route]/route.ts`
2. Add proper error handling
3. Add input validation
4. Document in API docs (if applicable)

### Database Changes

1. Create migration file in `supabase/migrations/`
2. Test migration locally
3. Document schema changes
4. Update TypeScript types if needed

## Debugging

### Common Issues

**Port already in use:**
```bash
# Kill process on port 3000
npx kill-port 3000
```

**Module not found:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

**TypeScript errors:**
```bash
# Check types
npx tsc --noEmit
```

## Best Practices

1. **Always test locally before pushing**
2. **Write descriptive commit messages**
3. **Keep PRs focused and small**
4. **Update documentation for new features**
5. **Follow existing code patterns**
6. **Use TypeScript types properly**
7. **Handle errors gracefully**
8. **Optimize for performance**

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)






