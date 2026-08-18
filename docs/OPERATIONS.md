# Backup and Monitoring Operations

## Daily

```powershell
npm run backup --prefix admin-panel/backend
npm run error-report --prefix admin-panel/backend
```

The backup script copies the JSON datastore and, when `MONGO_URI` and `mongodump` are available, creates a MongoDB dump too. Each backup includes SHA-256 checksums.

## Weekly

```powershell
npm run security-review --prefix admin-panel/backend
npm run verify-backup --prefix admin-panel/backend
npm run performance-check --prefix admin-panel/backend
```

The performance check expects the API to be running. Set `HEALTH_CHECK_URL` to monitor a deployed API instead.

## Monthly

```powershell
npm outdated --prefix savrion-website
npm outdated --prefix admin-panel/frontend
npm outdated --prefix admin-panel/backend
```

Review the SEO and analytics checklist, then review public website content in the admin panel.

## Scheduling

Use your hosting scheduler, GitHub Actions, or Windows Task Scheduler to run the daily and weekly commands. Configure notifications in that scheduler whenever a command exits with a non-zero status.
