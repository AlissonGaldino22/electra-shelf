import { useEffect, useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getMovements, getProducts } from '@/lib/storage';
import { Movement } from '@/types/product';

export default function History() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [filteredMovements, setFilteredMovements] = useState<Movement[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResponsible, setFilterResponsible] = useState('');

  useEffect(() => {
    loadMovements();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [movements, filterType, searchTerm, filterResponsible]);

  const loadMovements = () => {
    const data = getMovements();
    setMovements(data);
  };

  const applyFilters = () => {
    let filtered = [...movements];

    if (filterType !== 'all') {
      filtered = filtered.filter((m) => m.type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (m) =>
          m.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterResponsible) {
      filtered = filtered.filter((m) =>
        m.responsible.toLowerCase().includes(filterResponsible.toLowerCase())
      );
    }

    setFilteredMovements(filtered);
  };

  const getMovementBadge = (type: Movement['type']) => {
    return type === 'entrada' ? (
      <Badge className="bg-success text-success-foreground">Entrada</Badge>
    ) : (
      <Badge variant="secondary">Saída</Badge>
    );
  };

  const getUniqueResponsibles = () => {
    const responsibles = movements.map((m) => m.responsible);
    return Array.from(new Set(responsibles));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Histórico</h1>
        <p className="text-muted-foreground mt-1">
          Visualize todas as movimentações registradas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Tipo de Movimentação</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="entrada">Entradas</SelectItem>
                  <SelectItem value="saida">Saídas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Buscar Produto/Motivo</Label>
              <Input
                placeholder="Digite para buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Responsável</Label>
              <Input
                placeholder="Nome do responsável..."
                value={filterResponsible}
                onChange={(e) => setFilterResponsible(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Movimentações ({filteredMovements.length})
            </CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          {filteredMovements.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead className="text-center">Quantidade</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Observações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell className="text-sm">
                      {new Date(movement.createdAt).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell className="font-medium">
                      {movement.productName}
                    </TableCell>
                    <TableCell>{getMovementBadge(movement.type)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{movement.reason}</Badge>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {movement.quantity}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {movement.responsible}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                      {movement.notes || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Nenhuma movimentação encontrada com os filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
