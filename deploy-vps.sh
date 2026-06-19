#!/bin/bash
################################################################################
# CyberDefenceExamApp - Automated VPS Deployment Script
# 
# Usage:
#   chmod +x deploy-vps.sh
#   ./deploy-vps.sh
#
# This script sets up a complete production environment on Ubuntu 22.04 LTS
# including Apache, PHP, MySQL, SSL, and the exam app.
################################################################################

set -e  # Exit on any error

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration (customize as needed)
DOMAIN="${1:-example.com}"
APP_DIR="/var/www/CyberDefenceExamApp"
DB_NAME="cyber_defence_exam"
DB_USER="exam_user"
DB_PASS="${2:-$(openssl rand -base64 16)}"  # Random password if not provided
API_KEY="${3:-$(openssl rand -hex 32)}"      # Random API key
REPO_URL="https://github.com/Chris007M/CyberDefenceExamApp.git"

# SMTP Configuration (UPDATE THESE)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="windows.congress@gmail.com"
SMTP_PASS="oahccfxfhszlqezq"
SMTP_SECURE="tls"
SMTP_FROM="windows.congress@gmail.com"
SMTP_FROM_NAME="Cyber Defence Exam"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}CyberDefenceExamApp - VPS Deployment${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${YELLOW}Configuration:${NC}"
echo "Domain: $DOMAIN"
echo "Database: $DB_NAME"
echo "DB User: $DB_USER"
echo "App Directory: $APP_DIR"
echo -e "API Key (generated): ${API_KEY:0:16}...${NC}\n"

# Ensure running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}This script must be run as root (use: sudo ./deploy-vps.sh)${NC}"
   exit 1
fi

# Step 1: Update system
echo -e "${YELLOW}[1/10] Updating system packages...${NC}"
apt update && apt upgrade -y > /dev/null 2>&1

# Step 2: Install Apache, PHP, MySQL
echo -e "${YELLOW}[2/10] Installing Apache, PHP, MySQL...${NC}"
apt install -y apache2 php php-mysql php-cli php-gd php-json php-mbstring \
  mysql-server git curl wget certbot python3-certbot-apache unzip > /dev/null 2>&1

# Step 3: Configure PHP
echo -e "${YELLOW}[3/10] Configuring PHP...${NC}"
a2enmod rewrite php8.1 > /dev/null 2>&1
phpenmod mbstring gd json mysql

# Step 4: Start services
echo -e "${YELLOW}[4/10] Starting Apache and MySQL...${NC}"
systemctl start apache2 mysql-server
systemctl enable apache2 mysql-server > /dev/null 2>&1

# Step 5: Deploy app code
echo -e "${YELLOW}[5/10] Deploying app code from GitHub...${NC}"
if [ -d "$APP_DIR" ]; then
  cd "$APP_DIR"
  git pull origin main > /dev/null 2>&1
else
  git clone "$REPO_URL" "$APP_DIR" > /dev/null 2>&1
fi
chown -R www-data:www-data "$APP_DIR"
chmod -R 755 "$APP_DIR"

# Step 6: Setup MySQL database
echo -e "${YELLOW}[6/10] Setting up MySQL database...${NC}"
mysql -u root <<MYSQL_SETUP
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
MYSQL_SETUP

# Import schema if it exists
if [ -f "$APP_DIR/database/schema.sql" ]; then
  mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$APP_DIR/database/schema.sql" 2>/dev/null || true
fi

# Step 7: Configure Apache VirtualHost
echo -e "${YELLOW}[7/10] Configuring Apache VirtualHost...${NC}"
cat > /etc/apache2/sites-available/cyberdefence.conf <<APACHE_CONFIG
<VirtualHost *:80>
    ServerName $DOMAIN
    ServerAlias www.$DOMAIN
    
    DocumentRoot $APP_DIR
    
    <Directory $APP_DIR>
        AllowOverride All
        Require all granted
    </Directory>
    
    # SMTP Configuration for Email Sending
    SetEnv SMTP_HOST $SMTP_HOST
    SetEnv SMTP_PORT $SMTP_PORT
    SetEnv SMTP_USER $SMTP_USER
    SetEnv SMTP_PASS $SMTP_PASS
    SetEnv SMTP_SECURE $SMTP_SECURE
    SetEnv SMTP_FROM $SMTP_FROM
    SetEnv SMTP_FROM_NAME "$SMTP_FROM_NAME"
    
    # Database Configuration
    SetEnv CD_DB_HOST localhost
    SetEnv CD_DB_NAME $DB_NAME
    SetEnv CD_DB_USER $DB_USER
    SetEnv CD_DB_PASS $DB_PASS
    
    # API Security
    SetEnv CD_API_KEY $API_KEY
    
    ErrorLog \${APACHE_LOG_DIR}/cyberdefence-error.log
    CustomLog \${APACHE_LOG_DIR}/cyberdefence-access.log combined
    
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
    </IfModule>
</VirtualHost>
APACHE_CONFIG

a2ensite cyberdefence.conf > /dev/null 2>&1
a2dissite 000-default.conf > /dev/null 2>&1
apache2ctl configtest > /dev/null 2>&1

# Step 8: Setup SSL with Let's Encrypt
echo -e "${YELLOW}[8/10] Setting up HTTPS with Let's Encrypt...${NC}"
certbot --apache --non-interactive --agree-tos --email admin@$DOMAIN -d $DOMAIN -d www.$DOMAIN 2>/dev/null || echo -e "${YELLOW}SSL setup skipped (requires valid domain)${NC}"

# Step 9: Restart Apache
echo -e "${YELLOW}[9/10] Restarting Apache...${NC}"
systemctl restart apache2

# Step 10: Create .env file with credentials
echo -e "${YELLOW}[10/10] Creating environment credentials file...${NC}"
cat > "$APP_DIR/.env.production" <<ENV_FILE
# Production Environment Variables
DOMAIN=$DOMAIN
DB_HOST=localhost
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASS=$DB_PASS
API_KEY=$API_KEY
SMTP_HOST=$SMTP_HOST
SMTP_PORT=$SMTP_PORT
SMTP_USER=$SMTP_USER
SMTP_PASS=$SMTP_PASS
SMTP_SECURE=$SMTP_SECURE
SMTP_FROM=$SMTP_FROM
SMTP_FROM_NAME=$SMTP_FROM_NAME
ENV_FILE

chmod 600 "$APP_DIR/.env.production"

# Summary
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${YELLOW}Access Information:${NC}"
echo "URL: https://$DOMAIN"
echo "Or by IP: http://$(hostname -I | awk '{print $1}')/CyberDefenceExamApp"
echo ""

echo -e "${YELLOW}Database Credentials (saved in .env.production):${NC}"
echo "Host: localhost"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Password: $DB_PASS"
echo ""

echo -e "${YELLOW}API Key:${NC}"
echo "$API_KEY"
echo ""

echo -e "${YELLOW}Important:${NC}"
echo "• Save credentials from .env.production in a secure location"
echo "• Test email sending: Take exam → Submit with valid email"
echo "• Monitor logs: tail -f /var/log/apache2/cyberdefence-error.log"
echo "• Check MySQL: mysql -u $DB_USER -p$DB_PASS $DB_NAME"
echo ""

echo -e "${GREEN}Next steps:${NC}"
echo "1. Point your domain DNS to this server's IP"
echo "2. Test the app at https://$DOMAIN"
echo "3. Set up GitHub Actions CI/CD for auto-deployment (see docs)"
echo ""
