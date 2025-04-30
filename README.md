# impact-helper-api

An API for integrating between HubSpot CRM, Upright and Slack

## Requirements

- [Upright](https://model.uprightproject.com/) organisational account
- [HubSpot Sales Hub](https://www.hubspot.com/products/sales) Professional or Enterprise
- [Slack](https://slack.com/) workspace
- [Redis](https://redis.io/) running on port 6379 (unless using AWS Lambda environment)

## How it works

The API takes in a HubSpot Deal, finds an Upright profile for the Company associated with the Deal, and returns the Upright profile.

### POST `/webhooks/hubspot/deals`

Example body:

```json
{
  "objectId": "1234567890"
}
```

200 response:

```json
ok
```

`objectId` is the ID of the Deal in HubSpot (visible in the URL when you open the deal).
You can set up a webhook to this URL in GitHub Actions for some Deal trigger to automatically
send an Upright profile to Slack whenever that trigger fires.

This endpoint is asynchronous, it just always returns `ok` if an `objectId` was provided.
If there are any errors, they are posted to the Slack admin channel.

If a profile is found, it is posted to the Slack profile channel as a PNG image.

## Setup

```
git clone git@github.com:ColumbiaRoad/impact-helper-api.git
cd impact-helper-api
cp .env.example .env
```

### Configure the HubSpot integration

1. Log in to HubSpot.
1. Go to Settings -> Integrations -> Private Apps -> Create a private app.
1. Basic info tab: Add a name for your private app (and optionally a logo and description).
1. Scopes tab: Add the following scopes:

- `crm.objects.companies.read`
- `crm.objects.deals.read`

1. Click Create app -> Continue creating -> Go to app details.
1. In the Access token section, click Show token -> Copy.
1. In your `.env` file, paste the token as the value of `HUBSPOT_ACCESS_TOKEN`.

### Configure the Upright integration

1. Log in to Upright.
1. On the top right, click your name -> Account.
1. Go to Administration.
1. Generate an API token, copy it and paste it as the `.env` value of `UPRIGHT_API_TOKEN`.

### Configure the Slack integration

1. Create a new channel in Slack. This channel will be used for error messages. You can also use this channel for testing the bot during development.
1. Log in to [api.slack.com/apps](https://api.slack.com/apps).
1. Click Create New App -> From scratch.
1. Add App Name and pick a workspace.
1. Create App.
1. Go to OAuth & Permissions.
1. Under Scopes -> Bot Token Scopes, click Add an OAuth Scope. Add the following scopes:

- `files:write`
- `incoming-webhook`

1. Scroll up and click Install to Workspace.
1. Under Where should <your app> post?, select the channel you created earlier.
1. Click Allow.
1. Copy the Bot User OAuth Token and paste it as the `.env` value of `SLACK_TOKEN`.
1. In Slack, go to the channel you created earlier. Click on the channel name at the top and scroll down.
1. Copy the Channel ID and paste it as the `.env` value of `SLACK_ADMIN_CHANNEL`.
1. Similarly, set `SLACK_PROFILE_CHANNEL` as the channel you want the impact profiles to be posted on (can be the same as `SLACK_ADMIN_CHANNEL` during development).

## Local development and deployment

There are two ways to deploy and run this application:

### Option 1: Traditional Node.js Server

Runs the app as a standard Hapi.js HTTP server — suitable for local dev or hosting on platforms like Heroku or EC2.

Build and run:

```
npm install
cp .env.example .env
npm run build
npm start
```

This starts the server locally on the port specified in .env (default 3000).

Ensure Redis and any external services are available if needed.

### Option 2 (New): AWS Lambda Deployment (via AWS SAM)

This project now supports running it as an AWS Lambda function, managed by AWS SAM (Serverless Application Model).

Set the environment variable `USE_AWS_LAMBDA=true` to run in Lambda mode. When enabled, Redis and pino-pretty logging are disabled to ensure compatibility with the Lambda runtime.

#### Prerequisites

- [An AWS account, AWS Identity and Access Management (IAM) credentials, IAM access key pair, and AWS Command Line Interface (AWS CLI) to configure AWS credentials.](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/prerequisites.html)
- [Install AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)

- Install esbuild globally if you haven't yet:

```
npm install -g esbuild
```

Setup and Run Locally

```
npm install
cp .env.example .env
npm run start:local-sam
```

This command will:

1. Convert your .env file to env.json

2. Build the Lambda bundle using esbuild

3. Start the API Gateway emulator locally

Test the health check endpoint:

```
curl http://localhost:3000/status
# Should output: ok
```

#### New Build Output

When running `sam build`, a `.aws-sam/` directory will be created.
This contains the generated deployment artifacts and should not be committed to git (already included in `.gitignore`).
