import { FormEvent, useEffect, useMemo, useState } from 'react';
import { api } from '../../services/api';
import type { InventoryItem, InventoryMovement, InventoryMovementType } from '../../types';

const movementLabels: Record<InventoryMovementType, string> = { entry: 'Entrada', exit: 'Salida', adjustment: 'Ajuste' };
const quantityLabel = (value: number, unit: string) => `${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 }).format(value)} ${unit}`;

export function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [movementType, setMovementType] = useState<InventoryMovementType>('entry');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function loadData() {
    try {
      const [itemList, movementList] = await Promise.all([api.inventory.listItems(), api.inventory.listMovements()]);
      setItems(itemList);
      setMovements(movementList);
      setError('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible cargar el inventario');
    } finally { setLoading(false); }
  }

  useEffect(() => { void loadData(); }, []);

  async function createItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await api.inventory.createItem({
        name: String(form.get('name')), description: String(form.get('description')) || undefined,
        category: String(form.get('category')), unit: String(form.get('unit')),
        minimumQuantity: Number(form.get('minimumQuantity') || 0),
      });
      setShowItemForm(false);
      setSuccess('Producto registrado. Registra una entrada para cargar existencias.');
      await loadData();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No fue posible registrar el producto'); }
  }

  async function registerMovement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await api.inventory.registerMovement({
        itemId: String(form.get('itemId')), type: movementType,
        quantity: Number(form.get('quantity')), reason: String(form.get('reason')),
      });
      setShowMovementForm(false);
      setSuccess('Movimiento registrado correctamente.');
      await loadData();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No fue posible registrar el movimiento'); }
  }

  const lowStockItems = useMemo(() => items.filter(item => item.quantity <= item.minimumQuantity), [items]);
  const itemNames = new Map(items.map(item => [item.id, item.name]));
  const selectedItem = items.find(item => item.id === selectedItemId);

  return <section className="content-card">
    <div className="section-heading">
      <div><h2>Inventario y movimientos</h2><p>{items.length} productos · {movements.length} movimientos recientes</p></div>
      <div className="inventory-actions">
        <button className="secondary-button" onClick={() => setShowMovementForm(!showMovementForm)} disabled={!items.length}>Registrar movimiento</button>
        <button className="primary-button" onClick={() => setShowItemForm(!showItemForm)}>+ Nuevo producto</button>
      </div>
    </div>
    {error && <div className="error-banner" role="alert">{error}</div>}
    {success && <div className="success-banner" role="status">{success}<button className="text-button" onClick={() => setSuccess('')}>Cerrar</button></div>}
    {!!lowStockItems.length && <div className="info-banner">{lowStockItems.length} productos están en el stock mínimo o por debajo.</div>}
    {showItemForm && <form className="data-form" onSubmit={createItem}>
      <label>Nombre<input name="name" required minLength={2} maxLength={160} /></label>
      <label>Categoría<select name="category"><option>Medicamento</option><option>Insumo médico</option><option>Alimento</option><option>Higiene</option><option>Otro</option></select></label>
      <label>Unidad<input name="unit" required maxLength={40} placeholder="unidad, caja, ml, kg..." /></label>
      <label>Stock mínimo<input name="minimumQuantity" type="number" min="0" step="0.01" defaultValue="0" required /></label>
      <label className="full-field">Descripción<textarea name="description" rows={2} /></label>
      <div className="form-actions"><button className="primary-button" type="submit">Guardar producto</button><button className="secondary-button" type="button" onClick={() => setShowItemForm(false)}>Cancelar</button></div>
    </form>}
    {showMovementForm && <form className="data-form" onSubmit={registerMovement}>
      <label>Producto<select name="itemId" required value={selectedItemId} onChange={event => setSelectedItemId(event.target.value)}><option value="">Selecciona un producto</option>{items.map(item => <option key={item.id} value={item.id}>{item.name} · {quantityLabel(item.quantity, item.unit)}</option>)}</select></label>
      <label>Tipo<select value={movementType} onChange={event => setMovementType(event.target.value as InventoryMovementType)}><option value="entry">Entrada</option><option value="exit">Salida</option><option value="adjustment">Ajuste</option></select></label>
      <label>{movementType === 'adjustment' ? 'Existencia final contada' : 'Cantidad'}<input name="quantity" type="number" min={movementType === 'adjustment' ? 0 : 0.01} step="0.01" required /></label>
      <label>Motivo<input name="reason" required minLength={3} maxLength={500} placeholder="Compra, uso clínico, vencimiento..." /></label>
      {selectedItem && <p className="full-field inventory-current-stock">Existencia actual: <strong>{quantityLabel(selectedItem.quantity, selectedItem.unit)}</strong></p>}
      {movementType === 'adjustment' && <p className="full-field inventory-current-stock">El ajuste reemplaza la existencia actual por la cantidad contada.</p>}
      <div className="form-actions"><button className="primary-button" type="submit">Guardar movimiento</button><button className="secondary-button" type="button" onClick={() => setShowMovementForm(false)}>Cancelar</button></div>
    </form>}
    <div className="inventory-summary">
      <article className="stat-card"><span>Productos activos</span><strong>{items.length}</strong></article>
      <article className="stat-card"><span>Stock bajo</span><strong>{lowStockItems.length}</strong></article>
      <article className="stat-card"><span>Movimientos recientes</span><strong>{movements.length}</strong></article>
    </div>
    <div className="section-heading inventory-subheading"><div><h2>Existencias</h2><p>Productos que requieren reposición aparecen resaltados</p></div></div>
    {loading ? <p className="table-empty">Cargando inventario...</p> : <div className="table-wrap"><table><thead><tr><th>Producto</th><th>Categoría</th><th>Existencia</th><th>Stock mínimo</th><th>Estado</th></tr></thead><tbody>
      {items.map(item => <tr key={item.id}><td><strong>{item.name}</strong>{item.description && <small className="table-secondary">{item.description}</small>}</td><td>{item.category}</td><td>{quantityLabel(item.quantity, item.unit)}</td><td>{quantityLabel(item.minimumQuantity, item.unit)}</td><td><span className={item.quantity <= item.minimumQuantity ? 'stock-status low' : 'stock-status healthy'}>{item.quantity <= item.minimumQuantity ? 'Stock bajo' : 'Disponible'}</span></td></tr>)}
    </tbody></table>{!items.length && <p className="table-empty">Todavía no hay productos registrados.</p>}</div>}
    <div className="section-heading inventory-subheading"><div><h2>Historial de movimientos</h2><p>Últimos 200 movimientos</p></div></div>
    <div className="table-wrap"><table><thead><tr><th>Fecha</th><th>Producto</th><th>Tipo</th><th>Cantidad</th><th>Anterior</th><th>Nueva</th><th>Motivo</th></tr></thead><tbody>
      {movements.map(movement => <tr key={movement.id}><td>{new Date(movement.createdAt).toLocaleString('es-CO')}</td><td>{itemNames.get(movement.itemId) ?? 'Producto'}</td><td>{movementLabels[movement.type]}</td><td>{movement.quantity}</td><td>{movement.previousQuantity}</td><td>{movement.newQuantity}</td><td>{movement.reason}</td></tr>)}
    </tbody></table>{!loading && !movements.length && <p className="table-empty">No hay movimientos registrados.</p>}</div>
  </section>;
}
