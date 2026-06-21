# ⚽ World Cup 2026 Schedule Website

Jadwal pertandingan Piala Dunia 2026 yang modern, responsif, dan cepat dibangun dengan **Angular SSG** (Static Site Generation) dan clean code architecture.

## 🌟 Fitur Utama

- ✅ **Static Site Generation (SSG)** - Pre-rendering untuk performa optimal
- ✅ **Responsive Design** - Mobile-first, bekerja sempurna di semua perangkat
- ✅ **Filter Pertandingan** - Cari berdasarkan tahap, status, dan tim
- ✅ **Live Updates** - Status real-time pertandingan
- ✅ **Clean Architecture** - Folder structure yang terorganisir dengan baik
- ✅ **Beautiful UI/UX** - Desain modern dengan gradien dan animasi smooth
- ✅ **PWA Support** - Bisa diakses offline
- ✅ **SEO Friendly** - Meta tags dan structured data
- ✅ **API Gratis** - Menggunakan Football-Data.org API

## 🏗️ Project Structure

```
world-cup-schedule/
├── src/
│   ├── app/
│   │   ├── components/              # Komponen UI
│   │   │   ├── match-card/         # Kartu pertandingan
│   │   │   ├── filter/             # Filter pertandingan
│   │   │   └── schedule-listing/   # Daftar jadwal
│   │   ├── services/                # Business logic
│   │   │   ├── world-cup-api.service.ts
│   │   │   └── utility.service.ts
│   │   ├── models/                  # TypeScript interfaces
│   │   │   └── match.model.ts
│   │   ├── app.component.ts        # Root component
│   │   └── environments/            # Konfigurasi environment
│   ├── main.ts                      # Entry point
│   ├── index.html                   # HTML utama
│   └── styles.css                   # Global styles
├── scripts/
│   └── prerender.js                 # SSG prerender script
├── package.json                     # Dependencies
├── angular.json                     # Angular configuration
├── tsconfig.json                    # TypeScript configuration
├── Dockerfile                       # Docker configuration
├── docker-compose.yml               # Docker Compose
└── README.md                        # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm atau yarn

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd soccer
```

2. **Install dependencies**
```bash
npm install
```

3. **Get API Key**
- Daftar di [Football-Data.org](https://www.football-data.org/)
- Dapatkan API key gratis (100 requests/hari)
- Update di `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://api.football-data.org/v4',
  apiKey: 'YOUR_API_KEY_HERE', // Ganti dengan API key Anda
  cacheTime: 300000
};
```

### Development

```bash
# Start development server
npm start

# Buka http://localhost:4200
```

### Production Build (SSG)

```bash
# Build dengan SSG
npm run build:ssg

# Hasil di ./dist/world-cup-schedule
```

## 🏛️ Clean Architecture

Proyek ini mengikuti clean code principles:

### Separation of Concerns
- **Components** - UI presentational logic
- **Services** - Business logic dan API calls
- **Models** - Type definitions dan interfaces
- **Utilities** - Helper functions

### Benefits
- ✅ Mudah di-test
- ✅ Maintainable dan scalable
- ✅ Reusable components dan services
- ✅ Clear dependency injection

## 🎨 UI/UX Features

### Modern Design
- **Gradient backgrounds** - Eye-catching visual hierarchy
- **Smooth animations** - Transisi yang halus
- **Responsive grid** - Layout yang adaptif
- **Color-coded status** - Visual feedback yang jelas

### User Experience
- **Filter intuitif** - Mudah mencari pertandingan
- **Loading states** - Feedback yang jelas
- **Error handling** - Graceful fallback ke mock data
- **Accessible** - WCAG compliance

## 📱 Responsive Breakpoints

```
Mobile:   < 480px
Tablet:   480px - 768px
Desktop:  768px - 1024px
Large:    > 1024px
```

## 🔧 Available Scripts

```bash
# Development
npm start              # Start dev server (localhost:4200)
npm run build          # Build untuk production

# SSG/Static Site Generation
npm run build:ssg      # Build dengan prerendering
npm run prerender      # Jalankan prerender script

# Code Quality
npm run lint           # Run linter
npm test              # Run tests
```

## 📊 API Integration

### Endpoints Digunakan
- `GET /competitions/WC/matches` - Semua pertandingan
- `GET /teams/{id}` - Info tim

### Free Tier Limits
- 100 requests per hari
- Caching diaktifkan untuk optimasi

### Fallback Data
Jika API limit tercapai, aplikasi akan menampilkan mock data

## 🐳 Docker Deployment

### Build Image
```bash
docker build -t world-cup-schedule .
```

### Run Container
```bash
docker run -p 3000:3000 world-cup-schedule
```

### Docker Compose
```bash
docker-compose up
```

## 🌐 Deployment

### Static Hosting Options
- **Vercel** - Optimal untuk SSG Angular
- **Netlify** - CI/CD otomatis
- **GitHub Pages** - Gratis dengan domain custom
- **CloudFlare Pages** - High performance edge caching

### Deploy ke Vercel
```bash
npm install -g vercel
vercel --prod
```

## 📈 Performance Optimization

- **SSG** - Pre-rendered static pages
- **Lazy Loading** - Load components on demand
- **Tree Shaking** - Remove unused code
- **Minification** - Optimized bundle size
- **Caching** - API response caching

## 🔐 Security

- **Input Validation** - Prevent XSS attacks
- **HTTPS** - Encrypted data transmission
- **CSP Headers** - Content Security Policy
- **CORS** - Cross-origin protection

## 🧪 Testing

```bash
# Unit Tests
npm test

# E2E Tests
npm run e2e
```

## 📝 Code Standards

- **TypeScript strict mode** - Type safety
- **ESLint** - Code consistency
- **Prettier** - Code formatting
- **Angular style guide** - Best practices

## 🐛 Troubleshooting

### API Limit Tercapai
- Tunggu sampai reset harian (UTC)
- Gunakan mock data untuk testing
- Pertimbangkan upgrade tier API

### Build Error
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build:ssg
```

### Port 4200 Sudah Digunakan
```bash
ng serve --port 4300
```

## 🤝 Contributing

Contributions welcome! Please follow:
1. Fork the repository
2. Create feature branch
3. Submit pull request

## 📄 License

MIT License - Bebas digunakan untuk project personal/komersial

## 📞 Support

- 📧 Email: support@example.com
- 💬 Issues: [GitHub Issues](https://github.com/mfaisalusu/soccer/issues)
- 📖 Docs: [Angular Documentation](https://angular.io/docs)

## 🙏 Acknowledgments

- **Football-Data.org** - Penyedia API gratis
- **Angular Team** - Excellent framework
- **Community** - Feedback dan suggestions

---

**Dibuat dengan ❤️ menggunakan Angular SSG**

Happy coding! ⚽
