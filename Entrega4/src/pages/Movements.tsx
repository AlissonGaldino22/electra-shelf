import { useEffect, useState } from 'react';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getProducts, addMovement, getMovements } from '@/lib/storage';
import { Product, MovementType, MovementReason } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

const movementReasons: { value: MovementReason; label: string }[] = [
  { value: 'compra', label: 'Compra' },
  { value: 'reposicao', label: 'Reposição' },
  { value: 'venda', label: 'Venda' },
  { value: 'defeito', label: 'Defeito' },
  { value: 'emprestimo', label: 'Empréstimo' },
  { value: 'devolucao', label: 'Devolução' },
  { value: 'outro', label: 'Outro' },
];

export default function Movements() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [movementType, setMovementType] = useState<MovementType>('entrada');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    productId: '',
    quantity: 1,
    reason: 'compra' as MovementReason,
    responsible: '',
    notes: '',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const data = getProducts();
    setProducts(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const product = products.find((p) => p.id === formData.productId);
    if (!product) {
      toast({
        title: 'Erro',
        description: 'Produto não encontrado.',
        variant: 'destructive',
      });
      return;
    }

    if (movementType === 'saida' && formData.quantity > product.quantity) {
      toast({
        title: 'Quantidade insuficiente',
        description: `Estoque atual: ${product.quantity} unidade(s)`,
        variant: 'destructive',
      });
      return;
    }

    addMovement({
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      type: movementType,
      reason: formData.reason,
      quantity: formData.quantity,
      responsible: formData.responsible,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
    });

    toast({
      title: 'Movimentação registrada',
      description: `${movementType === 'entrada' ? 'Entrada' : 'Saída'} de ${
        formData.quantity
      } unidade(s) registrada com sucesso.`,
    });

    resetForm();
    setIsDialogOpen(false);
    loadProducts();
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      quantity: 1,
      reason: 'compra',
      responsible: '',
      notes: '',
    });
    setMovementType('entrada');
  };

  const getRecentMovements = () => {
    return getMovements().slice(0, 10);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Movimentações</h1>
          <p className="text-muted-foreground mt-1">
            Registre entradas e saídas de produtos
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-success/20 bg-gradient-to-br from-success/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <TrendingUp className="h-5 w-5" />
              Registrar Entrada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Adicione produtos ao estoque através de compra, reposição ou
              devolução.
            </p>
            <Dialog open={isDialogOpen && movementType === 'entrada'} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="w-full bg-success hover:bg-success/90 text-success-foreground"
                  onClick={() => {
                    resetForm();
                    setMovementType('entrada');
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Entrada
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Registrar Entrada de Produto</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product">Produto *</Label>
                    <Select
                      value={formData.productId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, productId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} ({product.sku}) - Estoque: {product.quantity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantidade *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        required
                        value={formData.quantity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            quantity: parseInt(e.target.value) || 1,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason">Motivo *</Label>
                      <Select
                        value={formData.reason}
                        onValueChange={(value: MovementReason) =>
                          setFormData({ ...formData, reason: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {movementReasons
                            .filter((r) =>
                              ['compra', 'reposicao', 'devolucao', 'outro'].includes(
                                r.value
                              )
                            )
                            .map((reason) => (
                              <SelectItem key={reason.value} value={reason.value}>
                                {reason.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="responsible">Responsável *</Label>
                    <Input
                      id="responsible"
                      required
                      value={formData.responsible}
                      onChange={(e) =>
                        setFormData({ ...formData, responsible: e.target.value })
                      }
                      placeholder="Nome do responsável"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea
                      id="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Informações adicionais sobre a movimentação"
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-success hover:bg-success/90">
                      Registrar Entrada
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Registrar Saída
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Remova produtos do estoque por venda, defeito ou empréstimo.
            </p>
            <Dialog open={isDialogOpen && movementType === 'saida'} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    resetForm();
                    setMovementType('saida');
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Saída
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Registrar Saída de Produto</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product">Produto *</Label>
                    <Select
                      value={formData.productId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, productId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} ({product.sku}) - Estoque: {product.quantity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantidade *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        required
                        value={formData.quantity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            quantity: parseInt(e.target.value) || 1,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason">Motivo *</Label>
                      <Select
                        value={formData.reason}
                        onValueChange={(value: MovementReason) =>
                          setFormData({ ...formData, reason: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {movementReasons
                            .filter((r) =>
                              ['venda', 'defeito', 'emprestimo', 'outro'].includes(
                                r.value
                              )
                            )
                            .map((reason) => (
                              <SelectItem key={reason.value} value={reason.value}>
                                {reason.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="responsible">Responsável *</Label>
                    <Input
                      id="responsible"
                      required
                      value={formData.responsible}
                      onChange={(e) =>
                        setFormData({ ...formData, responsible: e.target.value })
                      }
                      placeholder="Nome do responsável"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea
                      id="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Informações adicionais sobre a movimentação"
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" variant="secondary">
                      Registrar Saída
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Movimentações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getRecentMovements().map((movement) => (
              <div
                key={movement.id}
                className="flex items-start justify-between border-b pb-3 last:border-0"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    {movement.type === 'entrada' ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    )}
                    <p className="font-medium">{movement.productName}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {movement.type === 'entrada' ? 'Entrada' : 'Saída'} de{' '}
                    {movement.quantity} unidade(s) • {movement.reason}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Por {movement.responsible} •{' '}
                    {new Date(movement.createdAt).toLocaleString('pt-BR')}
                  </p>
                  {movement.notes && (
                    <p className="text-xs text-muted-foreground italic">
                      "{movement.notes}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
