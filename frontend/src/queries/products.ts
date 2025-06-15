import React from 'react';
import { useAuth } from 'react-oidc-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import API_PATHS from '~/constants/apiPaths';
import { AvailableProduct, Product } from '~/models/Product';
import { authHeaders } from '~/utils/auth';

export function useAvailableProducts() {
  return useQuery<AvailableProduct[], AxiosError>({
    queryKey: ['available-products'],
    queryFn: async () => {
      const res = await axios.get<AvailableProduct[]>(`${API_PATHS.product}/products`);
      return res.data;
    },
  });
}
export function useAvailableProduct(id?: string) {
  const queryClient = useQueryClient();
  return useQuery<AvailableProduct, AxiosError>({
    queryKey: ['product', id],
    queryFn: async () => {
      const products: AvailableProduct[] = queryClient.getQueryData(['available-products']) || [];
      const product = products.find((product) => product.id === id);
      if (product) return product;
      const res = await axios.get<AvailableProduct>(`${API_PATHS.product}/products/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useInvalidateAvailableProducts() {
  const queryClient = useQueryClient();
  return React.useCallback(
    async (newData?: AvailableProduct, remove = false) => {
      const products: AvailableProduct[] = queryClient.getQueryData(['available-products']) || [];
      if (newData) {
        const index = products.findIndex((product) => product.id === newData.id);
        if (products.length === 0 || (remove && index === -1)) {
          const res = await axios.get<AvailableProduct[]>(`${API_PATHS.product}/products`);
          await queryClient.setQueryData(['available-products'], res.data);
          return;
        } else if (remove) {
          products.splice(index, 1);
        } else if (index === -1) {
          products.push(newData);
        } else {
          products[index] = newData;
        }
        await queryClient.setQueryData(['available-products'], products);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['available-products'], exact: true });
      }
    },
    [queryClient],
  );
}

export function useRemoveProductCache() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (id?: string) => queryClient.removeQueries({ queryKey: ['product', id], exact: true }),
    [queryClient],
  );
}

export function useUpdateAvailableProduct(id?: string) {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const invalidateProducts = useInvalidateAvailableProducts();
  return useMutation({
    mutationFn: async (values: AvailableProduct) => {
      const path = `${API_PATHS.product}/products`;
      const config = {
        headers: authHeaders(auth),
      };
      const response = await (id
        ? axios.put<AvailableProduct>(path, values, config)
        : axios.post<AvailableProduct>(path, values, config));
      invalidateProducts(response.data);
      const product: AvailableProduct | undefined = queryClient.getQueryData([
        'product',
        response.data.id,
      ]);
      if (product) queryClient.setQueryData(['product', response.data.id], response.data);
      return response;
    },
  });
}

export function useDeleteAvailableProduct() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const invalidateProducts = useInvalidateAvailableProducts();
  return useMutation({
    mutationFn: async (product: AvailableProduct) => {
      const response = await axios.delete(`${API_PATHS.product}/products/${product.id}`, {
        headers: authHeaders(auth),
      });
      invalidateProducts(product, true);
      queryClient.removeQueries({ queryKey: ['product', product.id], exact: true });
      return response;
    },
  });
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
