import axios, { AxiosError } from 'axios';
import API_PATHS from '~/constants/apiPaths';
import { AvailableProduct } from '~/models/Product';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import React from 'react';

export function useAvailableProducts() {
  return useQuery<AvailableProduct[], AxiosError>({
    queryKey: ['available-products'],
    queryFn: async () => {
      const res = await axios.get<AvailableProduct[]>(`${API_PATHS.product}/products`);
      return res.data;
    },
  });
}

export function useInvalidateAvailableProducts() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () =>
      queryClient.invalidateQueries({
        queryKey: ['available-products'],
        exact: true,
      }),
    [queryClient],
  );
}

export function useAvailableProduct(id?: string) {
  return useQuery<AvailableProduct, AxiosError>({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await axios.get<AvailableProduct>(`${API_PATHS.product}/products/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useRemoveProductCache() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (id?: string) => queryClient.removeQueries({ queryKey: ['product', id], exact: true }),
    [queryClient],
  );
}

export function useUpsertAvailableProduct(id?: string) {
  return useMutation({
    mutationFn: async (values: AvailableProduct) => {
      const path = `${API_PATHS.bff}/products`;
      const config = {
        headers: {
          Authorization: `Basic ${localStorage.getItem('authorization_token')}`,
        },
      };
      return id
        ? axios.put<AvailableProduct>(path, values, config)
        : axios.post<AvailableProduct>(path, values, config);
    },
  });
}

export function useUpsertAvailableProductOLD() {
  return useMutation({
    mutationFn: async (values: AvailableProduct) =>
      axios.put<AvailableProduct>(`${API_PATHS.bff}/products`, values, {
        headers: {
          Authorization: `Basic ${localStorage.getItem('authorization_token')}`,
        },
      }),
  });
}

export function useDeleteAvailableProduct() {
  return useMutation({
    mutationFn: async (id: string) =>
      axios.delete(`${API_PATHS.bff}/products/${id}`, {
        headers: {
          Authorization: `Basic ${localStorage.getItem('authorization_token')}`,
        },
      }),
  });
}
