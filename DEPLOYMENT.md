
# Deploying InstantUtils to Render

This guide will walk you through deploying your InstantUtils application on Render.com.

## Prerequisites

1. Create an account on [Render](https://render.com)
2. Make sure you have your GitHub repository ready with your code

## Deployment Steps

### 1. Connect Your GitHub Repository

1. Log in to your Render account
2. Click on "New" and select "Static Site"
3. Connect your GitHub account if you haven't already
4. Select the repository containing your InstantUtils project

### 2. Configure Your Static Site

Use these settings:
- **Name**: instantutils (or your preferred name)
- **Branch**: main (or your default branch)
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**: Add any necessary environment variables (Not required for basic deployment)

### 3. Deploy Your Site

1. Click "Create Static Site"
2. Render will automatically build and deploy your site
3. Once deployment is complete, you'll get a URL like `https://instantutils.onrender.com`

### 4. Custom Domain Setup

To use your custom domain (instantutils.jaychauhan.tech):

1. Go to your static site dashboard in Render
2. Click on "Settings" and scroll to "Custom Domain"
3. Click "Add Custom Domain" and enter `instantutils.jaychauhan.tech`
4. Follow the instructions to configure DNS records for your domain
   - Add a CNAME record pointing from `instantutils.jaychauhan.tech` to your Render URL

## Running Locally

To run the project locally:

```bash
# Clone the repository
git clone <your-repository-url>

# Navigate to the project directory
cd <project-directory>

# Install dependencies
npm install

# Start the development server
npm run dev
```

The site will be available at `http://localhost:8080`

## Building for Production

To build the project for production:

```bash
npm run build
```

The build files will be available in the `dist` directory, which you can then serve using any static file server.
