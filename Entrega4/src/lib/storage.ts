import { Product, Movement } from '@/types/product';

const STORAGE_KEYS = {
  PRODUCTS: 'stock_products',
  MOVEMENTS: 'stock_movements',
};

// Products
export const getProducts = (): Product[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return data ? JSON.parse(data) : [];
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const addProduct = (product: Product) => {
  const products = getProducts();
  products.push(product);
  saveProducts(products);
};

export const updateProduct = (id: string, updates: Partial<Product>) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
    saveProducts(products);
  }
};

export const deleteProduct = (id: string) => {
  const products = getProducts().filter(p => p.id !== id);
  saveProducts(products);
};

// Movements
export const getMovements = (): Movement[] => {
  const data = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
  return data ? JSON.parse(data) : [];
};

export const saveMovements = (movements: Movement[]) => {
  localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(movements));
};

export const addMovement = (movement: Movement) => {
  const movements = getMovements();
  movements.unshift(movement);
  saveMovements(movements);
  
  // Update product quantity
  const products = getProducts();
  const product = products.find(p => p.id === movement.productId);
  if (product) {
    const newQuantity = movement.type === 'entrada' 
      ? product.quantity + movement.quantity 
      : product.quantity - movement.quantity;
    updateProduct(product.id, { quantity: Math.max(0, newQuantity) });
  }
};

export const getStockAlerts = () => {
  const products = getProducts();
  return products.filter(p => p.quantity <= p.minQuantity);
};

// Initialize with sample data if empty
export const initializeSampleData = () => {
  if (getProducts().length === 0) {
    const sampleProducts: Product[] = [
      {
        id: '1',
        name: 'iPhone 14 Pro',
        category: 'smartphone',
        sku: 'IPH14P-256-BLK',
        quantity: 8,
        minQuantity: 5,
        purchasePrice: 5500,
        salePrice: 6999,
        specifications: '256GB, Preto, 5G, Câmera 48MP',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'MacBook Air M2',
        category: 'notebook',
        sku: 'MBA-M2-512-SLV',
        quantity: 3,
        minQuantity: 3,
        purchasePrice: 8500,
        salePrice: 10499,
        specifications: '512GB SSD, 16GB RAM, Prata',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Samsung Smart TV 65"',
        category: 'smart-tv',
        sku: 'SSTV-65-4K-NEO',
        quantity: 2,
        minQuantity: 4,
        purchasePrice: 3200,
        salePrice: 4299,
        specifications: '65", 4K, Neo QLED, Smart TV',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'AirPods Pro 2',
        category: 'acessorio',
        sku: 'APP2-WHT-USB',
        quantity: 15,
        minQuantity: 10,
        purchasePrice: 1200,
        salePrice: 1699,
        specifications: 'Cancelamento de ruído, USB-C',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    saveProducts(sampleProducts);

    const sampleMovements: Movement[] = [
      {
        id: '1',
        productId: '1',
        productName: 'iPhone 14 Pro',
        type: 'entrada',
        reason: 'compra',
        quantity: 10,
        responsible: 'João Silva',
        notes: 'Lote de reposição',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        productId: '1',
        productName: 'iPhone 14 Pro',
        type: 'saida',
        reason: 'venda',
        quantity: 2,
        responsible: 'Maria Santos',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    saveMovements(sampleMovements);
  }
};
