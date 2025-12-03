/**
 * Asset & Rental Management - TypeScript Interfaces
 * Enterprise ERP System for Industrial Park Dashboard
 */

// ==================== Asset Management ====================

/**
 * Asset status enumeration
 */
export enum AssetStatus {
  VACANT = 'vacant',      // 空置
  LEASED = 'leased',      // 已租
  DECORATION = 'decoration' // 装修中
}

/**
 * Asset type enumeration
 */
export enum AssetType {
  FACTORY = 'factory',    // 标准厂房
  DORM = 'dorm',          // 宿舍
  RETAIL = 'retail'       // 商铺
}

/**
 * Zone enumeration
 */
export enum Zone {
  ZONE_A = 'A',
  ZONE_B = 'B',
  ZONE_C = 'C',
  ZONE_D = 'D',
  // Functional Zones for Dormitory
  LOW_RENT = 'LowRent',
  LOGISTICS = 'Logistics',
  RESEARCH = 'Research'
}

/**
 * Core Asset interface
 */
export interface Asset {
  id: string;
  type: AssetType;
  zone: Zone;
  addressCode: string;      // e.g., "A1-1"
  floorLevel: number;       // Critical: 1, 2, 3+ determines base price
  area: number;             // Square meters
  status: AssetStatus;
  tenantId?: string;        // Link to tenant if leased
  tenantName?: string;
  leaseStartDate?: string;  // YYYY-MM-DD
  leaseEndDate?: string;    // YYYY-MM-DD
  
  // Financial Fields
  receivableRent?: number;  // 本年应收租金
  receivedRent?: number;    // 本年实收租金
  arrearsStatus?: boolean;  // 是否欠费
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Asset filter for search and table operations
 */
export interface AssetFilter {
  type?: AssetType;
  zone?: Zone;
  status?: AssetStatus;
  minArea?: number;
  maxArea?: number;
  floorLevel?: number;
}

// ==================== Pricing Management ====================

/**
 * Asset category for pricing
 */
export enum PricingCategory {
  FACTORY_1F = 'factory_1f',
  FACTORY_2F = 'factory_2f',
  FACTORY_3F = 'factory_3f',
  DORM = 'dorm',
  RETAIL = 'retail'
}

/**
 * Base rate configuration
 */
export interface BaseRate {
  id: string;
  category: PricingCategory;
  categoryLabel: string;      // Display name: "Factory 1F", "Factory 2F", etc.
  unit: string;               // "sqm/month" or "room/month"
  baseRentPrice: number;      // Base rent per unit (¥)
  baseMgmtPrice: number;      // Base management fee per unit (¥)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Discount rule for a specific time period
 */
export interface DiscountStage {
  id: string;
  duration: number;           // Duration in months
  rentDiscount: number;       // 0-100 (percentage discount)
  mgmtDiscount: number;       // 0-100 (percentage discount)
  order: number;              // Stage sequence number
}

/**
 * Pricing policy with time-based stages
 */
export interface PricingPolicy {
  id: string;
  policyName: string;         // e.g., "3-Year Free, 2-Year Half"
  targetIndustry?: string;    // Optional industry filter
  description?: string;
  stages: DiscountStage[];    // Ordered list of discount stages
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Policy rule builder form data
 */
export interface PolicyRuleForm {
  policyName: string;
  targetIndustry?: string;
  description?: string;
  stages: Omit<DiscountStage, 'id'>[];
}

// ==================== Tenant & Lease Management ====================

/**
 * Tenant type
 */
export enum TenantType {
  ENTERPRISE = 'enterprise',
  PERSONAL = 'personal'
}

/**
 * Tenant information
 */
export interface Tenant {
  id: string;
  tenantName: string;
  type: TenantType;
  industry?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  businessLicense?: string;   // For enterprise tenants
  idCard?: string;            // For personal tenants
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Lease contract status
 */
export enum LeaseStatus {
  DRAFT = 'draft',           // 草稿
  ACTIVE = 'active',         // 生效中
  EXPIRED = 'expired',       // 已过期
  TERMINATED = 'terminated'  // 已终止
}

/**
 * Payment schedule item
 */
export interface PaymentScheduleItem {
  monthStart: number;        // Starting month (1-based)
  monthEnd: number;          // Ending month (inclusive)
  rentAmount: number;        // Monthly rent (¥)
  mgmtAmount: number;        // Monthly management fee (¥)
  totalAmount: number;       // Total monthly payment (¥)
  discount: string;          // Discount description
}

/**
 * Lease contract with pricing calculation
 */
export interface LeaseContract {
  id: string;
  contractNumber: string;    // Auto-generated contract number
  assetId: string;
  asset?: Asset;             // Populated asset details
  tenantId: string;
  tenant?: Tenant;           // Populated tenant details
  
  // Lease period
  leaseStartDate: Date;
  leaseEndDate: Date;
  decorationDays: number;    // Decoration period before billing
  billingStartDate: Date;    // Auto-calculated
  
  // Pricing
  policyId?: string;
  policy?: PricingPolicy;    // Applied pricing policy
  baseRentPrice: number;     // Base rent rate at contract time
  baseMgmtPrice: number;     // Base mgmt rate at contract time
  
  // Calculated totals
  totalRent: number;         // Total rent over lease period
  totalMgmt: number;         // Total mgmt fee over lease period
  grandTotal: number;        // Total contract value
  
  // Payment schedule
  paymentSchedule: PaymentScheduleItem[];
  
  status: LeaseStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Add tenant form data
 */
export interface AddTenantFormData {
  // Step 1: Asset selection
  assetId: string;
  
  // Step 2: Tenant info
  tenantName: string;
  tenantType: TenantType;
  industry?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  
  // Step 3: Lease details
  leaseStartDate: Date;
  leaseEndDate: Date;
  decorationDays: number;
  
  // Step 4: Pricing
  policyId?: string;
  notes?: string;
}

// ==================== Calculation Results ====================

/**
 * Rent calculation result
 */
export interface RentCalculation {
  asset: Asset;
  policy?: PricingPolicy;
  baseRentPrice: number;
  baseMgmtPrice: number;
  totalMonths: number;
  billingStartDate: Date;
  paymentSchedule: PaymentScheduleItem[];
  totalRent: number;
  totalMgmt: number;
  grandTotal: number;
  averageMonthlyPayment: number;
}

/**
 * Calculation parameters
 */
export interface CalculationParams {
  asset: Asset;
  leaseStartDate: Date;
  leaseEndDate: Date;
  decorationDays: number;
  policyId?: string;
}

// ==================== API Response Types ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
