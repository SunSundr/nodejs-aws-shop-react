import React from 'react';
import { useAuth } from 'react-oidc-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import API_PATHS from '~/constants/apiPaths';
import { OrderStatus } from '~/constants/order';
import { Order, OrderPart, OrdersMap } from '~/models/Order';
import { authHeaders } from '~/utils/auth';

export function useOrders() {
  const auth = useAuth();
  return useQuery<Order[], AxiosError>({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await axios.get<OrdersMap>(`${API_PATHS.order}/order`, {
        headers: authHeaders(auth),
        // params: { filter: 'all', limit: 2 },
        params: { filter: 'all' },
      });
      return res.data.orders;
    },
  });
}

export function useOrder(id?: string) {
  const auth = useAuth();
  const queryClient = useQueryClient();
  return useQuery<Order, AxiosError>({
    queryKey: ['order', id],
    queryFn: async () => {
      const orders: Order[] = queryClient.getQueryData(['orders']) || [];
      const order = orders.find((order) => order.id === id);
      if (order) return order;
      const res = await axios.get<Order>(`${API_PATHS.order}/order/${id}`, {
        headers: authHeaders(auth),
      });
      return res.data;
    },
    enabled: !!id,
  });
}

export function useInvalidateOrders() {
  const queryClient = useQueryClient();
  return React.useCallback(
    async (newData?: Order, remove = false) => {
      const orders: Order[] = queryClient.getQueryData(['orders']) || [];
      if (newData && orders.length > 0) {
        const index = orders.findIndex((order) => order.id === newData.id);
        if (remove) {
          orders.splice(index, 1);
        } else if (index === -1) {
          // cache error (never)
          await queryClient.resetQueries({ queryKey: ['orders'], exact: true });
          return;
        } else {
          orders[index] = newData;
        }
        await queryClient.setQueryData(['orders'], orders);
        await queryClient.setQueryData(['order', newData.id], newData);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['orders'], exact: true });
      }
    },
    [queryClient],
  );
  // return React.useCallback(
  //   () => queryClient.invalidateQueries({ queryKey: ['orders'], exact: true }),
  //   [queryClient],
  // );
}

export function useUpdateOrderStatus() {
  const auth = useAuth();
  const invalidateOrders = useInvalidateOrders();
  return useMutation({
    mutationFn: async (values: { id: string; status: OrderStatus; comment: string }) => {
      const { id, ...data } = values;
      const response = await axios.put(`${API_PATHS.order}/order/${id}/status`, data, {
        headers: authHeaders(auth),
      });
      invalidateOrders(response.data);
      return response;
      // return axios.put(`${API_PATHS.order}/order/${id}/status`, data, {
      //   headers: authHeaders(auth),
      // });
    },
  });
}

export function useSubmitOrder() {
  const auth = useAuth();
  return useMutation({
    mutationFn: async (values: OrderPart) => {
      /* const updatedValues = {
        //user_id: 'user_id',
        //cart_id: cartId,
        // payment: JSON.stringify({
        //   method: 'paypal',
        //   transactionId: `txn_${Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join('')}`,
        // }),

        //     address: string;
        // firstName: string;
        // lastName: string;
        // comment: string;
        items: values.items,
        delivery: {
          address: values.delivery.address,
          firstName: values.delivery.firstName,
          lastName: values.delivery.lastName,
          comment: values.delivery.comment,
        },
        //status: OrderStatus.OPEN,
        total: values.total,
        cartId: values.cartId,
      }; */

      return axios.post<Omit<Order, 'id'>>(`${API_PATHS.order}/order`, values, {
        headers: authHeaders(auth),
      });
    },
  });
}

export function useInvalidateOrder() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (id: string) => queryClient.invalidateQueries({ queryKey: ['order', id], exact: true }),
    [queryClient],
  );
}

export function useDeleteOrder() {
  const auth = useAuth();
  return useMutation({
    mutationFn: async (id: string) => {
      return axios.delete(`${API_PATHS.order}/order/${id}`, {
        headers: authHeaders(auth),
      });
    },
  });
}
