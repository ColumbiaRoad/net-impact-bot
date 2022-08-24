# impact-helper-api

An API for integrating between HubSpot CRM, Upright and Slack

## Requirements

- [Upright](https://model.uprightproject.com/) organisational account
- [HubSpot Sales Hub](https://www.hubspot.com/products/sales) Professional or Enterprise
- [Slack](https://slack.com/) workspace
- [Redis](https://redis.io/) running on port 6379

## How it works

The API takes in a HubSpot Deal, finds an Upright profile for the Company associated with the Deal, and returns the Upright profile.

There are two endpoints:

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

### POST `/dealPNG`

This endpoint is similar to `deals`. However, this doesn't post the profile to Slack.
Instead, it returns the PNG image as the response body.

If there are errors, the first error is included in the response body.

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
1. Copy the Channel ID and paste it as the `.env` value of `SLACK_ERROR_CHANNEL`.
1. Similarly, set `SLACK_CHANNEL` as the channel you want the impact profiles to be posted on (can be the same as `SLACK_ERROR_CHANNEL` during development).

## Deployment

Deploy the app and set the environment variables as instructed in `.env.example`.
The build script is `npm run build` and the start script is `npm start`.
