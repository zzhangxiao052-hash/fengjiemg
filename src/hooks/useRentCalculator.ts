/**
 * useRentCalculator Hook
 * Complex pricing calculation logic for lease contracts
 * Handles: Floor Price x Area x Policy Discount
 */

import { useMemo } from 'react';
import { useAssetStore } from '../stores/assetStore';
import {
  Asset,
  PricingPolicy,
  PricingCategory,
  RentCalculation,
  PaymentScheduleItem,
  CalculationParams
} from '../types/asset';

/**
 * Get pricing category based on asset type and floor level
 */
const getPricingCategory = (asset: Asset): PricingCategory => {
  if (asset.type === 'factory') {
    if (asset.floorLevel === 1) return PricingCategory.FACTORY_1F;
    if (asset.floorLevel === 2) return PricingCategory.FACTORY_2F;
    return PricingCategory.FACTORY_3F;
  }
  if (asset.type === 'dorm') return PricingCategory.DORM;
  return PricingCategory.RETAIL;
};

/**
 * Calculate billing start date after decoration period
 */
const calculateBillingStartDate = (leaseStartDate: Date, decorationDays: number): Date => {
  const billingStart = new Date(leaseStartDate);
  billingStart.setDate(billingStart.getDate() + decorationDays);
  return billingStart;
};

/**
 * Calculate total months between two dates
 */
const calculateTotalMonths = (startDate: Date, endDate: Date): number => {
  const years = endDate.getFullYear() - startDate.getFullYear();
  const months = endDate.getMonth() - startDate.getMonth();
  return years * 12 + months + 1; // +1 to include both start and end months
};

/**
 * Apply discount to a price
 */
const applyDiscount = (price: number, discountPercent: number): number => {
  return price * (1 - discountPercent / 100);
};

/**
 * Generate payment schedule based on policy stages
 */
const generatePaymentSchedule = (
  totalMonths: number,
  baseRentPrice: number,
  baseMgmtPrice: number,
  area: number,
  policy?: PricingPolicy
): PaymentScheduleItem[] => {
  const schedule: PaymentScheduleItem[] = [];
  
  if (!policy || policy.stages.length === 0) {
    // No policy: standard pricing for all months
    const rentAmount = baseRentPrice * area;
    const mgmtAmount = baseMgmtPrice * area;
    
    schedule.push({
      monthStart: 1,
      monthEnd: totalMonths,
      rentAmount,
      mgmtAmount,
      totalAmount: rentAmount + mgmtAmount,
      discount: '标准基础费率'
    });
    
    return schedule;
  }
  
  // Apply policy stages
  const sortedStages = [...policy.stages].sort((a, b) => a.order - b.order);
  let currentMonth = 1;
  
  for (const stage of sortedStages) {
    if (currentMonth > totalMonths) break;
    
    const stageEndMonth = Math.min(currentMonth + stage.duration - 1, totalMonths);
    
    const rentAmount = applyDiscount(baseRentPrice * area, stage.rentDiscount);
    const mgmtAmount = applyDiscount(baseMgmtPrice * area, stage.mgmtDiscount);
    
    let discountDesc = '';
    if (stage.rentDiscount > 0 || stage.mgmtDiscount > 0) {
      const rentDesc = stage.rentDiscount > 0 ? `租金减免 ${stage.rentDiscount}%` : '';
      const mgmtDesc = stage.mgmtDiscount > 0 ? `物管费减免 ${stage.mgmtDiscount}%` : '';
      discountDesc = [rentDesc, mgmtDesc].filter(Boolean).join(', ');
    } else {
      discountDesc = '标准基础费率';
    }
    
    schedule.push({
      monthStart: currentMonth,
      monthEnd: stageEndMonth,
      rentAmount,
      mgmtAmount,
      totalAmount: rentAmount + mgmtAmount,
      discount: discountDesc
    });
    
    currentMonth = stageEndMonth + 1;
  }
  
  // If policy stages don't cover all months, add remaining months at standard rate
  if (currentMonth <= totalMonths) {
    const rentAmount = baseRentPrice * area;
    const mgmtAmount = baseMgmtPrice * area;
    
    schedule.push({
      monthStart: currentMonth,
      monthEnd: totalMonths,
      rentAmount,
      mgmtAmount,
      totalAmount: rentAmount + mgmtAmount,
      discount: '标准基础费率'
    });
  }
  
  return schedule;
};

/**
 * Calculate totals from payment schedule
 */
const calculateTotals = (schedule: PaymentScheduleItem[]) => {
  let totalRent = 0;
  let totalMgmt = 0;
  
  for (const item of schedule) {
    const monthsInStage = item.monthEnd - item.monthStart + 1;
    totalRent += item.rentAmount * monthsInStage;
    totalMgmt += item.mgmtAmount * monthsInStage;
  }
  
  return {
    totalRent,
    totalMgmt,
    grandTotal: totalRent + totalMgmt
  };
};

/**
 * Main hook for rent calculation
 */
export const useRentCalculator = (params?: CalculationParams): {
  calculate: (calcParams: CalculationParams) => RentCalculation | null;
  result: RentCalculation | null;
} => {
  const { getBaseRateByCategory, getPolicyById } = useAssetStore();
  
  const calculate = (calcParams: CalculationParams): RentCalculation | null => {
    const { asset, leaseStartDate, leaseEndDate, decorationDays, policyId } = calcParams;
    
    // Get base rate for this asset type
    const category = getPricingCategory(asset);
    const baseRate = getBaseRateByCategory(category);
    
    if (!baseRate) {
      console.error(`No base rate found for category: ${category}`);
      return null;
    }
    
    // Get pricing policy if specified
    const policy = policyId ? getPolicyById(policyId) : undefined;
    
    // Calculate billing start date
    const billingStartDate = calculateBillingStartDate(leaseStartDate, decorationDays);
    
    // Calculate total billing months
    const totalMonths = calculateTotalMonths(billingStartDate, leaseEndDate);
    
    // Generate payment schedule
    const paymentSchedule = generatePaymentSchedule(
      totalMonths,
      baseRate.baseRentPrice,
      baseRate.baseMgmtPrice,
      asset.area,
      policy
    );
    
    // Calculate totals
    const { totalRent, totalMgmt, grandTotal } = calculateTotals(paymentSchedule);
    
    return {
      asset,
      policy,
      baseRentPrice: baseRate.baseRentPrice,
      baseMgmtPrice: baseRate.baseMgmtPrice,
      totalMonths,
      billingStartDate,
      paymentSchedule,
      totalRent,
      totalMgmt,
      grandTotal,
      averageMonthlyPayment: grandTotal / totalMonths
    };
  };
  
  // Auto-calculate if params provided
  const result = useMemo(() => {
    if (!params) return null;
    return calculate(params);
  }, [params?.asset, params?.leaseStartDate, params?.leaseEndDate, params?.decorationDays, params?.policyId]);
  
  return { calculate, result };
};

/**
 * Helper hook to get pricing summary text
 */
export const usePricingSummary = (calculation: RentCalculation | null): string => {
  if (!calculation) return 'No calculation available';
  
  const { paymentSchedule, grandTotal } = calculation;
  
  if (paymentSchedule.length === 0) return 'Invalid payment schedule';
  
  if (paymentSchedule.length === 1) {
    const stage = paymentSchedule[0];
    return `¥${stage.rentAmount.toFixed(2)} Rent + ¥${stage.mgmtAmount.toFixed(2)} Mgmt Fee per month. Total: ¥${grandTotal.toFixed(2)}`;
  }
  
  // Multiple stages
  const summaries = paymentSchedule.map((stage) => {
    const monthRange = stage.monthStart === stage.monthEnd 
      ? `Month ${stage.monthStart}` 
      : `Months ${stage.monthStart}-${stage.monthEnd}`;
    return `${monthRange}: ¥${stage.rentAmount.toFixed(2)} Rent + ¥${stage.mgmtAmount.toFixed(2)} Mgmt (${stage.discount})`;
  });
  
  return summaries.join('. ') + `. Total: ¥${grandTotal.toFixed(2)}`;
};

/**
 * Format currency helper
 */
export const formatCurrency = (amount: number): string => {
  return `¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Format date helper
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
};
