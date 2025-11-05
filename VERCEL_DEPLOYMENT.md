# Vercel Deployment Guide for VegasVault

This guide will help you deploy the VegasVault application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub/GitLab/Bitbucket Account**: Your code should be in a Git repository
3. **Environment Variables**: Gather all required environment variables (see below)

## Quick Deployment (3 Methods)

### Method 1: Vercel Dashboard (Recommended for First Time)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import Project in Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Connect your Git repository
   - Select your repository

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Add Environment Variables** (see Environment Variables section below)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Method 2: Vercel CLI (Fastest for Updates)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # Deploy to preview
   vercel

   # Deploy to production
   vercel --prod
   ```

4. **Set Environment Variables** (via CLI or dashboard)
   ```bash
   vercel env add NEXT_PUBLIC_SOMNIA_TESTNET_RPC
   # Follow prompts to enter value
   ```

### Method 3: GitHub Integration (Automatic Deployments)

1. **Connect Repository**
   - Go to Vercel Dashboard
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure settings

2. **Set Environment Variables** in Vercel Dashboard

3. **Automatic Deployments**
   - Every push to `main` → Production deployment
   - Every pull request → Preview deployment

## Environment Variables

### Required Environment Variables

Add these in Vercel Dashboard → Your Project → Settings → Environment Variables:

#### Network Configuration
```
NEXT_PUBLIC_SOMNIA_TESTNET_RPC=https://dream-rpc.somnia.network/
NEXT_PUBLIC_SOMNIA_MAINNET_RPC=https://api.infra.mainnet.somnia.network/
NEXT_PUBLIC_SOMNIA_TESTNET_EXPLORER=https://shannon-explorer.somnia.network/
NEXT_PUBLIC_SOMNIA_MAINNET_EXPLORER=https://explorer.somnia.network
NEXT_PUBLIC_NETWORK=somnia-testnet
```

#### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Treasury Configuration
⚠️ **SECURITY WARNING**: Never expose private keys in client-side code!
- Only set these if you need server-side API routes to work
- Use Vercel's environment variables (not `NEXT_PUBLIC_*` for private keys)

```
SOMNIA_TREASURY_ADDRESS=your_treasury_address
SOMNIA_TREASURY_PRIVATE_KEY=your_private_key (server-side only)
# OR use mnemonic (more secure)
SOMNIA_TREASURY_MNEMONIC=your_mnemonic_phrase (server-side only)
```

#### Casino Contract
```
NEXT_PUBLIC_CASINO_CONTRACT_ADDRESS=your_deployed_contract_address
```

#### Pyth Entropy Configuration
```
NEXT_PUBLIC_SOMNIA_PYTH_ENTROPY_CONTRACT=contract_address
NEXT_PUBLIC_SOMNIA_PYTH_ENTROPY_PROVIDER=provider_address
```

#### Optional: Database (if using)
```
DATABASE_URL=your_postgresql_connection_string
```

#### Optional: Redis (if using)
```
REDIS_URL=your_redis_connection_string
```

### Setting Environment Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Name**: Variable name (e.g., `NEXT_PUBLIC_SOMNIA_TESTNET_RPC`)
   - **Value**: Variable value
   - **Environment**: Select `Production`, `Preview`, `Development` (or all)
4. Click **Save**

## Build Configuration

Vercel will auto-detect Next.js, but you can customize:

### Build Settings
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node Version**: 18.x or higher (set in `package.json` engines)

### Node Version

The project specifies Node 18+ in `package.json`:
```json
"engines": {
  "node": ">=18.0.0"
}
```

Vercel will automatically use a compatible Node version.

## Post-Deployment Checklist

- [ ] All environment variables are set
- [ ] Contract addresses are correct
- [ ] RPC URLs are accessible
- [ ] Test wallet connection
- [ ] Test game functionality
- [ ] Verify explorer links work
- [ ] Check console for errors
- [ ] Test on mobile devices

## Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel will automatically provision SSL certificate

## Troubleshooting

### Build Fails

**Error: Module not found**
- Check that all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error: Environment variable missing**
- Ensure all `NEXT_PUBLIC_*` variables are set in Vercel
- Check variable names match exactly (case-sensitive)

**Error: Build timeout**
- Increase build timeout in Vercel settings
- Check for infinite loops in code

### Runtime Errors

**Error: Contract not found**
- Verify `NEXT_PUBLIC_CASINO_CONTRACT_ADDRESS` is correct
- Ensure contract is deployed on the network

**Error: RPC connection failed**
- Check RPC URLs are correct
- Verify network connectivity

**Error: Wallet connection issues**
- Ensure `NEXT_PUBLIC_NETWORK` matches your target network
- Check chain IDs are correct

### Performance Issues

**Slow initial load**
- Check bundle size in Vercel Analytics
- Optimize images
- Enable Vercel Edge Functions if needed

## Monitoring

1. **Vercel Analytics**: Enable in project settings
2. **Error Tracking**: Check Vercel logs for errors
3. **Performance**: Use Vercel Speed Insights

## Security Best Practices

1. ✅ Never commit `.env.local` to Git
2. ✅ Use Vercel environment variables for secrets
3. ✅ Don't use `NEXT_PUBLIC_*` for private keys
4. ✅ Enable Vercel's security features
5. ✅ Use HTTPS (automatic with Vercel)
6. ✅ Regular dependency updates

## Continuous Deployment

Once connected to Git:
- **Production**: Auto-deploys on push to `main` branch
- **Preview**: Auto-deploys on pull requests
- **Rollback**: Available in Vercel dashboard

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Support](https://vercel.com/support)

## Deployment Commands Reference

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List all deployments
vercel ls

# Remove deployment
vercel remove
```

