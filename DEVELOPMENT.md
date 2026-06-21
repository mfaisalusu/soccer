# Development Guide

## 🎯 Setup for Development

### 1. Initial Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/soccer.git
cd soccer

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 2. Get API Key

1. Visit [Football-Data.org](https://www.football-data.org/client/register)
2. Register for a free account
3. Get your API key from the dashboard
4. Add to `.env`:
   ```
   WORLD_CUP_API_KEY=your_api_key_here
   ```

### 3. Start Development Server

```bash
npm start
# Opens at http://localhost:4200
```

## 🏗️ Architecture Decisions

### Clean Code Architecture

**Components**
- Responsible only for UI rendering
- Input/Output via @Input and @Output
- No business logic
- Standalone components for better modularity

**Services**
- Handle API calls and data transformation
- Provide caching mechanisms
- Use dependency injection
- Follow single responsibility principle

**Models**
- Define TypeScript interfaces
- Ensure type safety
- Document data structures

### Folder Structure Philosophy

```
app/
├── components/     # UI layer - dumb components
├── services/       # Business logic layer
├── models/         # Data layer - interfaces
└── utils/          # Helper functions
```

## 🎨 Design System

### Colors
- Primary: #667eea (Purple-Blue)
- Secondary: #764ba2 (Dark Purple)
- Success: #34a853 (Green)
- Warning: #ea4335 (Red)
- Background: #f5f7fa (Light Gray)

### Typography
- Font: System UI (-apple-system, BlinkMacSystemFont, etc.)
- Headings: 700 weight
- Body: 400 weight
- Sizes: 12px, 14px, 16px, 18px, 24px, 32px, 36px

### Spacing
- Base unit: 4px
- Common: 8px, 12px, 16px, 20px, 24px, 32px

## 🔄 Component Communication

### Parent to Child
```typescript
@Input() match: Match;
<app-match-card [match]="match"></app-match-card>
```

### Child to Parent
```typescript
@Output() filterChange = new EventEmitter();
this.filterChange.emit(filters);
```

## 📊 State Management

Currently using RxJS Observables. For larger apps, consider:
- NgRx
- Akita
- NgXS

## 🧪 Testing Strategy

### Unit Tests
- Test services with mock data
- Test component inputs/outputs
- Mock HTTP calls

### E2E Tests
- Test user workflows
- Test filter functionality
- Test responsive behavior

### Example Unit Test
```typescript
describe('UtilityService', () => {
  let service: UtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilityService);
  });

  it('should format dates correctly', () => {
    const date = new Date('2026-06-12');
    expect(service.formatDate(date)).toBeDefined();
  });
});
```

## 🚀 Performance Tips

1. **Use TrackBy in *ngFor**
```typescript
trackByMatchId(index: number, match: Match) {
  return match.id;
}
```

2. **Unsubscribe from Observables**
```typescript
private destroy$ = new Subject<void>();

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

3. **Cache API Responses**
```typescript
private matches$: Observable<Match[]> | null = null;
```

4. **Use ChangeDetectionStrategy.OnPush**
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

## 🐛 Debugging

### Development Tools
- Angular DevTools Chrome Extension
- VS Code Debugger
- Browser DevTools

### Common Issues

**API Request Fails**
- Check API key validity
- Verify CORS headers
- Check daily request limit

**Styling Issues**
- Clear browser cache
- Check CSS specificity
- Verify media query breakpoints

**Component Not Showing**
- Check ngIf conditions
- Verify @Input bindings
- Check console for errors

## 📈 Building for Production

### SSG Build
```bash
npm run build:ssg
```

### Static File Optimization
1. Images are cached with Service Worker
2. CSS is minified
3. JavaScript is tree-shaken
4. HTML is pre-rendered

### Bundle Size Analysis
```bash
npm run build -- --stats-json
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/world-cup-schedule/stats.json
```

## 🔗 Git Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code improvements
- `docs/description` - Documentation

### Commit Messages
```
feat: Add match filtering
fix: Resolve API caching issue
docs: Update README
refactor: Clean up service code
```

## 📝 Code Style

### TypeScript
- Use strict mode
- Define interfaces for all data
- Use meaningful variable names

### HTML
- Use semantic tags
- Add ARIA labels
- Keep templates simple

### CSS
- Use CSS custom properties for colors
- Mobile-first approach
- Avoid inline styles

## 🤝 Contributing

1. Create feature branch
2. Make changes with tests
3. Submit PR with description
4. Wait for review
5. Merge when approved

## 📚 Resources

- [Angular Documentation](https://angular.io)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [MDN Web Docs](https://developer.mozilla.org)
- [Football-Data.org API](https://www.football-data.org/documentation)

---

Happy coding! 🎉
