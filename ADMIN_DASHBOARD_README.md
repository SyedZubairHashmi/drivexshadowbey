# Admin Dashboard - Company Management

## Overview
The Admin Dashboard is a new independent dashboard specifically designed for admin role users to manage companies. It provides a clean, focused interface for company management operations.

## Features

### 🏢 Company Management
- **List of Companies**: View all companies in a paginated table
- **Company Details**: S.No, Owner Name, Company Name, Company Email, Status
- **Status Management**: Toggle between Active/Inactive status
- **Search & Filter**: Search by company name, owner name, or email
- **Actions**: View, Edit, Delete companies

### 🎨 UI Components
- **Sidebar**: Clean sidebar with Drive Deals logo and Dashboard navigation
- **User Profile**: Admin user profile section at the bottom
- **Responsive Design**: Works on desktop and mobile devices
- **Pagination**: Navigate through multiple pages of companies

### 🔧 Technical Features
- **Independent Layout**: Completely separate from the main dashboard
- **Mock Data**: Currently uses mock data for demonstration
- **API Ready**: Backend API endpoints are prepared for integration
- **TypeScript**: Fully typed components and interfaces

## File Structure

```
app/admin/
├── page.tsx                    # Main admin dashboard page

components/
├── layout/
│   └── admin-sidebar.tsx       # Admin-specific sidebar component
└── admin/
    └── company-table.tsx       # Company table component

app/api/companies/
├── route.ts                    # GET/POST companies
├── [id]/
│   ├── route.ts               # GET/PUT/DELETE specific company
│   └── status/
│       └── route.ts           # PATCH company status

lib/
├── api.ts                     # Company API functions
└── models/
    └── Company.ts             # Company data model
```

## Access

### From Main Dashboard
1. Navigate to the main dashboard (`/dashboard`)
2. Click the "Admin Panel" button in the top section
3. You'll be redirected to `/admin`

### Direct Access
- URL: `http://localhost:3000/admin`

## API Endpoints

### Companies
- `GET /api/companies` - Get all companies (with search/filter)
- `POST /api/companies` - Create new company
- `GET /api/companies/[id]` - Get specific company
- `PUT /api/companies/[id]` - Update company
- `DELETE /api/companies/[id]` - Delete company
- `PATCH /api/companies/[id]/status` - Update company status

## Data Model

```typescript
interface Company {
  _id: string;
  ownerName: string;
  companyName: string;
  companyEmail: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}
```

## Mock Data
The dashboard currently uses mock data with 11 sample companies:
- Bright Future Innovations
- EcoTech Solutions
- HealthWise Technologies
- SmartHome Systems
- FinTech Innovations
- Green Energy Co.
- EduTech Resources
- TravelMate Solutions
- AgriTech Innovations
- Urban Development Partners
- Cyber Security Experts

## Future Enhancements
- [ ] Add Company form/modal
- [ ] Bulk operations (bulk status change, bulk delete)
- [ ] Export functionality (CSV, PDF)
- [ ] Advanced filtering options
- [ ] Integration with main dashboard data

## Development Notes
- The dashboard is completely independent of the main dashboard
- All components are reusable and well-typed
- API endpoints are ready for backend integration
- Mock data can be easily replaced with real API calls
- Responsive design follows the same patterns as the main dashboard

