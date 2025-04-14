import React from 'react';
import { useAuth } from 'react-oidc-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import API_PATHS from '~/constants/apiPaths';
import { AvailableProduct, Product } from '~/models/Product';

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
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (values: AvailableProduct) => {
      const path = `${API_PATHS.bff}/products`;
      const token = user?.access_token;
      const config = {
        headers: {
          // Authorization: `Basic ${localStorage.getItem('authorization_token')}`,
          Authorization: `Bearer ${token}`,
        },
      };
      return id
        ? axios.put<AvailableProduct>(path, values, config)
        : axios.post<AvailableProduct>(path, values, config);
    },
  });
}

export function useDeleteAvailableProduct() {
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (id: string) => {
      const token = user?.access_token;
      return axios.delete(`${API_PATHS.bff}/products/${id}`, {
        headers: {
          // Authorization: `Basic ${localStorage.getItem('authorization_token')}`,
          Authorization: `Bearer ${token}`,
        },
      });
    },
  });
}

export function getErrorMessage(error: AxiosError | null) {
  if (!error) return undefined;
  const data = error?.response?.data;
  if (data) {
    if (typeof data === 'object' && 'message' in data) {
      return data.message as string;
    } else if (typeof data === 'string') {
      return data;
    }
  } else if (error.message) {
    return error.message;
  } else {
    return 'Unknown error';
  }
}

export function getErrorProduct(id: string): Product {
  return {
    id,
    title: 'Error',
    description: `id: ${id}`,
    price: 0,
    imageURL: '',
  };
}
