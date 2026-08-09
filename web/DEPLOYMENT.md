# Deployment checklist

1. Set `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` from `.env.example` in the hosting provider.
2. Run `pnpm exec prisma migrate deploy` and `pnpm exec prisma db seed` against the production database.
3. Deploy only behind HTTPS. Location access and secure session cookies depend on it.
4. Store prescription, ID, and product-image files in private object storage before production. Do not keep document data URLs in the database at scale.
5. Configure backups, error monitoring, an outbound-email provider, and a verified support address.
6. Restrict pharmacy/admin role assignment to staff onboarding; public signup should create customer accounts only.

# Privacy and retention requirements

- Collect only information required to fulfil and verify orders.
- Restrict prescriptions and ID documents to authorised pharmacy staff and log access.
- Define a retention period and a secure deletion process for orders and documents.
- Publish a reviewed privacy notice, consent language, contact process, and data-subject request process before launch.
- Have local legal/privacy professionals review the workflow before accepting real health documents.
