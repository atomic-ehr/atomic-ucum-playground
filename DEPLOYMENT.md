# Vercel Deployment Setup

This guide explains how to set up automatic deployment to Vercel using GitHub Actions.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Your project linked to a GitHub repository

## Setup Steps

### 1. Link Project to Vercel

First, import your project to Vercel:

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project settings (framework preset should auto-detect Next.js)
4. Deploy the project once manually

### 2. Get Vercel Credentials

After importing the project, you'll need three values:

1. **Vercel Token**: 
   - Go to https://vercel.com/account/tokens
   - Create a new token with a descriptive name (e.g., "GitHub Actions")
   - Copy the token value

2. **Organization ID**:
   - Go to your Vercel dashboard
   - Click on your team/personal account settings
   - Find your Organization ID (or use your personal account ID)

3. **Project ID**:
   - Go to your project settings in Vercel
   - Find the Project ID in the general settings

### 3. Add GitHub Secrets

In your GitHub repository:

1. Go to Settings → Secrets and variables → Actions
2. Add the following repository secrets:
   - `VERCEL_TOKEN`: Your Vercel token from step 2.1
   - `VERCEL_ORG_ID`: Your organization ID from step 2.2
   - `VERCEL_PROJECT_ID`: Your project ID from step 2.3

### 4. GitHub Actions Workflow

The workflow is already configured in `.github/workflows/deploy.yml` and will:

- **On Pull Requests**: Deploy a preview version and comment the URL on the PR
- **On Push to main/master**: Deploy to production

## How It Works

### Preview Deployments

When you create a pull request:
1. GitHub Actions builds your project
2. Deploys it to a unique preview URL
3. Comments the preview URL on your PR for easy testing

### Production Deployments

When you push to main/master:
1. GitHub Actions builds your project
2. Deploys it to your production domain
3. Updates your live site automatically

## Environment Variables

If your project uses environment variables:

1. Add them in Vercel project settings
2. They'll be automatically pulled during deployment
3. Use different values for preview/production environments as needed

## Troubleshooting

### Build Failures

- Check GitHub Actions logs for detailed error messages
- Ensure all dependencies are properly listed in package.json
- Verify build command works locally: `bun run build`

### Permission Issues

- Ensure VERCEL_TOKEN has proper permissions
- Verify organization and project IDs are correct
- Check if your Vercel account has access to the project

### Preview Comments Not Appearing

- Ensure the GitHub token has permission to comment on PRs
- Check if branch protection rules allow GitHub Actions to comment

## Local Testing

To test the Vercel build locally:

```bash
# Install Vercel CLI
bun add -g vercel

# Login to Vercel
vercel login

# Build locally
vercel build

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

## Additional Configuration

### Custom Domains

Configure custom domains in Vercel project settings. They'll be automatically used for production deployments.

### Build & Output Settings

If you need to customize build settings, create a `vercel.json` file (already included in this project).

### Monorepo Support

This workflow assumes the playground is the root of the repository. For monorepo setups, adjust the working directory in the workflow file.