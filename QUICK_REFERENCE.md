# Quick Reference Guide

## 📋 Common Commands

```bash
# Installation
npm install
npm install package-name

# Development
npm start                 # Dev server (localhost:4200)
npm run build             # Production build
npm run build:ssg         # Build with SSG

# Code Quality
npm run lint              # ESLint
npm test                  # Unit tests
npm run e2e              # End-to-end tests

# Cleanup
npm run clean            # Remove dist and build files
npm run reinstall        # Clear node_modules and reinstall
```

## 🏗️ Project Structure Quick Reference

```
src/
├── app/
│   ├── components/        # UI components
│   │   ├── match-card/
│   │   ├── filter/
│   │   └── schedule-listing/
│   ├── services/          # Business logic
│   │   ├── world-cup-api.service.ts
│   │   └── utility.service.ts
│   ├── models/            # TypeScript interfaces
│   │   └── match.model.ts
│   ├── core/              # Core services
│   │   └── http-error.interceptor.ts
│   ├── app.component.ts   # Root component
│   └── environments/      # Configuration
├── main.ts                # Bootstrap
├── index.html             # HTML
└── styles.css             # Global CSS
```

## 🔧 Creating Components

```bash
# Generate component
ng generate component components/new-component

# Or manually:
# 1. Create folder in src/app/components
# 2. Create component.ts file
# 3. Make it standalone
# 4. Import in parent
```

```typescript
// Template
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-component',
  standalone: true,
  imports: [CommonModule],
  template: `<div>{{ title }}</div>`,
  styles: [`div { color: blue; }`]
})
export class NewComponentComponent {
  @Input() title = 'Default';
  @Output() clicked = new EventEmitter<void>();
}
```

## 📡 Creating Services

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewService {
  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get('/api/data');
  }
}
```

## 🎨 Common Styling Patterns

```css
/* Flexbox */
.flex-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

/* Grid */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

/* Responsive Text */
@media (max-width: 768px) {
  h1 {
    font-size: 24px;
  }
}

/* Gradient */
.gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Shadow */
.shadow {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Animation */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.3s ease;
}
```

## 🔄 Common RxJS Patterns

```typescript
// Subscribe and unsubscribe
private destroy$ = new Subject<void>();

ngOnInit() {
  this.service.getData()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.data = data);
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}

// Transform data
this.service.getData()
  .pipe(
    map(data => data.filter(x => x.active)),
    map(data => data.sort((a, b) => a.name.localeCompare(b.name)))
  )
  .subscribe(data => this.filteredData = data);

// Handle errors
this.service.getData()
  .pipe(
    catchError(error => {
      console.error('Error:', error);
      return of(null);
    })
  )
  .subscribe(data => this.data = data);

// Combine multiple observables
combineLatest([
  this.service.getMatches(),
  this.service.getTeams()
])
  .subscribe(([matches, teams]) => {
    this.matches = matches;
    this.teams = teams;
  });
```

## 📱 Responsive Breakpoints

```css
/* Mobile First */
/* Base styles for mobile */

/* Tablet */
@media (min-width: 768px) {
  /* Tablet styles */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Desktop styles */
}

/* Large Desktop */
@media (min-width: 1200px) {
  /* Large desktop styles */
}
```

## 🧪 Testing Examples

```typescript
// Unit test
describe('UtilityService', () => {
  let service: UtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should format date correctly', () => {
    const date = new Date('2026-06-12');
    const result = service.formatDate(date);
    expect(result).toEqual('12 Jun 2026');
  });
});

// Component test
describe('MatchCardComponent', () => {
  let component: MatchCardComponent;
  let fixture: ComponentFixture<MatchCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MatchCardComponent);
    component = fixture.componentInstance;
  });

  it('should display match info', () => {
    component.match = mockMatch;
    fixture.detectChanges();
    expect(component.match.homeTeam.name).toEqual('Argentina');
  });
});
```

## 🐛 Debugging Tips

```typescript
// Console logging
console.log('Data:', data);
console.error('Error:', error);
console.warn('Warning:', warning);
console.table(arrayData);

// Angular debugging
// Use ng.probe(el) in browser console
ng.getComponent($0).data

// Debugger statement
debugger;

// VS Code breakpoints
// Click on line number to set breakpoint
```

## 📦 Common Dependencies

```json
{
  "dependencies": {
    "@angular/core": "^17.0.0",
    "rxjs": "^7.8.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@angular/cli": "^17.0.0",
    "typescript": "~5.2.0"
  }
}
```

## 🔑 TypeScript Best Practices

```typescript
// Use interfaces
interface User {
  id: number;
  name: string;
  email: string;
}

// Use enums
enum Status {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending'
}

// Use generics
function getValue<T>(obj: T, key: keyof T): T[keyof T] {
  return obj[key];
}

// Use union types
type Result = Success | Error;

// Use optional properties
interface Config {
  name: string;
  description?: string;
}
```

## 🚀 Performance Tips

```typescript
// Use ChangeDetectionStrategy.OnPush
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// Use trackBy in *ngFor
<div *ngFor="let item of items; trackBy: trackById">

// Use async pipe
{{ data$ | async }}

// Use OnPush with shareReplay
private data$ = this.http.get(url).pipe(shareReplay(1));

// Unsubscribe properly
private destroy$ = new Subject<void>();
subscription.pipe(takeUntil(this.destroy$)).subscribe();
```

## 📚 Useful Links

- [Angular Docs](https://angular.io/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [RxJS Docs](https://rxjs.dev/)
- [Football-Data API](https://www.football-data.org/documentation)
- [MDN Web Docs](https://developer.mozilla.org)

## 🤔 FAQ

**Q: How do I add a new environment variable?**
A: Add to `.env` and `src/environments/environment.ts`

**Q: How do I use HttpClient?**
A: Inject in service: `constructor(private http: HttpClient) {}`

**Q: How do I handle errors from API?**
A: Use `.pipe(catchError(...))`

**Q: How do I cache API responses?**
A: Use `.pipe(shareReplay(1))`

**Q: How do I make components responsive?**
A: Use CSS media queries or Angular responsive utilities

---

Happy Coding! 💻⚽
