import * as Yup from 'yup';

export const ProductSchema = Yup.object({
  id: Yup.string(),
  title: Yup.string().required().default(''),
  description: Yup.string().default(''),
  price: Yup.number().positive().required().defined().default(0),
  imageURL: Yup.string(),
});

export const AvailableProductSchema = ProductSchema.shape({
  count: Yup.number().integer().min(0).required().defined().default(0),
});

export const SubscriptionsSchema = Yup.object({
  email: Yup.string().required('Email is required').email('Invalid email').default(''),
  filterType: Yup.string().required('Filter type is required').default('none'),
  minPrice: Yup.number().when('filterType', (filterType: string[], schema) => {
    return filterType[0] === 'price'
      ? schema
          .required('Min price is required')
          .min(0, 'Min price must be greater than or equal to 0')
      : schema.nullable();
  }),
  maxPrice: Yup.number().when('filterType', (filterType: string[], schema) => {
    return filterType[0] === 'price'
      ? schema
          .required('Max price is required')
          .min(Yup.ref('minPrice'), 'Max price must be greater than or equal to min price')
      : schema.nullable();
  }),
  keywords: Yup.string().when('filterType', (filterType: string[], schema) => {
    return filterType[0] === 'keywords'
      ? schema.required('Keywords are required')
      : schema.nullable();
  }),
});

export type Product = Yup.InferType<typeof ProductSchema>;
export type AvailableProduct = Yup.InferType<typeof AvailableProductSchema>;
export type Subscription = Yup.InferType<typeof SubscriptionsSchema>;
