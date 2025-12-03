# Asset & Rental Management System - Implementation Guide

## 📋 Overview

This is a comprehensive **Asset & Rental Management System** built for an Industrial Park ERP Dashboard. The system handles factory assets, tenant management, dynamic pricing policies, and complex rent calculations.

## 🎯 Key Features

### 1. **Standard Factory Manager** (`StandardFactoryPage.tsx`)
- View and manage industrial factory assets with **Ant Design ProTable**
- Filter by zone, floor level, area, and status
- Create, edit, and delete asset records
- Real-time status indicators (Vacant, Leased, Decoration)
- Link to tenant profiles for leased assets

### 2. **Charging Standards Configurator** (`ChargingStandardsPage.tsx`)
Two-tab interface for pricing configuration:

#### **Base Rates Tab**
- Configure pricing for different asset categories:
  - Factory 1F: ¥5.0/sqm/month
  - Factory 2F: ¥4.0/sqm/month
  - Factory 3F+: ¥3.0/sqm/month
  - Dormitory, Retail Store
- Manage both rent and management fees

#### **Policy Engine Tab**
- Create time-based discount policies (e.g., "3-Year Free, 2-Year Half")
- Define multiple discount stages
- Target specific industries
- Each stage can have different rent and management fee discounts

### 3. **Add Tenant Wizard** (`AddTenantWizard.tsx`)
Intelligent 4-step form with auto-calculation:

#### **Step 1: Select Asset**
- Choose from vacant assets only
- Display asset details (zone, floor, area)

#### **Step 2: Tenant Information**
- Enter tenant details (name, type, industry, contacts)
- Support for both enterprise and personal tenants

#### **Step 3: Lease Details**
- Set lease start and end dates
- Configure decoration period (免租期)
- Auto-calculate billing start date

#### **Step 4: Pricing & Calculation**
- Select pricing policy (optional)
- **Auto-Calculate** button generates complete payment schedule
- Preview payment schedule with stage-by-stage breakdown
- Display total rent, management fees, and grand total

## 🏗️ Technical Architecture

### **TypeScript Interfaces** (`src/types/asset.ts`)
Comprehensive type definitions for:
- `Asset`: Factory assets with zone, floor, area, status
- `PricingPolicy`: Time-based discount rules with stages
- `BaseRate`: Base pricing by category
- `LeaseContract`: Contract with payment schedule
- `Tenant`: Enterprise/personal tenant information
- `RentCalculation`: Calculation results

### **State Management** (`src/stores/assetStore.ts`)
Zustand store managing:
- Assets collection with CRUD operations
- Base rates configuration
- Pricing policies
- Lease contracts
- Tenants database
- Cart for bulk operations
- Mock data generator for testing

### **Business Logic** (`src/hooks/useRentCalculator.ts`)
Core calculation engine:
- **Floor-based pricing**: Automatically selects base rate by floor level
- **Area multiplication**: `Base Rate × Area × Policy Discount`
- **Stage-by-stage calculation**: Applies different discounts over time
- **Payment schedule generation**: Month-by-month breakdown
- **Decoration period handling**: Free period before billing starts

### **Calculation Formula**

```typescript
For each policy stage:
  Monthly Rent = (Base Rent Rate × Area) × (1 - Rent Discount %)
  Monthly Mgmt = (Base Mgmt Rate × Area) × (1 - Mgmt Discount %)
  
Total Rent = Σ (Monthly Rent × Months in Stage)
Total Mgmt = Σ (Monthly Mgmt × Months in Stage)
Grand Total = Total Rent + Total Mgmt
```

## 🚀 Usage Example

### Creating a New Lease Contract

1. **Navigate**: Park Dashboard → Asset Management → Add Tenant

2. **Select Asset**: Choose "Zone A - A1-11 (1500㎡, 2F)"
   - System reads: Floor 2 → Base Rent = ¥4.0/sqm

3. **Enter Tenant**: "Tech Company Ltd" (High-Tech Industry)

4. **Set Lease**: 
   - Start: 2025-01-01
   - End: 2029-12-31 (5 years = 60 months)
   - Decoration: 90 days → Billing starts 2025-04-01

5. **Apply Policy**: Select "3-Year Free, 2-Year Half"
   - Stage 1 (36 months): 100% rent discount
   - Stage 2 (24 months): 50% rent discount

6. **Calculate**:
   ```
   Months 1-36: ¥0 rent + ¥750 mgmt = ¥750/month
   Months 37-60: ¥3,000 rent + ¥750 mgmt = ¥3,750/month
   
   Total: ¥117,000
   ```

7. **Confirm**: Creates contract, updates asset status to "Leased"

## 📂 File Structure

```
src/
├── types/
│   └── asset.ts                    # All TypeScript interfaces
├── stores/
│   └── assetStore.ts               # Zustand state management
├── hooks/
│   └── useRentCalculator.ts        # Pricing calculation logic
└── components/
    ├── ParkDashboard.tsx           # Main dashboard with navigation
    └── park/
        ├── StandardFactoryPage.tsx # Asset table (ProTable)
        ├── ChargingStandardsPage.tsx # Pricing config (Tabs)
        └── AddTenantWizard.tsx     # Multi-step form (StepsForm)
```

## 🎨 Navigation Structure

```
Park Dashboard
└── Asset Management
    ├── 标准厂房 (Standard Factory)
    ├── 收费标准 (Charging Standards)
    └── 添加租户 (Add Tenant)
```

## 🔧 Dependencies

- **React**: UI framework
- **Ant Design (v5)**: UI components
- **@ant-design/pro-components**: ProTable, ProForm, StepsForm
- **Zustand**: State management
- **Lucide React**: Icons
- **TypeScript**: Type safety

## 💡 Key Design Decisions

### 1. **ProTable & ProForm**
Used Ant Design Pro components for:
- Built-in search, filter, pagination
- Form validation and layout
- Consistent enterprise UI

### 2. **Floor-Based Pricing**
Critical business rule:
- 1F (ground floor) = highest price (¥5.0)
- 2F = medium price (¥4.0)
- 3F+ = lowest price (¥3.0)
- Automatically determined from asset data

### 3. **Zustand over Redux**
Lightweight state management:
- Less boilerplate
- Easy to test
- Built-in TypeScript support
- Perfect for medium-sized apps

### 4. **Calculation Preview**
Show users the exact payment schedule before confirming:
- Transparency
- No surprises
- Easy to compare policies

## 🧪 Mock Data

The system initializes with:
- **72 factory assets** across 4 zones (A, B, C, D)
- **3 floors** per building
- **3 pricing policies** (including "3-Year Free, 2-Year Half")
- **5 base rate categories**

Access mock data via: `useAssetStore.getState().initializeMockData()`

## 🔮 Future Enhancements

1. **Tenant Management Pages**:
   - Enterprise Tenants list
   - Personal Tenants list
   - Contract history

2. **Rental Pages**:
   - Dormitory Manager
   - Retail Store Manager

3. **Reports**:
   - Revenue forecasting
   - Occupancy rate charts
   - Payment tracking

4. **Bulk Operations**:
   - Multi-select assets
   - Batch pricing updates
   - Export to Excel

5. **Advanced Features**:
   - Contract renewal workflow
   - Payment reminders
   - Digital signatures
   - Invoice generation

## 📝 Notes

- All prices in Chinese Yuan (¥)
- Dates formatted as YYYY-MM-DD
- Monthly billing cycle
- Decoration period is rent-free (but may have mgmt fees depending on policy)

## 🤝 Integration Points

To integrate with backend API:

1. Replace `useAssetStore` mock data with API calls
2. Update CRUD operations to call REST endpoints
3. Add loading states and error handling
4. Implement authentication checks

---

**Built with ❤️ for Enterprise ERP Systems**
