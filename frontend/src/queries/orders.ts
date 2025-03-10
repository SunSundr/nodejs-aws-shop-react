import axios, { AxiosError } from 'axios';
import React from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import API_PATHS from '~/constants/apiPaths';
import { OrderStatus } from '~/constants/order';
import { Order } from '~/models/Order';

export function useOrders() {
  return useQuery<Order[], AxiosError>({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await axios.get<Order[]>(`${API_PATHS.order}/order`);
      return res.data;
    },
  });
}

export function useInvalidateOrders() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries({ queryKey: ['orders'], exact: true }),
    [queryClient],
  );
}

export function useUpdateOrderStatus() {
  return useMutation({
    mutationFn: async (values: { id: string; status: OrderStatus; comment: string }) => {
      const { id, ...data } = values;
      return axios.put(`${API_PATHS.order}/order/${id}/status`, data, {
        headers: {
          Authorization: `Basic ${localStorage.getItem('authorization_token')}`,
        },
      });
    },
  });
}

export function useSubmitOrder() {
  return useMutation({
    mutationFn: async (values: Omit<Order, 'id'>) => {
      return axios.put<Omit<Order, 'id'>>(`${API_PATHS.order}/order`, values, {
        headers: {
          Authorization: `Basic ${localStorage.getItem('authorization_token')}`,
        },
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
  return useMutation({
    mutationFn: async (id: string) => {
      return axios.delete(`${API_PATHS.order}/order/${id}`, {
        headers: {
          Authorization: `Basic ${localStorage.getItem('authorization_token')}`,
        },
      });
    },
  });
}
