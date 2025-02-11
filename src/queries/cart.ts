import axios, { AxiosError } from 'axios';
import React from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import API_PATHS from '~/constants/apiPaths';
import { CartItem } from '~/models/CartItem';

// export function useCart() {
//   return useQuery<CartItem[], AxiosError>("cart", async () => {
//     const res = await axios.get<CartItem[]>(`${API_PATHS.cart}/profile/cart`, {
//       headers: {
//         Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
//       },
//     });
//     return res.data;
//   });
// }

export function useCart() {
  return useQuery<CartItem[], AxiosError>({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await axios.get<CartItem[]>(`${API_PATHS.cart}/profile/cart`, {
        headers: {
          Authorization: `Basic ${localStorage.getItem('authorization_token')}`,
        },
      });
      return res.data;
    },
  });
}

// export function useCartData() {
//   const queryClient = useQueryClient();
//   return queryClient.getQueryData<CartItem[]>("cart");
// }

/* export function useCartData() {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<CartItem[]>({ queryKey: ["cart"] });
} */

export function useCartData() {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<CartItem[]>(['cart']);
}

// export function useInvalidateCart() {
//   const queryClient = useQueryClient();
//   return React.useCallback(
//     () => queryClient.invalidateQueries("cart", { exact: true }),
//     []
//   );
// }

export function useInvalidateCart() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries({ queryKey: ['cart'], exact: true }),
    [queryClient],
  );
}

// export function useUpsertCart() {
//   return useMutation((values: CartItem) =>
//     axios.put<CartItem[]>(`${API_PATHS.cart}/profile/cart`, values, {
//       headers: {
//         Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
//       },
//     })
//   );
// }

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
