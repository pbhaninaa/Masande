# Tenant and Client User Guide

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Creating a Tenant](#creating-a-tenant)
4. [Creating a Client](#creating-a-client)
5. [Managing Tenants](#managing-tenants)
6. [Managing Clients](#managing-clients)
7. [User Roles and Permissions](#user-roles-and-permissions)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The Trips Management System is a multi-tenant application that allows platform administrators to manage multiple organizations (tenants) and their clients. Each tenant operates independently with its own set of users, clients, and trips.

### Key Concepts

- **Platform Admin**: Has full access to the system, can create and manage tenants
- **Tenant**: An organization using the system (e.g., a transport company)
- **Tenant Admin**: Manages their organization's settings, users, and clients
- **Client**: A customer of a tenant who takes trips

---

## Getting Started

### Accessing the Application

1. Open your web browser and navigate to: `http://localhost:8081`
2. You'll be presented with the login page

### First Time Login (Platform Admin)

When the system is first installed, a default platform admin account is created:

- **Username**: Platform admin username (check with your system administrator)
- **Password**: Provided during initial setup
- **Role**: PLATFORM_ADMIN

**Important**: Change the default password after your first login!

---

## Creating a Tenant

### Prerequisites
- You must be logged in as a **Platform Admin**

### Steps to Create a Tenant

1. **Navigate to Platform Dashboard**
   - After logging in as Platform Admin, you'll see the Platform Dashboard
   - Look for the "Tenants" section

2. **Click "Create Tenant" Button**
   - Find and click the "Create Tenant" or "+" button
   - A modal dialog will appear

3. **Fill in Tenant Information**

   #### Required Fields:

   - **Tenant Name**: The name of the organization
     - Example: "ABC Transport Services"
     - Must be unique
     - 3-100 characters

   - **Tenant Code**: A unique identifier for the tenant
     - Example: "ABC_TRANS"
     - Must be unique
     - Use uppercase letters, numbers, and underscores
     - 2-50 characters
     - Cannot be changed after creation

   - **Admin Email**: Email address for the tenant administrator
     - Example: "admin@abctransport.com"
     - Must be a valid email format
     - Will be used for tenant admin login

   - **Admin Password**: Password for the tenant administrator
     - Minimum 8 characters
     - Should include uppercase, lowercase, numbers, and special characters
     - Example: "SecurePass123!"

   - **Admin First Name**: Tenant administrator's first name
     - Example: "John"

   - **Admin Last Name**: Tenant administrator's last name
     - Example: "Smith"

   #### Optional Fields:

   - **Contact Email**: General contact email for the tenant
   - **Contact Phone**: Phone number for the tenant
   - **Address**: Physical address of the tenant organization

4. **Review and Submit**
   - Double-check all information
   - Click "Create" or "Submit" button
   - Wait for confirmation message

5. **Success**
   - You'll see a success notification
   - The new tenant appears in the tenants list
   - The tenant admin can now log in with the provided credentials

### Example Tenant Creation

```
Tenant Name:      ABC Transport Services
Tenant Code:      ABC_TRANS
Admin Email:      john.smith@abctransport.com
Admin Password:   SecurePass123!
Admin First Name: John
Admin Last Name:  Smith
Contact Email:    contact@abctransport.com
Contact Phone:    +27 11 234 5678
Address:          123 Main Street, Johannesburg, 2000
```

---

## Creating a Client

### Prerequisites
- You must be logged in as a **Tenant Admin** or **Platform Admin**
- You must be viewing the tenant's dashboard

### Steps to Create a Client

1. **Navigate to Clients Section**
   - From the Tenant Dashboard, find the "Clients" menu or section
   - Click on "Clients" to view the clients page

2. **Click "Create Client" Button**
   - Look for the "Create Client" or "+" button
   - A modal dialog will appear

3. **Fill in Client Information**

   #### Required Fields:

   - **First Name**: Client's first name
     - Example: "Sarah"
     - 2-50 characters

   - **Last Name**: Client's last name
     - Example: "Johnson"
     - 2-50 characters

   - **Email**: Client's email address
     - Example: "sarah.johnson@email.com"
     - Must be a valid email format
     - Must be unique within the tenant

   - **Phone Number**: Client's phone number
     - Example: "+27 82 345 6789"
     - Include country code
     - Used for trip notifications

   #### Optional Fields:

   - **ID Number**: National ID or passport number
   - **Date of Birth**: Client's date of birth
   - **Address**: Client's physical address
   - **Emergency Contact Name**: Name of emergency contact person
   - **Emergency Contact Phone**: Phone number of emergency contact
   - **Notes**: Additional information about the client

4. **Review and Submit**
   - Verify all information is correct
   - Click "Create" or "Submit" button
   - Wait for confirmation message

5. **Success**
   - You'll see a success notification
   - The new client appears in the clients list
   - The client can now be assigned to trips

### Example Client Creation

```
First Name:              Sarah
Last Name:               Johnson
Email:                   sarah.johnson@email.com
Phone Number:            +27 82 345 6789
ID Number:               8505155123084
Date of Birth:           1985-05-15
Address:                 456 Oak Avenue, Cape Town, 8001
Emergency Contact Name:  Michael Johnson
Emergency Contact Phone: +27 82 987 6543
Notes:                   Prefers morning trips
```

---

## Managing Tenants

### Viewing All Tenants (Platform Admin Only)

1. Log in as Platform Admin
2. Navigate to Platform Dashboard
3. View the list of all tenants with:
   - Tenant Name
   - Tenant Code
   - Contact Information
   - Status (Active/Inactive)
   - Number of users
   - Creation date

### Editing a Tenant

1. From the tenants list, click the "Edit" button next to the tenant
2. Update the following fields:
   - Tenant Name
   - Contact Email
   - Contact Phone
   - Address
   - Status
3. Click "Save Changes"

### Deactivating a Tenant

1. Find the tenant in the list
2. Click "Edit" or "Actions" menu
3. Change status to "Inactive" or click "Deactivate"
4. Confirm the action

**Note**: Deactivating a tenant:
- Prevents tenant users from logging in
- Preserves all data
- Can be reactivated later

### Viewing Tenant Details

Click on a tenant name to view:
- Complete tenant information
- List of tenant administrators
- Number of clients
- Number of active trips
- Recent activity

---

## Managing Clients

### Viewing All Clients (Tenant Admin)

1. Log in as Tenant Admin
2. Navigate to "Clients" section
3. View all clients in your organization with:
   - Name
   - Email
   - Phone number
   - Number of trips
   - Last trip date

### Searching for Clients

1. Use the search bar at the top of the clients list
2. Search by:
   - Name
   - Email
   - Phone number
   - ID number

### Editing a Client

1. From the clients list, click the "Edit" button next to the client
2. Update any information
3. Click "Save Changes"

### Viewing Client Details

Click on a client name to view:
- Complete client information
- Trip history
- Payment history
- Contact details
- Emergency contact information

### Deleting a Client

1. Find the client in the list
2. Click "Delete" or "Actions" > "Delete"
3. Confirm the deletion

**Warning**: This action cannot be undone. Consider deactivating instead.

---

## User Roles and Permissions

### Platform Admin
- Create and manage tenants
- View all system data
- Create platform admin users
- System configuration
- Access to all tenants

### Tenant Admin
- Manage their tenant's information
- Create and manage clients
- Create and manage trips
- Create tenant users (drivers, staff)
- View reports for their tenant
- Cannot access other tenants' data

### Tenant User
- View assigned trips
- Update trip status
- View clients related to their trips
- Limited access based on role

---

## Troubleshooting

### Common Issues

#### Cannot Create Tenant - "Tenant Code Already Exists"
**Solution**: Choose a different, unique tenant code

#### Cannot Create Client - "Email Already Exists"
**Solution**: The email is already registered for another client in your tenant. Use a different email or check if the client already exists.

#### Tenant Admin Cannot Log In
**Possible Causes**:
- Incorrect credentials
- Tenant is deactivated
- Account is locked

**Solution**: Contact Platform Admin to verify account status and reset password if needed.

#### Missing "Create Tenant" Button
**Cause**: You're not logged in as Platform Admin

**Solution**: Log in with Platform Admin credentials

#### Client Not Receiving Notifications
**Possible Causes**:
- Incorrect phone number format
- Twilio not configured
- WhatsApp integration not enabled

**Solution**:
- Verify phone number includes country code (+27 for South Africa)
- Contact system administrator to check notification settings

### Getting Help

If you encounter issues not covered in this guide:

1. Check the system logs for error messages
2. Contact your system administrator
3. Refer to the technical documentation
4. Check the SETUP_GUIDE.md for configuration issues

---

## Best Practices

### For Platform Admins

1. **Tenant Codes**: Use meaningful, consistent naming conventions
   - Example: Company initials + "_" + descriptor
   - ABC_TRANSPORT, XYZ_LOGISTICS

2. **Security**:
   - Use strong passwords for tenant admins
   - Regularly review active tenants
   - Monitor system usage

3. **Organization**:
   - Document tenant creation dates
   - Keep contact information up to date
   - Regular data backups

### For Tenant Admins

1. **Client Information**:
   - Keep phone numbers updated for notifications
   - Verify email addresses for accuracy
   - Include emergency contacts

2. **Data Management**:
   - Regularly review and update client information
   - Remove duplicate entries
   - Archive inactive clients

3. **Security**:
   - Use strong passwords
   - Don't share admin credentials
   - Log out when finished

---

## Quick Reference

### Tenant Creation Checklist
- [ ] Unique tenant name selected
- [ ] Unique tenant code chosen (cannot be changed later)
- [ ] Valid admin email address
- [ ] Strong password created
- [ ] Admin first and last name provided
- [ ] Contact information added (optional but recommended)
- [ ] Verified all information before submission

### Client Creation Checklist
- [ ] First and last name entered
- [ ] Valid email address (unique within tenant)
- [ ] Phone number with country code
- [ ] Additional information added (optional)
- [ ] Emergency contact information (recommended)
- [ ] Verified all information before submission

---

## Appendix

### Phone Number Format
Always include the country code:
- South Africa: +27 82 123 4567
- International: +[country code] [number]

### Password Requirements
- Minimum 8 characters
- Include uppercase letters (A-Z)
- Include lowercase letters (a-z)
- Include numbers (0-9)
- Include special characters (!@#$%^&*)
- Example: `SecurePass123!`

### Tenant Code Guidelines
- Use uppercase letters
- Use numbers
- Use underscores for spaces
- No special characters except underscore
- 2-50 characters
- Examples: ABC_TRANS, XYZ_LOG_2024, TRANSPORT_CO

---

*Last Updated: May 2026*
*Version: 1.0*
