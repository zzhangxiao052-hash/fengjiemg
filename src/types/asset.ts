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
 * Policy benefit interface - 享有政策详情
 */
export interface PolicyBenefit {
  id: string;
  policyName: string;        // 政策名称
  startDate: string;         // 政策开始日期 YYYY-MM-DD
  endDate: string;           // 政策结束日期 YYYY-MM-DD
  reductionAmount: number;   // 减免金额（元）
  description?: string;      // 政策描述
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
  
  // Financial Fields - Rent
  receivableRent?: number;      // 本年应收租金
  receivedRent?: number;        // 本年实收租金
  policyReductionRent?: number; // 政策减免租金 (原 policyReductionAmount)

  // Financial Fields - Property Management Fee
  receivableProperty?: number;      // 本年应收物管费
  receivedProperty?: number;        // 本年实收物管费
  policyReductionProperty?: number; // 政策减免物管费

  // Financial Fields - Deposit
  receivableDeposit?: number;      // 本年应收保证金
  receivedDeposit?: number;        // 本年实收保证金
  policyReductionDeposit?: number; // 政策减免保证金

  arrearsStatus?: boolean;  // 是否欠费
  attachments?: AssetAttachment[];  // 附件列表
  policies?: PolicyBenefit[];  // 享有政策列表
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Asset attachment interface
 */
export interface AssetAttachment {
  id: string;
  name: string;
  type: 'contract' | 'agreement' | 'handover' | 'other';  // 合同、协议、交接单、其他
  size: string;        // e.g., "2.5 MB"
  uploadDate: string;  // YYYY-MM-DD
  url: string;         // File URL or path
  uploader?: string;   // 上传人
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
  FACTORY_3F = 'factory_3f_4f',
  DORM_LOW_RENT = 'dorm_low_rent',
  DORM_LOGISTICS = 'dorm_logistics_research',
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
  baseDepositPrice: number;   // Base deposit per unit (¥)
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
  baseDepositPrice: number;  // Base deposit rate at contract time
  
  // Calculated totals
  totalRent: number;         // Total rent over lease period
  totalMgmt: number;         // Total mgmt fee over lease period
  totalDeposit: number;      // Total deposit (one-time payment)
  grandTotal: number;        // Total contract value (rent + mgmt, excluding deposit)
  
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
  baseDepositPrice: number;
  totalMonths: number;
  billingStartDate: Date;
  paymentSchedule: PaymentScheduleItem[];
  totalRent: number;
  totalMgmt: number;
  totalDeposit: number;
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
