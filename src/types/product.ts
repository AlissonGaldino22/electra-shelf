export type ProductCategory = 
  | 'smartphone' 
  | 'notebook' 
  | 'smart-tv' 
  | 'tablet' 
  | 'acessorio' 
  | 'outro';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  sku: string;
  quantity: number;
  minQuantity: number;
  purchasePrice: number;
  salePrice: number;
  specifications: string;
  createdAt: string;
  updatedAt: string;
}

export type MovementType = 'entrada' | 'saida';
export type MovementReason = 
  | 'compra' 
  | 'reposicao' 
  | 'venda' 
  | 'defeito' 
  | 'emprestimo' 
  | 'devolucao' 
  | 'outro';

export interface Movement {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  reason: MovementReason;
  quantity: number;
  responsible: string;
  notes?: string;
  createdAt: string;
}

export interface StockAlert {
  product: Product;
  currentQuantity: number;
  minQuantity: number;
}
