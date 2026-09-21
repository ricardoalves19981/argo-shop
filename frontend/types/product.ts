export type ProductDetailDto = {
  id: number;
  name: string;
  technicalName?: string | null;
  description: string;

  categoryId: number;
  categoryName: string;

  price: number;
  discountPrice?: number | null;

  stockQuantity: number;
  unit: string;

  mainImageUrl?: string | null;
  imageUrls: string[];

  brandName?: string | null;

  activeIngredient?: string | null;
  formulation?: string | null;
  targetPests?: string | null;
  suitableCrops?: string | null;
  usageInstruction?: string | null;
  preHarvestIntervalDays?: number | null;
  registrationCode?: string | null;

  createdAt: string;
  isActive: boolean;
};
