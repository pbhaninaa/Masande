# Trips Management System - Setup Guide

## Overview

This is a multi-tenant Trips Management System with role-based access control built with Spring Boot (backend) and Vue 2 (frontend).

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Node.js 14+ and npm
- MySQL 8.0+

## Initial Setup

### 1. Database Setup

Create MySQL database:
```sql
CREATE DATABASE triploan_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend Setup

Navigate to backend directory:
```bash
cd "Back end"
```

Update `src/main/resources/application.properties` with your database credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/triploan_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=your_username
spring.datasource.password=your_password
```

Run the backend:
```bash
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

Navigate to frontend directory:
```bash
cd "Front end"
```

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run serve
```

The frontend will start on `http://localhost:8081`

## Default Credentials

**IMPORTANT**: On first startup, the system automatically creates a Platform Admin account:

- **Email**: admin@platform.com
- **Password**: admin123
- **Tenant Code**: PLATFORM

**⚠️ SECURITY WARNING**: Change the default password immediately after first login!

## User Roles

The system supports 5 role types:

1. **PLATFORM_ADMIN** - Super administrator
   - Manages all tenants, users, and clients
   - Access to platform-wide analytics
   - Can create/edit/delete tenants

2. **TENANT_ADMIN** - Organization owner
   - Manages their organization
   - Can invite managers and agents
   - Access to organization-level analytics

3. **TENANT_MANAGER** - Operations manager
   - Manages day-to-day operations
   - Can create trips and manage clients
   - Limited administrative access

4. **TENANT_AGENT** - Front-line staff
   - Creates and manages trips
   - Handles customer interactions
   - Basic operational access

5. **CLIENT** - End customer
   - Views their own trips and payments
   - Basic read-only access

## First Login

1. Open browser to `http://localhost:8081`
2. Click "Login"
3. Enter credentials:
   - Email: `admin@platform.com`
   - Password: `admin123`
   - Tenant Code: `PLATFORM`
4. You'll be redirected to the Platform Dashboard

## Creating Your First Tenant

1. Login as Platform Admin
2. Navigate to "Tenants" from the navigation menu
3. Click "+ Create Tenant"
4. Fill in the form:
   - Tenant Name: e.g., "ABC Travel Agency"
   - Tenant Code: e.g., "ABC" (unique identifier)
   - Contact Email: organization email
   - Contact Phone: organization phone
   - Admin Email: email for tenant admin user
   - Admin Password: password for tenant admin user
5. Click "Create"

The tenant admin can now login with:
- Email: the admin email you provided
- Password: the admin password you provided
- Tenant Code: the tenant code you created

## API Documentation

Once the backend is running, access Swagger documentation at:
`http://localhost:8080/swagger-ui.html`

## Security Features

- JWT-based authentication
- BCrypt password hashing
- Role-based authorization with @PreAuthorize
- Multi-tenant data isolation
- CORS enabled for frontend communication

## Building for Production

### Backend
```bash
cd "Back end"
./mvnw clean package
java -jar target/TripsManagement-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd "Front end"
npm run build
```

The production build will be in the `dist/` directory.

## Troubleshooting

### Backend won't start
- Verify MySQL is running
- Check database credentials in application.properties
- Ensure port 8080 is not in use

### Frontend won't start
- Run `npm install` to ensure dependencies are installed
- Check that port 8081 is not in use
- Clear node_modules and reinstall if needed: `rm -rf node_modules && npm install`

### Cannot login
- Verify backend is running on port 8080
- Check browser console for CORS errors
- Verify database has the Platform tenant and admin user

## Default Configuration

### Backend (application.properties)
- Server Port: 8080
- Database: MySQL on localhost:3306
- JWT Secret: changeme (change in production!)
- JWT Expiration: 24 hours

### Frontend (vue.config.js)
- Dev Server Port: 8081
- API Base URL: http://localhost:8080

## Next Steps

1. Change default admin password
2. Configure email notifications (if using Twilio)
3. Create your first tenant organization
4. Invite users with appropriate roles
5. Set up production environment variables
6. Configure SSL/HTTPS for production
7. Set up database backups

## Support

For issues or questions:
- Check the API documentation at `/swagger-ui.html`
- Review the MULTI_TENANT_GUIDE.md for detailed feature documentation
- Check application logs for error messages
