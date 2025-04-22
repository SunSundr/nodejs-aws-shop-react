import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import API_PATHS from '~/constants/apiPaths';
import { OrderStatus } from '~/constants/order';
import { Order } from '~/models/Order';

export function useOrders() {
  return useQuery<Order[], AxiosError>({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await axios.get<Order[]>(`${API_PATHS.orderMock}/order`);
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
      return axios.put(`${API_PATHS.orderMock}/order/${id}/status`, data, {
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
      const updatedValues = {
        //user_id: 'user_id',
        //cart_id: cartId,
        payment: JSON.stringify({
          method: 'paypal',
          transactionId: `txn_${Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join('')}`,
        }),
        delivery: {
          type: 'post',
          lastName: values.address.lastName,
          firstName: values.address.firstName,
          address: values.address.address,
        },
        comments: values.address.comment,
        status: OrderStatus.Open,
        total: values.total,
      };

      return axios.put<Omit<Order, 'id'>>(`${API_PATHS.bff}/cart/order`, updatedValues, {
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
      return axios.delete(`${API_PATHS.orderMock}/order/${id}`, {
        headers: {
          Authorization: `Basic ${localStorage.getItem('authorization_token')}`,
        },
      });
    },
  });
}
