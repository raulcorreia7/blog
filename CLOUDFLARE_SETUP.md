# Cloudflare DNS Setup for GitHub Pages

This guide explains how to configure Cloudflare DNS to point `raulcorreia.dev` to your GitHub Pages site at `https://raulcorreia7.github.io/blog/`.

## Prerequisites

- GitHub Pages repository is already set up and deployed
- CNAME file exists in your repository with `raulcorreia.dev`
- Cloudflare account with your domain added

## DNS Configuration

### Step 1: Add DNS Records

In Cloudflare dashboard, go to DNS > Records and create the following records:

#### For the main domain (raulcorreia.dev):

| Type | Name | Content | TTL | Proxy Status |
|------|------|---------|-----|--------------|
| CNAME | raulcorreia.dev | raulcorreia7.github.io | Auto | DNS Only (Grey Cloud) |

#### For the www subdomain (redirects to main domain):

| Type | Name | Content | TTL | Proxy Status |
|------|------|---------|-----|--------------|
| CNAME | www | raulcorreia.dev | Auto | DNS Only (Grey Cloud) |

**Important:** Set the proxy status to "DNS Only" (grey cloud icon), not "Proxied" (orange cloud). GitHub Pages requires direct DNS access.

### Step 2: Verify DNS Propagation

After adding the records, verify they propagate:

```bash
dig raulcorreia.dev
```

You should see the CNAME pointing to `raulcorreia7.github.io`.

## SSL/TLS Configuration

### Step 1: Configure SSL/TLS Mode

In Cloudflare, go to SSL/TLS > Overview and set:

- **Encryption Mode:** Full (not Full Strict)

**Why Full mode?**
GitHub Pages provides SSL certificates, but not from a public CA that Cloudflare recognizes. "Full" mode allows Cloudflare to encrypt connections to GitHub Pages without strict certificate validation.

### Step 2: Enable Always Use HTTPS

In SSL/TLS > Edge Certificates, enable:
- Always Use HTTPS (automatic redirect from HTTP to HTTPS)

## GitHub Pages Configuration

### Step 1: Verify CNAME File

Ensure your repository has a CNAME file in the root directory:
- File path: `/CNAME` in your repository root
- Content: `raulcorreia.dev`

### Step 2: Enable GitHub Pages

1. Go to your repository Settings > Pages
2. Source: Deploy from a branch
3. Branch: `master` (or your main branch)
4. Folder: `/ (root)`

Wait for the deployment to complete. GitHub Pages will show a warning about DNS configuration initially - this is normal and will resolve once DNS propagates.

## Verification

### Check GitHub Pages Status

Go to repository Settings > Pages. You should see:
- Your site is live at `https://raulcorreia.dev`
- DNS status: "Active" (green checkmark)

### Test the Site

Open a browser and navigate to:
- `https://raulcorreia.dev` - should load your blog
- `https://www.raulcorreia.dev` - should redirect to main domain
- `http://raulcorreia.dev` - should redirect to HTTPS

### Verify SSL Certificate

Use a tool to check the SSL certificate:
```bash
curl -Iv https://raulcorreia.dev 2>&1 | grep -i "subject\|issuer"
```

## Troubleshooting

### Issue: DNS Not Propagating

**Symptoms:** Site doesn't load, DNS lookup fails

**Solutions:**
- Wait up to 48 hours for DNS propagation (usually 5-30 minutes)
- Check Cloudflare DNS records are correctly configured
- Verify the CNAME points to `raulcorreia7.github.io`
- Use a DNS checker like `dig` or `nslookup` to verify records

### Issue: Certificate Errors

**Symptoms:** Browser shows certificate warnings, "Not Secure" badge

**Solutions:**
- Check SSL/TLS mode is set to "Full" (not "Full Strict")
- Verify proxy status is "DNS Only" (grey cloud)
- Clear browser cache and try again
- Check GitHub Pages Settings > Pages for deployment status

### Issue: GitHub Pages Shows DNS Warning

**Symptoms:** GitHub Pages shows "Domain not configured" warning

**Solutions:**
- Verify CNAME file exists and contains only `raulcorreia.dev`
- Check DNS records in Cloudflare
- Wait for DNS propagation (can take up to 48 hours)
- Ensure proxy status is "DNS Only" (grey cloud)

### Issue: Site Not Loading (502/504 Errors)

**Symptoms:** 502 Bad Gateway, 504 Gateway Timeout

**Solutions:**
- GitHub Pages might be temporarily down - check status at https://www.githubstatus.com/
- Verify DNS records are correct
- Check that GitHub Pages deployment completed successfully

### Issue: WWW Subdomain Not Working

**Symptoms:** `www.raulcorreia.dev` doesn't redirect or load

**Solutions:**
- Verify CNAME record for `www` points to `raulcorreia.dev`
- Check that proxy status is "DNS Only" (grey cloud)
- Clear browser cache and try again

### Issue: Mixed Content Warnings

**Symptoms:** Browser shows "Mixed Content" warning, some resources blocked

**Solutions:**
- Ensure all internal links use `https://` (not `http://`)
- Update Hugo config `baseURL` to use HTTPS
- Check for hardcoded HTTP links in content files

## Alternative: Using A Records (Not Recommended)

If CNAME doesn't work, you can use A records pointing to GitHub Pages IPs:

| Type | Name | Content | TTL | Proxy Status |
|------|------|---------|-----|--------------|
| A | raulcorreia.dev | 185.199.108.153 | Auto | DNS Only |
| A | raulcorreia.dev | 185.199.109.153 | Auto | DNS Only |
| A | raulcorreia.dev | 185.199.110.153 | Auto | DNS Only |
| A | raulcorreia.dev | 185.199.111.153 | Auto | DNS Only |

**Note:** These IP addresses may change. CNAME is preferred as it doesn't require updates when GitHub Pages IPs change.

## Maintenance

### Update GitHub Pages IPs

If using A records (not recommended), monitor GitHub's announcements for IP changes and update DNS records accordingly.

### Monitor SSL Certificate

GitHub Pages automatically manages SSL certificates. If certificate issues arise:
1. Check GitHub Pages status
2. Verify CNAME file is correct
3. Wait for automatic certificate renewal (usually within 24 hours)

## Additional Resources

- GitHub Pages Custom Domains: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
- Cloudflare DNS Records: https://developers.cloudflare.com/dns/manage-dns-records/reference/dns-record-types/
- Cloudflare SSL/TLS: https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/
