# Architecture Documentation

## 🏛️ System Architecture

This project follows **Clean Architecture** principles with clear separation of concerns.

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (Components, Templates, Styles)      │
└──────────┬──────────────────────────────┘
           │
┌──────────┴──────────────────────────────┐
│         Service Layer                   │
│  (Business Logic, API Integration)      │
└──────────┬──────────────────────────────┘
           │
┌──────────┴──────────────────────────────┐
│         Data Layer                      │
│    (Models, Interfaces, Types)          │
└─────────────────────────────────────────┘
```

## 📁 Folder Structure

### Components (`/components`)
Standalone Angular components for UI rendering.

```
components/
├── match-card/
│   └── match-card.component.ts
├── filter/
│   └── filter.component.ts
└── schedule-listing/
    └── schedule-listing.component.ts
```

**Design Pattern**: Presentational Components
- Focus on UI rendering
- Accept data via @Input()
- Emit events via @Output()
- No business logic
- Highly reusable

### Services (`/services`)
Business logic and data management.

```
services/
├── world-cup-api.service.ts
└── utility.service.ts
```

**Design Pattern**: Service Layer
- Handle API communication
- Cache data
- Transform responses
- Provide RxJS Observables
- Dependency injection

### Models (`/models`)
TypeScript interfaces and types.

```
models/
└── match.model.ts
```

**Design Pattern**: Data Models
- Define API contracts
- Ensure type safety
- Document data structures

### Core (`/core`)
Core application logic.

```
core/
└── http-error.interceptor.ts
```

**Design Pattern**: Interceptors
- Handle HTTP errors
- Add authentication
- Transform requests/responses

## 🔄 Data Flow

### 1. Initialization
```
AppComponent mounted
    ↓
ScheduleListingComponent ngOnInit
    ↓
WorldCupApiService.getMatches()
    ↓
HTTP Request to API
    ↓
HTTP Interceptor catches response
    ↓
Transform to Match model
    ↓
Cache results
    ↓
Return Observable
```

### 2. User Interaction
```
User selects filter
    ↓
FilterComponent emits filterChange event
    ↓
ScheduleListingComponent receives event
    ↓
Apply filter logic
    ↓
Group matches by stage
    ↓
Update template
    ↓
Render filtered matches
```

### 3. Component Rendering
```
ScheduleListingComponent renders
    ↓
Loop through groupedMatches
    ↓
Pass Match to MatchCardComponent
    ↓
MatchCardComponent renders
    ↓
User sees formatted match card
```

## 🎯 Design Patterns

### 1. Component Pattern
Standalone components with clear responsibilities.

```typescript
@Component({
  selector: 'app-match-card',
  standalone: true,
  imports: [CommonModule],
  template: `...`,
  styles: [`...`]
})
export class MatchCardComponent {
  @Input() match!: Match;
  @Output() selected = new EventEmitter<Match>();
}
```

### 2. Service Pattern
Injectable services with dependency injection.

```typescript
@Injectable({
  providedIn: 'root'
})
export class WorldCupApiService {
  constructor(private http: HttpClient) {}
  
  getMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(url)
      .pipe(shareReplay(1));
  }
}
```

### 3. Observable Pattern
Reactive programming with RxJS.

```typescript
this.apiService.getMatches()
  .pipe(
    map(matches => /* transform */),
    catchError(error => /* handle */),
    takeUntil(this.destroy$)
  )
  .subscribe(matches => /* update */);
```

### 4. Interceptor Pattern
Middleware for HTTP requests.

```typescript
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => /* handle error */)
    );
  }
}
```

## 📊 State Management

Current approach: **Reactive with RxJS**

```typescript
// API caching with shareReplay
private matches$: Observable<Match[]> | null = null;

getMatches(): Observable<Match[]> {
  if (this.matches$) {
    return this.matches$;
  }
  
  this.matches$ = this.http.get<Match[]>(url)
    .pipe(shareReplay(1));
  
  return this.matches$;
}
```

## 🔐 Security Considerations

1. **API Key Management**
   - Store in environment variables
   - Never commit to repository
   - Rotate regularly

2. **Input Validation**
   - Validate filter inputs
   - Sanitize user data
   - Type safety with TypeScript

3. **Error Handling**
   - Graceful error fallback
   - Don't expose sensitive info
   - Log errors securely

4. **CORS Protection**
   - Configure API to allow cross-origin
   - Validate request origin
   - Use secure headers

## 🚀 Performance Optimization

### 1. Change Detection
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### 2. TrackBy Function
```typescript
trackByMatchId(index: number, match: Match) {
  return match.id;
}

// In template
<div *ngFor="let match of matches; trackBy: trackByMatchId">
```

### 3. OnPush + Observables
```typescript
matches$ = this.apiService.getMatches();

// In template with async pipe
<app-match-card 
  *ngFor="let match of matches$ | async"
  [match]="match"
></app-match-card>
```

### 4. Lazy Loading
```typescript
const routes: Routes = [
  {
    path: 'matches',
    loadComponent: () => import('./components/schedule-listing/schedule-listing.component')
      .then(m => m.ScheduleListingComponent)
  }
];
```

## 📈 Scaling Considerations

### If adding more features:

1. **State Management Library**
   - Consider NgRx, Akita, or NgXS
   - For complex state interactions

2. **Modular Structure**
   - Create feature modules
   - Lazy load routes
   - Organize by domain

3. **Advanced Services**
   - Cache strategies
   - Data persistence
   - Offline support

4. **Testing Infrastructure**
   - Unit tests for services
   - Component tests
   - E2E tests

## 🔄 Extension Points

### Adding New Components

1. Create in `/components` folder
2. Make standalone with clear inputs/outputs
3. Use dependency injection for services
4. Add to parent component imports

### Adding New Services

1. Create in `/services` folder
2. Use @Injectable() decorator
3. Return Observables for data
4. Implement caching as needed

### Adding New Models

1. Create in `/models` folder
2. Define TypeScript interfaces
3. Use in service return types
4. Document properties

## 📚 References

- [Angular Documentation](https://angular.io/docs)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [RxJS Documentation](https://rxjs.dev/)

---

This architecture ensures maintainability, scalability, and code quality.
