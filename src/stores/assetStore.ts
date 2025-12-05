/**
 * Asset Store - Zustand State Management
 * Manages assets, pricing policies, and lease contracts
 */

import { create } from 'zustand';
import {
  Asset,
  AssetStatus,
  AssetType,
  Zone,
  PricingPolicy,
  BaseRate,
  PricingCategory,
  LeaseContract,
  Tenant,
  TenantType,
  LeaseStatus
} from '../types/asset';

// ==================== Mock Data Generators ====================

/**
 * Generate mock base rates
 */
const generateMockBaseRates = (): BaseRate[] => {
  return [
    {
      id: 'rate-1',
      category: PricingCategory.FACTORY_1F,
      categoryLabel: '标准厂房一层',
      unit: '元/㎡/月',
      baseRentPrice: 5.0,
      baseMgmtPrice: 1.0,
      baseDepositPrice: 15.0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'rate-2',
      category: PricingCategory.FACTORY_2F,
      categoryLabel: '标准厂房二层',
      unit: '元/㎡/月',
      baseRentPrice: 4.0,
      baseMgmtPrice: 1.0,
      baseDepositPrice: 15.0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'rate-3',
      category: PricingCategory.FACTORY_3F,
      categoryLabel: '标准厂房三四楼',
      unit: '元/㎡/月',
      baseRentPrice: 3.0,
      baseMgmtPrice: 1.0,
      baseDepositPrice: 15.0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'rate-4',
      category: PricingCategory.DORM_LOW_RENT,
      categoryLabel: '廉租房',
      unit: '元/㎡/月',
      baseRentPrice: 2.0,
      baseMgmtPrice: 1.0,
      baseDepositPrice: 500.0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'rate-5',
      category: PricingCategory.DORM_LOGISTICS,
      categoryLabel: '后勤服务中心宿舍及科研试验基地宿舍',
      unit: '元/间/月',
      baseRentPrice: 200.0,
      baseMgmtPrice: 100.0,
      baseDepositPrice: 1000.0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'rate-6',
      category: PricingCategory.RETAIL,
      categoryLabel: '配套门市',
      unit: '元/㎡/月',
      baseRentPrice: 10.0,
      baseMgmtPrice: 10.0,
      baseDepositPrice: 10.0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
};

/**
 * Generate mock pricing policies
 * Updated based on business requirements (2025-12-03)
 */
const generateMockPolicies = (): PricingPolicy[] => {
  return [
    {
      id: 'policy-1',
      policyName: '眼镜产业专项扶持 (Eyewear Special)',
      targetIndustry: 'Eyewear',
      description: '前3年免租，第4-5年租金减半 (3 Years Free, 2 Years Half)',
      stages: [
        {
          id: 'stage-1-1',
          duration: 36,
          rentDiscount: 100,  // 100% off Rent
          mgmtDiscount: 0,
          order: 1
        },
        {
          id: 'stage-1-2',
          duration: 24,
          rentDiscount: 50,   // 50% off Rent
          mgmtDiscount: 0,
          order: 2
        }
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'policy-2',
      policyName: '新签企业装修期优惠 (New Tenant Intro)',
      targetIndustry: 'All',
      description: '前3个月免租金、免物管费 (3 Months Rent & Mgmt Free)',
      stages: [
        {
          id: 'stage-2-1',
          duration: 3,
          rentDiscount: 100,  // Free Rent
          mgmtDiscount: 100,  // Free Mgmt
          order: 1
        }
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'policy-3',
      policyName: '疫情纾困政策 (Pandemic Relief)',
      targetIndustry: 'Non-Eyewear',
      description: '非眼镜企业减免3个月租金 (3 Months Rent Free for others)',
      stages: [
        {
          id: 'stage-3-1',
          duration: 3,
          rentDiscount: 100,  // Free Rent
          mgmtDiscount: 0,
          order: 1
        }
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'policy-4',
      policyName: '门市年度递增策略',
      targetIndustry: 'Retail',
      description: '第二年在第一年的租金基础上增加3%，以此递增没有上限',
      stages: [
        {
          id: 'stage-4-1',
          duration: 12,
          rentDiscount: 0,  // Standard rate for first year
          mgmtDiscount: 0,
          order: 1
        }
        // Note: 年度递增需要在计算器中特殊处理
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
};

/**
 * Generate mock assets
 */
const generateMockAssets = (): Asset[] => {
  const assets: Asset[] = [];
  const zones = [Zone.ZONE_A, Zone.ZONE_B, Zone.ZONE_C, Zone.ZONE_D];
  const statuses = [AssetStatus.VACANT, AssetStatus.LEASED, AssetStatus.DECORATION];
  
  let id = 1;

  // Generate Factory Assets
  zones.forEach((zone, zoneIndex) => {
    for (let building = 1; building <= 3; building++) {
      for (let floor = 1; floor <= 3; floor++) {
        for (let unit = 1; unit <= 2; unit++) {
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          const isLeased = status === AssetStatus.LEASED;
          assets.push({
            id: `asset-factory-${id}`,
            type: AssetType.FACTORY,
            zone,
            addressCode: `${String.fromCharCode(65 + zoneIndex)}${building}-${floor}${unit}`,
            floorLevel: floor,
            area: 500 + Math.floor(Math.random() * 1500),
            status,
            tenantId: isLeased ? `tenant-${id}` : undefined,
            tenantName: isLeased ? `企业${id}` : undefined,
            leaseStartDate: isLeased ? '2024-01-01' : undefined,
            leaseEndDate: isLeased ? '2025-12-31' : undefined,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          id++;
        }
      }
    }
  });

  // Generate Retail Assets
  zones.forEach((zone, zoneIndex) => {
    for (let unit = 1; unit <= 5; unit++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const isLeased = status === AssetStatus.LEASED;
      
      const area = 50 + Math.floor(Math.random() * 150);
      const marketPrice = 20 + Math.floor(Math.random() * 30); // 20-50 per sqm
      const monthlyRent = area * marketPrice;
      const receivableRent = isLeased ? monthlyRent * 12 : 0;
      // 20% chance of arrears if leased
      const hasArrears = isLeased && Math.random() < 0.2;
      const receivedRent = isLeased ? (hasArrears ? receivableRent * (0.5 + Math.random() * 0.4) : receivableRent) : 0;

      assets.push({
        id: `asset-retail-${id}`,
        type: AssetType.RETAIL,
        zone,
        addressCode: `S${String.fromCharCode(65 + zoneIndex)}-${unit}`,
        floorLevel: 1,
        area,
        status,
        tenantId: isLeased ? `tenant-${id}` : undefined,
        tenantName: isLeased ? `商户${id}` : undefined,
        leaseStartDate: isLeased ? '2024-03-01' : undefined,
        leaseEndDate: isLeased ? '2025-02-28' : undefined,
        receivableRent,
        receivedRent,
        arrearsStatus: hasArrears,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      id++;
    }
  });

  // Generate Dorm Assets
  const dormZones = [Zone.LOW_RENT, Zone.LOGISTICS, Zone.RESEARCH];
  dormZones.forEach((zone, zoneIndex) => {
    for (let floor = 1; floor <= 6; floor++) {
      for (let room = 1; room <= 10; room++) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const isLeased = status === AssetStatus.LEASED;
        
        const area = 35;
        let monthlyRent = 0;
        if (zone === Zone.LOW_RENT) {
          monthlyRent = area * 2;
        } else {
          monthlyRent = 200;
        }

        const receivableRent = isLeased ? monthlyRent * 12 : 0;
        // 15% chance of arrears if leased
        const hasArrears = isLeased && Math.random() < 0.15;
        const receivedRent = isLeased ? (hasArrears ? receivableRent * (0.5 + Math.random() * 0.4) : receivableRent) : 0;

        assets.push({
          id: `asset-dorm-${id}`,
          type: AssetType.DORM,
          zone,
          addressCode: `${zone === Zone.LOW_RENT ? 'L' : (zone === Zone.LOGISTICS ? 'S' : 'R')}-${floor}${room.toString().padStart(2, '0')}`,
          floorLevel: floor,
          area,
          status,
          tenantId: isLeased ? `tenant-${id}` : undefined,
          tenantName: isLeased ? `员工${id}` : undefined,
          leaseStartDate: isLeased ? '2024-06-01' : undefined,
          leaseEndDate: isLeased ? '2025-05-31' : undefined,
          receivableRent,
          receivedRent,
          arrearsStatus: hasArrears,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        id++;
      }
    }
  });
  
  return assets;
};

// ==================== Store Interface ====================

interface AssetStore {
  // State
  assets: Asset[];
  baseRates: BaseRate[];
  pricingPolicies: PricingPolicy[];
  leaseContracts: LeaseContract[];
  tenants: Tenant[];
  selectedAssets: string[];  // Cart for bulk operations
  
  // Asset actions
  setAssets: (assets: Asset[]) => void;
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, asset: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  getAssetById: (id: string) => Asset | undefined;
  getVacantAssets: () => Asset[];
  
  // Base rate actions
  setBaseRates: (rates: BaseRate[]) => void;
  addBaseRate: (rate: BaseRate) => void;
  updateBaseRate: (id: string, rate: Partial<BaseRate>) => void;
  deleteBaseRate: (id: string) => void;
  getBaseRateByCategory: (category: PricingCategory) => BaseRate | undefined;
  
  // Pricing policy actions
  setPricingPolicies: (policies: PricingPolicy[]) => void;
  addPricingPolicy: (policy: PricingPolicy) => void;
  updatePricingPolicy: (id: string, policy: Partial<PricingPolicy>) => void;
  deletePricingPolicy: (id: string) => void;
  getPolicyById: (id: string) => PricingPolicy | undefined;
  
  // Lease contract actions
  setLeaseContracts: (contracts: LeaseContract[]) => void;
  addLeaseContract: (contract: LeaseContract) => void;
  updateLeaseContract: (id: string, contract: Partial<LeaseContract>) => void;
  deleteLeaseContract: (id: string) => void;
  
  // Tenant actions
  setTenants: (tenants: Tenant[]) => void;
  addTenant: (tenant: Tenant) => void;
  updateTenant: (id: string, tenant: Partial<Tenant>) => void;
  
  // Cart actions
  addToCart: (assetId: string) => void;
  removeFromCart: (assetId: string) => void;
  clearCart: () => void;
  
  // Initialize with mock data
  initializeMockData: () => void;
}

// ==================== Store Implementation ====================

export const useAssetStore = create<AssetStore>((set, get) => ({
  // Initial state
  assets: [],
  baseRates: [],
  pricingPolicies: [],
  leaseContracts: [],
  tenants: [],
  selectedAssets: [],
  
  // Asset actions
  setAssets: (assets) => set({ assets }),
  
  addAsset: (asset) => set((state) => ({
    assets: [...state.assets, asset]
  })),
  
  updateAsset: (id, asset) => set((state) => ({
    assets: state.assets.map((a) => (a.id === id ? { ...a, ...asset, updatedAt: new Date() } : a))
  })),
  
  deleteAsset: (id) => set((state) => ({
    assets: state.assets.filter((a) => a.id !== id)
  })),
  
  getAssetById: (id) => {
    return get().assets.find((a) => a.id === id);
  },
  
  getVacantAssets: () => {
    return get().assets.filter((a) => a.status === AssetStatus.VACANT);
  },
  
  // Base rate actions
  setBaseRates: (rates) => set({ baseRates: rates }),
  
  addBaseRate: (rate) => set((state) => ({
    baseRates: [...state.baseRates, rate]
  })),
  
  updateBaseRate: (id, rate) => set((state) => ({
    baseRates: state.baseRates.map((r) => (r.id === id ? { ...r, ...rate, updatedAt: new Date() } : r))
  })),
  
  deleteBaseRate: (id) => set((state) => ({
    baseRates: state.baseRates.filter((r) => r.id !== id)
  })),
  
  getBaseRateByCategory: (category) => {
    return get().baseRates.find((r) => r.category === category);
  },
  
  // Pricing policy actions
  setPricingPolicies: (policies) => set({ pricingPolicies: policies }),
  
  addPricingPolicy: (policy) => set((state) => ({
    pricingPolicies: [...state.pricingPolicies, policy]
  })),
  
  updatePricingPolicy: (id, policy) => set((state) => ({
    pricingPolicies: state.pricingPolicies.map((p) => (p.id === id ? { ...p, ...policy, updatedAt: new Date() } : p))
  })),
  
  deletePricingPolicy: (id) => set((state) => ({
    pricingPolicies: state.pricingPolicies.filter((p) => p.id !== id)
  })),
  
  getPolicyById: (id) => {
    return get().pricingPolicies.find((p) => p.id === id);
  },
  
  // Lease contract actions
  setLeaseContracts: (contracts) => set({ leaseContracts: contracts }),
  
  addLeaseContract: (contract) => set((state) => ({
    leaseContracts: [...state.leaseContracts, contract]
  })),
  
  updateLeaseContract: (id, contract) => set((state) => ({
    leaseContracts: state.leaseContracts.map((c) => (c.id === id ? { ...c, ...contract, updatedAt: new Date() } : c))
  })),
  
  deleteLeaseContract: (id) => set((state) => ({
    leaseContracts: state.leaseContracts.filter((c) => c.id !== id)
  })),
  
  // Tenant actions
  setTenants: (tenants) => set({ tenants }),
  
  addTenant: (tenant) => set((state) => ({
    tenants: [...state.tenants, tenant]
  })),
  
  updateTenant: (id, tenant) => set((state) => ({
    tenants: state.tenants.map((t) => (t.id === id ? { ...t, ...tenant, updatedAt: new Date() } : t))
  })),
  
  // Cart actions
  addToCart: (assetId) => set((state) => ({
    selectedAssets: [...state.selectedAssets, assetId]
  })),
  
  removeFromCart: (assetId) => set((state) => ({
    selectedAssets: state.selectedAssets.filter((id) => id !== assetId)
  })),
  
  clearCart: () => set({ selectedAssets: [] }),
  
  // Initialize mock data
  initializeMockData: () => {
    set({
      assets: generateMockAssets(),
      baseRates: generateMockBaseRates(),
      pricingPolicies: generateMockPolicies(),
      leaseContracts: [],
      tenants: []
    });
  }
}));
