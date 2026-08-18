# Savrion Go-Live Checklist

Use this checklist in order. Do not proceed past a failed gate.

## 1. Development

- [ ] All approved features are implemented.
- [ ] Environment files contain no production secrets in Git.
- [ ] Production URLs are configured (`VITE_API_URL`, `VITE_SITE_URL`, `MONGO_URI`, `JWT_SECRET`).

## 2. Code Review

- [ ] Review every changed file for correctness, error handling, and accessibility.
- [ ] Confirm no credentials, tokens, or personal data are committed.

## 3. Functional Testing

- [ ] Public navigation, services, products, contact form, social links, and footer work.
- [ ] Admin login and create/edit/delete/reorder actions work.
- [ ] Contact submissions appear in the admin contact enquiries view.

## 4. Mobile Testing

- [ ] Test 320px, 375px, 768px, and desktop widths.
- [ ] Confirm menus, hero content, forms, tables, and buttons remain usable.

## 5. Security Testing

- [ ] Run `npm run security-review --prefix admin-panel/backend`.
- [ ] Use unique production credentials and rotate the default admin account.
- [ ] Enable HTTPS and restrict CORS to the production domains.

## 6. Performance Testing

- [ ] Run public and admin production builds.
- [ ] Run `npm run performance-check --prefix admin-panel/backend` against staging.
- [ ] Check images, JavaScript bundles, and API response times with browser DevTools.

## 7. SEO Setup

- [ ] Confirm `VITE_SITE_URL` uses the live HTTPS domain.
- [ ] Verify `/robots.txt` and `/sitemap.xml` on staging.
- [ ] Validate title, description, canonical, Open Graph, alt text, and JSON-LD on every public route.

## 8. Analytics Setup

- [ ] Connect Google Tag Manager or GA4 to `window.dataLayer`.
- [ ] Verify `page_view`, `view_service`, `view_product`, click, form, and lead events.
- [ ] Do not send personal data to analytics.

## 9. Backup Setup

- [ ] Run and verify one backup before deployment.
- [ ] Configure the daily backup and error report schedule.
- [ ] Configure weekly security, verification, and performance checks.

## 10. Staging Deployment

- [ ] Deploy the production builds to a staging URL.
- [ ] Set staging-only environment variables and test API connectivity.
- [ ] Run the full functional, mobile, security, and performance test pass.

## 11. Client/User Testing

- [ ] Obtain written approval for content, branding, forms, and workflows.
- [ ] Record and resolve any feedback before production deployment.

## 12. Production Deployment

- [ ] Create a tagged release and retain a rollback build.
- [ ] Deploy frontend, admin, and API with production environment variables.
- [ ] Verify HTTPS, domain routing, health endpoint, and contact delivery immediately after release.

## 13. Monitoring and Maintenance

- [ ] Watch error logs, uptime, backups, and funnel events daily.
- [ ] Complete the weekly and monthly tasks in [OPERATIONS.md](./OPERATIONS.md).
