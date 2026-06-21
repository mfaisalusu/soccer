# Deployment Guide

## 🚀 Deployment Platforms

### 1. Vercel (Recommended for SSG)

**Best for**: SSG Angular projects with automatic deployments

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Or connect GitHub for automatic deployments
# Visit https://vercel.com/import
```

**vercel.json** configuration:
```json
{
  "buildCommand": "npm run build:ssg",
  "outputDirectory": "dist/world-cup-schedule",
  "framework": "angular",
  "env": {
    "WORLD_CUP_API_KEY": "@world_cup_api_key"
  }
}
```

### 2. Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist/world-cup-schedule
```

**netlify.toml** configuration:
```toml
[build]
  command = "npm run build:ssg"
  publish = "dist/world-cup-schedule"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. GitHub Pages

```bash
# Install Angular for GitHub Pages
npm install --save-dev angular-cli-ghpages

# Build
npm run build:ssg

# Deploy to GitHub Pages
ngh --dir=dist/world-cup-schedule
```

### 4. Docker + Cloud Services

#### AWS
```bash
# Build Docker image
docker build -t world-cup-schedule:latest .

# Push to ECR (Elastic Container Registry)
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

docker tag world-cup-schedule:latest \
  <account-id>.dkr.ecr.us-east-1.amazonaws.com/world-cup-schedule:latest

docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/world-cup-schedule:latest

# Deploy to ECS/EKS
aws ecs create-service --cluster production --service-name world-cup-schedule ...
```

#### Google Cloud
```bash
# Configure gcloud
gcloud config set project PROJECT_ID

# Build and push to Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/world-cup-schedule

# Deploy to Cloud Run
gcloud run deploy world-cup-schedule \
  --image gcr.io/PROJECT_ID/world-cup-schedule \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Azure
```bash
# Login
az login

# Create resource group
az group create --name world-cup --location eastus

# Create App Service
az appservice plan create --name world-cup-plan \
  --resource-group world-cup --sku FREE

# Deploy
az webapp up --resource-group world-cup \
  --name world-cup-schedule --runtime "NODE|18"
```

### 5. Self-Hosted (VPS)

#### Using PM2 and Nginx

```bash
# SSH into server
ssh user@your-server.com

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/yourusername/soccer.git
cd soccer

# Install dependencies
npm install --production

# Build
npm run build:ssg

# Install PM2 globally
sudo npm install -g pm2

# Start application
pm2 start "npm start" --name "world-cup-schedule"
pm2 startup
pm2 save
```

**Nginx Configuration** (`/etc/nginx/sites-available/default`):
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL Configuration (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss;
    
    # Root directory
    root /home/user/soccer/dist/world-cup-schedule;
    
    # Proxy to Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🔒 Environment Variables

### For All Platforms

```env
# API Configuration
WORLD_CUP_API_KEY=your_api_key_here
NODE_ENV=production

# Application
PORT=3000
APP_NAME=world-cup-schedule
```

### Setting Variables by Platform

**Vercel**: Dashboard → Settings → Environment Variables
**Netlify**: Site Settings → Build & Deploy → Environment
**Docker**: `docker run -e WORLD_CUP_API_KEY=xxx`
**AWS**: Task Definition → Container Definitions → Environment
**GCP**: Cloud Run → Set Environment Variables
**Azure**: Application Settings → Environment Variables

## 📊 Performance Optimization

### 1. Enable Caching
```nginx
# Nginx caching
location ~* \.(js|css|png|jpg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 2. CDN Integration
- **CloudFlare** - Free tier available
- **AWS CloudFront** - Best with AWS
- **Google Cloud CDN** - With GCP

### 3. Compression
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1000;
gzip_proxied any;
gzip_types text/plain text/css text/xml text/javascript 
            application/x-javascript application/xml+rss;
```

## 📈 Monitoring & Logging

### Application Monitoring
- **Sentry** - Error tracking
- **New Relic** - Performance monitoring
- **DataDog** - Full-stack monitoring

### Log Aggregation
- **ELK Stack** - Elasticsearch, Logstash, Kibana
- **Splunk** - Enterprise logging
- **CloudWatch** - AWS native

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build:ssg
      
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## 🔐 Security Checklist

- [ ] API key is not in source code
- [ ] HTTPS is enabled
- [ ] Security headers are set
- [ ] CORS is properly configured
- [ ] Input validation is implemented
- [ ] Output encoding is applied
- [ ] Dependencies are updated
- [ ] Secrets are managed securely
- [ ] Database credentials are protected
- [ ] Rate limiting is enabled

## 🚨 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build:ssg
```

### High Memory Usage
- Increase Node.js memory: `NODE_OPTIONS=--max_old_space_size=4096`
- Use PM2 clustering: `pm2 start app.js -i max`

### SSL Certificate Issues
```bash
# Let's Encrypt with Certbot
sudo certbot certonly --standalone -d your-domain.com
sudo certbot renew --dry-run
```

### Performance Issues
- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies
- Optimize images
- Minify CSS/JavaScript

## 📚 Deployment Checklist

- [ ] API key configured
- [ ] Environment variables set
- [ ] Build successful
- [ ] Tests pass
- [ ] Assets optimized
- [ ] SSL certificate valid
- [ ] Domain configured
- [ ] Email configured
- [ ] Monitoring enabled
- [ ] Backups configured
- [ ] Documentation updated
- [ ] Team notified

---

Choose the deployment platform based on your needs and budget. For beginners, **Vercel** or **Netlify** are recommended.
