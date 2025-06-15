import React from 'react';
import { useAuth } from 'react-oidc-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import API_PATHS from '~/constants/apiPaths';
import { AuthSyncMessage } from '~/constants/common';
import { CartItem } from '~/models/CartItem';
import { authHeaders, sendSyncAuthMessage } from '~/utils/auth';

export function useCart() {
  const auth = useAuth();
  return useQuery<CartItem[], AxiosError>({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!auth.isAuthenticated) return [];
      const response = await axios.get<CartItem[]>(`${API_PATHS.cart}/cart`, {
        headers: authHeaders(auth),
      });
      sendSyncAuthMessage({ type: AuthSyncMessage.cart, data: response.data });
      return response.data;
    },
  });
}

// export function useCartData() {
//   const queryClient = useQueryClient();
//   return queryClient.getQueryData<CartItem[]>(['cart']);
// }

export function useInvalidateCart() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (newData?: CartItem[]) => {
      if (newData) {
        queryClient.setQueryData(['cart'], newData);
      } else {
        queryClient.invalidateQueries({ queryKey: ['cart'], exact: true });
      }
    },
    [queryClient],
  );
}

export function useUpdateCart() {
  const auth = useAuth();
  const invalidateCart = useInvalidateCart();

  return useMutation({
    mutationFn: async (values: CartItem) => {
      const response = await axios.put<CartItem[]>(`${API_PATHS.cart}/cart`, values, {
        headers: authHeaders(auth),
      });
      invalidateCart(response.data);
      sendSyncAuthMessage({ type: AuthSyncMessage.cart, data: response.data });
      return response;
    },
  });
}
