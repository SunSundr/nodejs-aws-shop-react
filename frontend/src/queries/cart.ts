import React from 'react';
//import { useAuth } from 'react-oidc-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import API_PATHS from '~/constants/apiPaths';
import { useAuthTask8 } from '~/models/authTask8';
import { CartItem } from '~/models/CartItem';

export function useCart() {
  // const auth = useAuth();
  const authTask8 = useAuthTask8();
  return useQuery<CartItem[], AxiosError>({
    queryKey: ['cart'],
    queryFn: async () => {
      // temp solution
      // if (!auth.isAuthenticated) {
      if (!authTask8) {
        return [];
      }
      const res = await axios.get<CartItem[]>(`${API_PATHS.cart}/profile/cart`, {
        headers: {
          Authorization: `Basic ${localStorage.getItem('authorization_token')}`,
        },
      });
      return res.data;
    },
  });
}

export function useCartData() {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<CartItem[]>(['cart']);
}

export function useInvalidateCart() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries({ queryKey: ['cart'], exact: true }),
    [queryClient],
  );
}

export function useUpsertCart() {
  return useMutation({
    mutationFn: async (values: CartItem) =>
      axios.put<CartItem[]>(`${API_PATHS.cart}/profile/cart`, values, {
        headers: {
          Authorization: `Basic ${localStorage.getItem('authorization_token')}`,
        },
      }),
  });
}
