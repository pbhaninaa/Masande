# Multi-Tenant Trips Management System - User Hierarchy Guide

## System Architecture

This system implements a **hierarchical multi-tenant architecture** with role-based access control (RBAC).

### User Hierarchy

```
Platform Admin (Super Admin)
    ↓
Tenants (Organizations/Merchants)
    ↓
Tenant Users (Admins, Managers, Agents)
    ↓
Clients/Customers
```

## Roles & Permissions

### 1. Platform Admin (`PLATFORM_ADMIN`)
**The Supreme Administrator**

**Access:**
- Full system access across ALL tenants
- Can see and manage all tenants, users, clients, and trips
- System-wide analytics and insights

**Capabilities:**
- ✅ Create, update, delete tenants
- ✅ View all tenants and their data
- ✅ Access platform-wide dashboard
- ✅ Manage system configurations
- ✅ View performance metrics across all tenants

**Default Account:**
- Username: `admin`
- Email: `admin@platform.com`
- Password: `admin123` (⚠️ Change immediately!)

---

### 2. Tenant Admin (`TENANT_ADMIN`)
**Organization/Merchant Owner**

**Access:**
- Full access to their organization's data ONLY
- Cannot see other tenants' data
- Manages their organization

**Capabilities:**
- ✅ Manage their tenant profile
- ✅ Invite and manage users (Managers, Agents)
- ✅ Create and manage clients/customers
- ✅ View and manage all trips within their organization
- ✅ Access tenant-specific dashboard and analytics
- ❌ Cannot access other tenants' data
- ❌ Cannot create new tenants

---

### 3. Tenant Manager (`TENANT_MANAGER`)
**Operations Manager**

**Access:**
- Operational access within their tenant
- Can manage day-to-day operations

**Capabilities:**
- ✅ Manage clients/customers
- ✅ Create and approve trips
- ✅ View tenant dashboard
- ✅ Generate reports
- ❌ Cannot manage other users
- ❌ Cannot modify tenant settings

---

### 4. Tenant Agent (`TENANT_AGENT`)
**Front-line Staff**

**Access:**
- Limited operational access
- Handles customer interactions

**Capabilities:**
- ✅ Create trip requests
- ✅ View assigned customers
- ✅ Update trip information
- ❌ Cannot approve trips
- ❌ Cannot manage users or clients

---

### 5. Client (`CLIENT`)
**End Customer**

**Access:**
- View-only access to their own data

**Capabilities:**
- ✅ View their own trips
- ✅ View their loan history
- ✅ Access personal dashboard
- ❌ Cannot see other customers' data
- ❌ Cannot create or modify trips

---

## Getting Started

### First-Time Setup

1. **Backend will auto-create Platform Admin** on first run
   - Check console logs for default credentials
   - **IMPORTANT:** Change the default password immediately!

2. **Platform Admin creates first Tenant:**
   ```bash
   POST /api/tenants
   {
     "name": "ABC Travel Agency",
     "code": "ABC001",
     "contactEmail": "contact@abctravel.com",
     "contactPhone": "+1234567890",
     "adminEmail": "admin@abctravel.com",
     "adminName": "John Doe",
     "adminPhone": "+1234567890",
     "adminPassword": "SecurePassword123"
   }
   ```

3. **Tenant Admin logs in** and sets up their organization:
   - Add users (Managers, Agents)
   - Add clients/customers
   - Start creating trips

4. **Tenant invites Clients:**
   - Tenant Admin/Manager creates client accounts
   - Clients receive credentials
   - Clients can access their personal dashboard

---

## Data Isolation

### Tenant Isolation
- Each tenant's data is completely isolated
- Tenants cannot see or access other tenants' data
- Enforced at database and application level

### Customer/Client Isolation
- Clients belong to ONE tenant only
- Clients can only see their own data
- Cannot access other clients' information

---

## API Endpoints by Role

### Platform Admin Only
```
GET    /api/dashboard/platform-admin     # Platform-wide analytics
GET    /api/tenants                      # All tenants
POST   /api/tenants                      # Create tenant
DELETE /api/tenants/{id}                # Deactivate tenant
```

### Tenant Admin & Managers
```
GET    /api/dashboard/tenant              # Tenant analytics
GET    /api/tenants/{id}                  # Their tenant info
PUT    /api/tenants/{id}                  # Update their tenant
GET    /api/trips                         # Their tenant's trips
POST   /api/trips                         # Create trip
GET    /api/clients                       # Their tenant's clients
POST   /api/clients                       # Create client
```

### All Authenticated Users
```
GET    /api/dashboard/customer/{id}       # Customer dashboard
GET    /api/trips/{id}                    # View trip (if authorized)
```

---

## Security Features

### 1. **Role-Based Access Control (RBAC)**
- Spring Security `@PreAuthorize` annotations
- Method-level security
- Automatic enforcement

### 2. **Tenant Context Isolation**
- Every request validates tenant context
- Users can only access their tenant's data
- Cross-tenant access attempts are blocked

### 3. **Password Security**
- BCrypt password hashing
- Strong password policies recommended
- JWT token-based authentication

### 4. **Audit Trail**
- All actions are logged
- Track who did what and when
- Tenant-specific audit logs

---

## Dashboard Analytics

### Platform Admin Dashboard
```json
{
  "totalTenants": 25,
  "activeTenants": 23,
  "totalUsers": 150,
  "totalCustomers": 5000,
  "totalTrips": 12500,
  "tripsByStatus": {
    "PENDING": 150,
    "APPROVED": 8500,
    "REJECTED": 50,
    "COMPLETED": 3750,
    "CANCELLED": 50
  },
  "totalLoanAmount": "2500000.00"
}
```

### Tenant Dashboard
```json
{
  "totalUsers": 8,
  "totalCustomers": 250,
  "activeCustomers": 230,
  "totalTrips": 500,
  "tripsByStatus": {
    "PENDING": 10,
    "APPROVED": 350,
    "COMPLETED": 130,
    "REJECTED": 5,
    "CANCELLED": 5
  },
  "totalLoanAmount": "125000.00",
  "pendingLoanAmount": "5000.00"
}
```

### Customer Dashboard
```json
{
  "customerId": 123,
  "customerName": "Jane Smith",
  "email": "jane@example.com",
  "phoneNumber": "+1234567890",
  "totalTrips": 5,
  "pendingTrips": 1,
  "approvedTrips": 2,
  "completedTrips": 2,
  "totalLoanAmount": "15000.00",
  "activeLoanAmount": "7500.00"
}
```

---

## Best Practices

### For Platform Admins
1. Create tenants with secure initial passwords
2. Monitor platform-wide metrics regularly
3. Review tenant activity logs
4. Deactivate suspicious tenants immediately

### For Tenant Admins
1. Use strong passwords for all users
2. Assign appropriate roles to users
3. Review user permissions regularly
4. Monitor customer activities
5. Keep contact information up-to-date

### For All Users
1. Never share login credentials
2. Change default passwords immediately
3. Report suspicious activity
4. Log out when not in use

---

## Troubleshooting

### "Access Denied" Errors
- Check your role and permissions
- Ensure you're accessing your tenant's data only
- Contact your admin if needed

### Cannot See Data
- Verify you're logged in
- Check if you belong to the correct tenant
- Ensure data exists in your tenant's scope

### Password Issues
- Contact your Tenant Admin (for users)
- Contact Platform Admin (for Tenant Admins)
- Use password reset functionality

---

## Technical Implementation

### Backend (Spring Boot)
- Multi-tenancy with tenant isolation
- Role-based security with Spring Security
- JWT authentication
- Method-level authorization with `@PreAuthorize`

### Frontend (Vue 2)
- Role-based UI rendering
- Tenant-specific views
- Responsive dashboards
- Real-time analytics

### Database
- Tenant foreign keys on all tables
- Row-level security
- Audit logging
- Data isolation enforced at DB level

---

## Support

For assistance:
- **Clients:** Contact your Tenant Admin
- **Tenant Users:** Contact your Tenant Admin
- **Tenant Admins:** Contact Platform Admin
- **Platform Admins:** Check system documentation

---

**System Status:** ✅ Multi-Tenant, Role-Based, Fully Isolated
**Security:** ✅ RBAC, JWT, Bcrypt, Audit Logging
**Scalability:** ✅ Supports unlimited tenants and users
