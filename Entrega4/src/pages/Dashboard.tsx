import { useEffect, useState } from 'react';
import { Package, TrendingDown, AlertTriangle, Activity } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getProducts, getMovements, getStockAlerts, initializeSampleData } from '@/lib/storage';
import { Movement } from '@/types/product';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    recentMovements: 0,
    totalValue: 0,
  });
  const [recentMovements, setRecentMovements] = useState<Movement[]>([]);
  const [alerts, setAlerts] = useState(0);

  useEffect(() => {
    initializeSampleData();
    loadStats();
  }, []);

  const loadStats = () => {
    const products = getProducts();
    const movements = getMovements();
    const stockAlerts = getStockAlerts();

    const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.salePrice), 0);
    const recentCount = movements.filter(m => {
      const moveDate = new Date(m.createdAt);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return moveDate > dayAgo;
    }).length;

    setStats({
      totalProducts: products.length,
      lowStock: stockAlerts.length,
      recentMovements: recentCount,
      totalValue,
    });
    setRecentMovements(movements.slice(0, 5));
    setAlerts(stockAlerts.length);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  const getMovementBadge = (type: Movement['type']) => {
    return type === 'entrada' ? (
      <Badge className="bg-success text-success-foreground">Entrada</Badge>
    ) : (
      <Badge variant="secondary">Saída</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral do estoque de equipamentos eletrônicos
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Produtos"
          value={stats.totalProducts}
          icon={Package}
          variant="default"
        />
        <StatsCard
          title="Alertas de Estoque"
          value={stats.lowStock}
          icon={AlertTriangle}
          variant={stats.lowStock > 0 ? 'warning' : 'default'}
          trend={stats.lowStock > 0 ? 'Requer atenção' : 'Tudo OK'}
        />
        <StatsCard
          title="Movimentações (24h)"
          value={stats.recentMovements}
          icon={Activity}
          variant="default"
        />
        <StatsCard
          title="Valor em Estoque"
          value={formatCurrency(stats.totalValue)}
          icon={TrendingDown}
          variant="success"
        />
      </div>

      {/* Alerts */}
      {alerts > 0 && (
        <Card className="border-warning bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Você tem {alerts} produto(s) com estoque abaixo do mínimo. 
              Acesse a página de <strong>Produtos</strong> para mais detalhes.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recent Movements */}
      <Card>
        <CardHeader>
          <CardTitle>Movimentações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentMovements.length > 0 ? (
            <div className="space-y-4">
              {recentMovements.map((movement) => (
                <div
                  key={movement.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{movement.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {movement.quantity} unidade(s) • {movement.reason} • {movement.responsible}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    {getMovementBadge(movement.type)}
                    <p className="text-xs text-muted-foreground">
                      {new Date(movement.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma movimentação registrada
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
