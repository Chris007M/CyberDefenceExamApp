# CyberDefenceExamApp - VPS Deployment Guide

This guide walks you through deploying the CyberDefenceExamApp to a production VPS with automated CI/CD.

## Quick Start (5 minutes)

### 1. Get a VPS

Choose one of these providers:
- **DigitalOcean** (Droplet): $5-7/month, easiest setup
- **Linode**: $5-10/month, reliable
- **Vultr**: $6/month, fast
- **AWS EC2**: Free tier available
- **Hetzner**: €3/month, budget-friendly

**Recommended specs:**
- Ubuntu 22.04 LTS
- 1GB+ RAM (2GB recommended)
- 25GB+ SSD storage
- Public IPv4 address

### 2. Get SSH Access

When your VPS is created, you'll receive:
- IP address (e.g., `123.45.67.89`)
- Username (usually `root` or `ubuntu`)
- SSH key file (`.pem` or `.pub`) OR password

**Test SSH connection:**
```bash
ssh root@123.45.67.89
# or with key:
ssh -i your-key.pem root@123.45.67.89
```

### 3. Run the Deployment Script

SSH into your VPS and run:

```bash
# Download and run the script
curl -fsSL https://raw.githubusercontent.com/Chris007M/CyberDefenceExamApp/main/deploy-vps.sh -o deploy.sh
chmod +x deploy.sh

# Run with your domain
sudo ./deploy.sh yourdomain.com

# Or with custom database password and API key
sudo ./deploy.sh yourdomain.com "your_db_password" "your_api_key"
```

The script will:
- ✅ Install Apache, PHP, MySQL
- ✅ Clone your app from GitHub
- ✅ Create MySQL database and import schema
- ✅ Configure Apache VirtualHost
- ✅ Set up HTTPS with Let's Encrypt
- ✅ Configure SMTP environment variables
- ✅ Create credentials file (`.env.production`)

**Output saved credentials — keep them safe!**

---

## Manual Deployment (if script fails)

### Step-by-step setup

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install dependencies
sudo apt install -y apache2 php php-mysql php-cli git certbot python3-certbot-apache

# 3. Enable Apache modules
sudo a2enmod rewrite php8.1

# 4. Clone app
cd /var/www
sudo git clone https://github.com/Chris007M/CyberDefenceExamApp.git
sudo chown -R www-data:www-data CyberDefenceExamApp
sudo chmod -R 755 CyberDefenceExamApp

# 5. Create MySQL database
sudo mysql -u root <<'MYSQL'
CREATE DATABASE cyber_defence_exam CHARACTER SET utf8mb4;
CREATE USER 'exam_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON cyber_defence_exam.* TO 'exam_user'@'localhost';
FLUSH PRIVILEGES;
MYSQL

# 6. Import schema
sudo mysql -u exam_user -p cyber_defence_exam < /var/www/CyberDefenceExamApp/database/schema.sql

# 7. Configure Apache (see next section)

# 8. Setup SSL
sudo certbot --apache -d yourdomain.com

# 9. Restart Apache
sudo systemctl restart apache2
```

### Apache Configuration

Create `/etc/apache2/sites-available/cyberdefence.conf`:

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com
    DocumentRoot /var/www/CyberDefenceExamApp
    
    <Directory /var/www/CyberDefenceExamApp>
        AllowOverride All
        Require all granted
    </Directory>
    
    # SMTP for Email
    SetEnv SMTP_HOST smtp.gmail.com
    SetEnv SMTP_PORT 587
    SetEnv SMTP_USER windows.congress@gmail.com
    SetEnv SMTP_PASS oahccfxfhszlqezq
    SetEnv SMTP_SECURE tls
    SetEnv SMTP_FROM windows.congress@gmail.com
    SetEnv SMTP_FROM_NAME "Cyber Defence Exam"
    
    # Database
    SetEnv CD_DB_HOST localhost
    SetEnv CD_DB_NAME cyber_defence_exam
    SetEnv CD_DB_USER exam_user
    SetEnv CD_DB_PASS strong_password
    
    # API Security
    SetEnv CD_API_KEY your_api_key_here
    
    ErrorLog ${APACHE_LOG_DIR}/cyberdefence-error.log
    CustomLog ${APACHE_LOG_DIR}/cyberdefence-access.log combined
</VirtualHost>
```

Enable and restart:
```bash
sudo a2ensite cyberdefence.conf
sudo a2dissite 000-default.conf
sudo apache2ctl configtest
sudo systemctl restart apache2
```

---

## Access Your App

### Via Domain
```
https://yourdomain.com
```

### Via IP Address
```
http://123.45.67.89/CyberDefenceExamApp
```

### Test the App
1. Open the app in your browser
2. Take the exam
3. Submit with a valid email
4. Check email for results

---

## Set Up Automatic Deployment (CI/CD)

Every time you push to GitHub `main` branch, the app automatically deploys to your VPS.

### Step 1: Generate SSH Key Pair on VPS

```bash
# On your VPS
ssh-keygen -t ed25519 -C "github-actions"
# Press Enter to accept defaults (no passphrase)

cat ~/.ssh/id_ed25519
# Copy the output (starts with -----BEGIN OPENSSH PRIVATE KEY-----)
```

### Step 2: Add SSH Key to GitHub

1. Go to your GitHub repo: `https://github.com/Chris007M/CyberDefenceExamApp`
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

| Secret Name | Value |
|---|---|
| `VPS_HOST` | Your VPS IP (e.g., `123.45.67.89`) |
| `VPS_USER` | SSH username (usually `root` or `ubuntu`) |
| `VPS_SSH_KEY` | Paste the private key from `~/.ssh/id_ed25519` |
| `VPS_PORT` | SSH port (usually `22`) |

### Step 3: Authorize the SSH Key on VPS

```bash
# On your VPS, append the public key to authorized_keys
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
```

### Step 4: Test the Workflow

```bash
# Make a small change to a file
echo "<!-- Updated $(date) -->" >> index.html

# Commit and push
git add index.html
git commit -m "Test CI/CD deployment"
git push origin main
```

**Check deployment status:**
1. Go to GitHub repo
2. Click **Actions** tab
3. Watch the workflow run in real-time
4. If green ✅, your app is deployed!

---

## Monitoring & Troubleshooting

### Check Apache Status
```bash
sudo systemctl status apache2
sudo systemctl restart apache2
```

### View Apache Error Logs
```bash
tail -f /var/log/apache2/cyberdefence-error.log
```

### Test Database Connection
```bash
mysql -h localhost -u exam_user -p cyber_defence_exam
# Then type: SELECT DATABASE();
```

### Test Email Configuration
```bash
php -r "
\$body = 'Test email from CyberDefenceExamApp';
\$headers = 'From: windows.congress@gmail.com';
mail('your-email@example.com', 'Test', \$body, \$headers);
echo 'Email sent (check spam folder)';
"
```

### Check PHP Configuration
```bash
php -v
php -m | grep -i mysql
php -i | grep -i SMTP
```

---

## Update Your Domain DNS

Once deployed, point your domain to your VPS IP:

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Find **DNS Settings**
3. Create or update **A Record**:
   - **Host**: `@` (for root domain) or `www`
   - **Type**: A
   - **Value**: Your VPS IP (e.g., `123.45.67.89`)
4. Wait 5-30 minutes for DNS to propagate

### Verify DNS
```bash
nslookup yourdomain.com
# or
dig yourdomain.com
```

---

## Security Best Practices

✅ **Do:**
- Use strong database passwords
- Keep credentials in `.env.production` secure
- Use HTTPS (Let's Encrypt auto-renews)
- Enable firewall on VPS
- Set up automated backups
- Monitor Apache logs regularly

❌ **Don't:**
- Commit `.env.production` to Git
- Use simple passwords
- Disable HTTPS
- Share SSH keys or credentials
- Run untrusted code

---

## Backup Strategy

### Backup Database
```bash
# Create backup
mysqldump -u exam_user -p cyber_defence_exam > backup-$(date +%Y%m%d).sql

# Restore from backup
mysql -u exam_user -p cyber_defence_exam < backup-20260619.sql
```

### Backup Full App
```bash
# Backup app directory
tar -czf cyberdefence-backup-$(date +%Y%m%d).tar.gz /var/www/CyberDefenceExamApp

# Download to local machine (from your computer)
scp root@123.45.67.89:/root/cyberdefence-backup-*.tar.gz .
```

---

## Support & Troubleshooting

### PHP-MySQL Connection Issues
```bash
# Verify MySQL is running
sudo systemctl status mysql-server

# Check PHP MySQL extension
php -m | grep mysql
```

### SMTP/Email Issues
```bash
# Check SMTP credentials in Apache config
grep -i smtp /etc/apache2/sites-available/cyberdefence.conf

# Test PHPMailer debug
tail -f /var/log/apache2/cyberdefence-error.log
# Then submit exam and watch for PHPMailer debug output
```

### Port 80/443 Already in Use
```bash
# Find process using port 80
sudo lsof -i :80

# Kill it (replace PID with the process ID)
sudo kill -9 PID
```

---

## Next Steps

1. ✅ Deploy to VPS using the script
2. ✅ Set up your domain DNS
3. ✅ Test the app (take exam, submit with email)
4. ✅ Configure GitHub Actions for CI/CD
5. ✅ Set up backups
6. ✅ Monitor logs regularly

---

**Questions?** Check Apache logs or GitHub Actions workflow output for detailed error messages.

**Happy deploying! 🚀**
