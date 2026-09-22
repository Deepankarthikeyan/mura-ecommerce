"use client";



import React, { useState, useCallback, ChangeEvent, useEffect, useMemo } from 'react';

import axios from 'axios';

import { toast } from 'react-toastify';

import { useUser } from '@/components/header/UserContext';

import OrderActionDialog, { OrderActionType } from '@/components/dialog/OrderActionDialog';

import OrderProductsDialog, { OrderProductItem } from '@/components/dialog/OrderProductsDialog';



const orderMenuItemStyle: React.CSSProperties = {

  display: 'block',

  width: '100%',

  textAlign: 'left',

  padding: '10px 14px',

  border: 'none',

  background: '#fff',

  cursor: 'pointer',

  fontSize: 14,

  color: '#1f2937',

};



interface DataRow {

  id: string;

  orderNo: string;

  customer: string;

  date: string;

  amount: string;

  items: OrderProductItem[];

  status: string;

  updatedAt: string;

}



interface OrderItem {

  id: string;

  title: string;

  price: number;

  quantity: number;

  image: string;

}



interface Order {

  _id: string;

  orderId?: string;

  userId: string;

  userEmail: string;

  billingInfo: {

    firstName: string;

    lastName: string;

    email: string;

    phone: string;

    street: string;

    city: string;

    state: string;

    zip: string;

    country: string;

  };

  items: OrderItem[];

  subtotal: number;

  discount: number;

  shippingCost: number;

  total: number;

  paymentMethod: string;

  status: string;

  createdAt: string;

  updatedAt: string;

}



interface OrderCardProps {

  row: DataRow;

  isMenuOpen: boolean;

  onToggleMenu: () => void;

  onAction: (action: OrderActionType) => void;

  onViewProducts: () => void;

}



const RETURN_WINDOW_MS = 24 * 60 * 60 * 1000;

function isWithinReturnWindow(updatedAt: string): boolean {
  const updated = new Date(updatedAt);
  if (Number.isNaN(updated.getTime())) return false;
  return Date.now() - updated.getTime() <= RETURN_WINDOW_MS;
}

function formatCustomerOrderStatusDisplay(raw: string): string {
  const normalized = raw.trim().toLowerCase();
  if (normalized === 'paid') return 'Order placed';
  if (raw === '—') return raw;
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function getOrderActionsForStatus(status: string, updatedAt: string): OrderActionType[] {
  const normalized = status.trim().toLowerCase();
  if (normalized === 'pending' || normalized === 'order accepted' || normalized === 'paid') {
    return ['cancel'];
  }
  if (normalized === 'disptached' || normalized === 'dispatched' || normalized === 'dispatch') {
    return [];
  }
  if (normalized === 'delivered') {
    return isWithinReturnWindow(updatedAt) ? ['return'] : [];
  }
  if (normalized === 'cancel approved' || normalized === 'cancelled' || normalized === 'canceled') {
    return ['refund'];
  }
  return [];
}



function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  if (left > 2) {
    pages.push('ellipsis');
  } else {
    for (let i = 2; i < left; i++) pages.push(i);
  }

  for (let i = left; i <= right; i++) pages.push(i);

  if (right < total - 1) {
    pages.push('ellipsis');
  } else {
    for (let i = right + 1; i < total; i++) pages.push(i);
  }

  if (total > 1) pages.push(total);

  return pages;
}



const OrderCard: React.FC<OrderCardProps> = ({ row, isMenuOpen, onToggleMenu, onAction, onViewProducts }) => {
  const actions = getOrderActionsForStatus(row.status, row.updatedAt);

  return (

  <article className="order-card-item">

    <div className="order-card-item__inner">

      <div className="order-card-item__header">

        <p className="order-card-item__order-no">{row.orderNo}</p>

        <div className="order-card-item__status-row order-action-menu" style={{ position: 'relative' }}>

          <span className="order-card-item__status-badge">{formatCustomerOrderStatusDisplay(row.status)}</span>

          {actions.length > 0 && (

          <button

            type="button"

            className="order-action-menu-trigger"

            onClick={(e) => {

              e.stopPropagation();

              onToggleMenu();

            }}

            aria-expanded={isMenuOpen}

            aria-haspopup="menu"

            aria-label="Order actions"

            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', lineHeight: 0 }}

          >

            <i className="fa-solid fa-ellipsis" style={{ fontSize: 18, color: '#525252' }} aria-hidden="true" />

          </button>

          )}

          {isMenuOpen && actions.length > 0 && (

            <div

              className="order-action-menu-panel"

              role="menu"

              style={{

                position: 'absolute',

                right: 0,

                top: '100%',

                marginTop: 6,

                background: '#fff',

                border: '1px solid #e5e7eb',

                borderRadius: 8,

                boxShadow: '0 8px 20px rgba(0,0,0,0.12)',

                zIndex: 100,

                minWidth: 128,

                overflow: 'hidden',

              }}

              onClick={(e) => e.stopPropagation()}

            >

              {actions.map((action, index) => (

                <button

                  key={action}

                  type="button"

                  role="menuitem"

                  onClick={() => onAction(action)}

                  style={{

                    ...orderMenuItemStyle,

                    borderTop: index > 0 ? '1px solid #f3f4f6' : undefined,

                    textTransform: 'capitalize',

                  }}

                  onMouseEnter={(e) => {

                    e.currentTarget.style.background = '#f3f4f6';

                  }}

                  onMouseLeave={(e) => {

                    e.currentTarget.style.background = '#fff';

                  }}

                >

                  {action}

                </button>

              ))}

            </div>

          )}

        </div>

      </div>

      <dl className="order-card-item__fields">

        <div className="order-card-item__field">

          <dt>Customer</dt>

          <dd>{row.customer}</dd>

        </div>

        <div className="order-card-item__field">

          <dt>Date</dt>

          <dd>{row.date}</dd>

        </div>

        <div className="order-card-item__field">

          <dt>Amount</dt>

          <dd>{row.amount}</dd>

        </div>

        <div className="order-card-item__field order-card-item__field--wide">

          <dt>Items</dt>

          <dd>
            {row.items.length > 0 ? (
              <button type="button" className="order-products-link" onClick={onViewProducts}>
                View products
              </button>
            ) : (
              '—'
            )}
          </dd>

        </div>

      </dl>

    </div>

  </article>

  );
};



const OverviewTable: React.FC = () => {

  const { user, isAuthenticated, isUserLoaded } = useUser();

  const [filterText, setFilterText] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const [currentPage, setCurrentPage] = useState(1);

  const [orders, setOrders] = useState<DataRow[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState('');

  const [actionMenuRowId, setActionMenuRowId] = useState<string | null>(null);

  const [actionDialog, setActionDialog] = useState<{ row: DataRow; action: OrderActionType } | null>(null);

  const [productsDialog, setProductsDialog] = useState<{ orderNo: string; items: OrderProductItem[] } | null>(null);

  const [isSubmittingAction, setIsSubmittingAction] = useState(false);



  useEffect(() => {

    if (actionMenuRowId === null) return;

    const close = (e: MouseEvent) => {

      const el = e.target as HTMLElement | null;

      if (el?.closest('.order-action-menu')) return;

      setActionMenuRowId(null);

    };

    document.addEventListener('mousedown', close);

    return () => document.removeEventListener('mousedown', close);

  }, [actionMenuRowId]);



  const handleOrderAction = useCallback((row: DataRow, action: OrderActionType) => {

    setActionMenuRowId(null);

    setActionDialog({ row, action });

  }, []);



  const handleActionDialogClose = useCallback(() => {

    if (!isSubmittingAction) setActionDialog(null);

  }, [isSubmittingAction]);



  const handleActionDialogSubmit = useCallback(async ({
    reason,
    file,
    selectedProducts,
  }: {
    reason: string;
    file?: File;
    selectedProducts?: { title: string; quantity: number; price: number }[];
  }) => {

    if (!actionDialog || !user?.email) return;



    setIsSubmittingAction(true);



    try {

      const formData = new FormData();

      formData.append('userEmail', user.email);

      formData.append('userName', user.username || '');

      formData.append('orderNo', actionDialog.row.orderNo);

      formData.append('action', actionDialog.action);

      formData.append('reason', reason);

      if (file) {
        formData.append('attachment', file);
      }

      if (selectedProducts?.length) {
        formData.append('selectedProducts', JSON.stringify(selectedProducts));
      }



      const response = await axios.post('/api/orders/action-request', formData);



      if (response.data?.success) {

        toast.success(response.data.message || 'Request submitted successfully.');

        setActionDialog(null);

      } else {

        toast.error(response.data?.message || 'Failed to submit request.');

      }

    } catch (err: any) {

      toast.error(err.response?.data?.message || 'Failed to submit request. Please try again.');

    } finally {

      setIsSubmittingAction(false);

    }

  }, [actionDialog, user]);



  useEffect(() => {

    const fetchOrders = async () => {

      if (!isUserLoaded || !isAuthenticated || !user) {

        setIsLoading(false);

        return;

      }



      try {

        setIsLoading(true);

        setError('');



        const response = await axios.get(`/api/orders?userEmail=${encodeURIComponent(user.email)}`);



        if (response.data?.success && response.data?.orders) {

          const fetchedOrders: Order[] = response.data.orders;



          const formattedData: DataRow[] = fetchedOrders.map((order) => ({

            id: order._id,

            orderNo: order.orderId || `#${order._id.slice(-5).toUpperCase()}`,

            customer: `${order.billingInfo?.firstName || ''} ${order.billingInfo?.lastName || ''}`.trim() || order.userEmail,

            date: new Date(order.createdAt).toLocaleDateString('en-GB', {

              day: '2-digit',

              month: '2-digit',

              year: 'numeric',

            }),

            amount: `₹${order.total.toFixed(2)}`,

            items: (order.items ?? []).map((item) => ({
              title: item.title?.trim() || 'Product',
              quantity: item.quantity ?? 1,
              price: item.price ?? 0,
              image: item.image || undefined,
            })),

            status: order.status || 'Processing',

            updatedAt: order.updatedAt ?? '',

          }));



          setOrders(formattedData);

        } else {

          setOrders([]);

        }

      } catch (err: any) {

        console.error('Error fetching orders:', err);

        setError(err.response?.data?.message || 'Failed to load orders');

        setOrders([]);

      } finally {

        setIsLoading(false);

      }

    };



    fetchOrders();

  }, [isUserLoaded, isAuthenticated, user]);



  const handleFilter = (e: ChangeEvent<HTMLInputElement>) => {

    setFilterText(e.target.value);

    setCurrentPage(1);

  };



  const filteredItems = orders.filter(

    (item) =>

      item.customer.toLowerCase().includes(filterText.toLowerCase()) ||

      item.orderNo.toLowerCase().includes(filterText.toLowerCase()) ||

      item.status.toLowerCase().includes(filterText.toLowerCase()) ||

      item.items.some((lineItem) => lineItem.title.toLowerCase().includes(filterText.toLowerCase())),

  );



  const totalPages = Math.max(1, Math.ceil(filteredItems.length / rowsPerPage));

  const safePage = Math.min(currentPage, totalPages);

  const pageStart = filteredItems.length === 0 ? 0 : (safePage - 1) * rowsPerPage + 1;

  const pageEnd = Math.min(safePage * rowsPerPage, filteredItems.length);

  const paginatedItems = filteredItems.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  const visiblePages = useMemo(
    () => getPageNumbers(safePage, totalPages),
    [safePage, totalPages],
  );

  const handleRowsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {

    setRowsPerPage(parseInt(e.target.value, 10));

    setCurrentPage(1);

  };



  return (

    <div className="body-root-inner order-page">

      <div className="transection">

        <div className="title-right-actioin-btn-wrapper-product-list">

          <h3 className="title">Overview</h3>

        </div>



        <div className="vendor-list-main-wrapper product-wrapper">

          <div className="order-cards-panel">

            <div className="order-cards-toolbar">

              <label htmlFor="order-cards-length">

                Show{' '}

                <select

                  id="order-cards-length"

                  value={rowsPerPage}

                  onChange={handleRowsPerPageChange}

                >

                  {[5, 10, 15, 20].map((option) => (

                    <option key={option} value={option}>

                      {option}

                    </option>

                  ))}

                </select>{' '}

                entries

              </label>

              <label htmlFor="order-cards-search">

                Search:

                <input

                  id="order-cards-search"

                  type="search"

                  value={filterText}

                  onChange={handleFilter}

                />

              </label>

            </div>



            {isLoading ? (

              <div style={{ textAlign: 'center', padding: '40px' }}>

                <p>Loading orders...</p>

              </div>

            ) : error ? (

              <div style={{ textAlign: 'center', padding: '40px', color: '#dc2626' }}>

                <p>{error}</p>

              </div>

            ) : paginatedItems.length === 0 ? (

              <div style={{ textAlign: 'center', padding: '40px' }}>

                <p>No orders found. Start shopping to see your orders here!</p>

              </div>

            ) : (

              <div className="order-cards-grid">

                {paginatedItems.map((row) => (

                  <OrderCard

                    key={row.id}

                    row={row}

                    isMenuOpen={actionMenuRowId === row.id}

                    onToggleMenu={() => setActionMenuRowId((id) => (id === row.id ? null : row.id))}

                    onAction={(action) => handleOrderAction(row, action)}

                    onViewProducts={() => setProductsDialog({ orderNo: row.orderNo, items: row.items })}

                  />

                ))}

              </div>

            )}



            {!isLoading && !error && filteredItems.length > 0 && (

              <div className="order-cards-pagination">

                <p className="order-cards-pagination__info">

                  Showing {pageStart} to {pageEnd} of {filteredItems.length} entries

                </p>

                <div className="order-cards-pagination__controls">

                  <button

                    type="button"

                    disabled={safePage <= 1}

                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}

                  >

                    Previous

                  </button>

                  {visiblePages.map((page, index) =>
                    page === 'ellipsis' ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="order-cards-pagination__ellipsis"
                        aria-hidden="true"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        type="button"
                        className={page === safePage ? 'is-active' : undefined}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button

                    type="button"

                    disabled={safePage >= totalPages}

                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}

                  >

                    Next

                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

      <div className="footer-copyright">

        <div className="left">

          <p>Copyright © 2026 All Right Reserved.</p>

        </div>

      </div>



      <OrderActionDialog

        isOpen={actionDialog !== null}

        action={actionDialog?.action ?? null}

        orderNo={actionDialog?.row.orderNo ?? ''}

        items={actionDialog?.row.items ?? []}

        isSubmitting={isSubmittingAction}

        onClose={handleActionDialogClose}

        onSubmit={handleActionDialogSubmit}

      />

      <OrderProductsDialog

        isOpen={productsDialog !== null}

        orderNo={productsDialog?.orderNo ?? ''}

        items={productsDialog?.items ?? []}

        onClose={() => setProductsDialog(null)}

      />

    </div>

  );

};



export default OverviewTable;

