// import { rest } from "msw";
import { http, HttpResponse } from 'msw';
import API_PATHS from '~/constants/apiPaths';
import { availableProducts, orders, products, cart } from '~/mocks/data';
// import { CartItem } from "~/models/CartItem";
// import { Order } from "~/models/Order";
// import { AvailableProduct, Product } from "~/models/Product";

export const handlers = [
  // rest.get(`${API_PATHS.bff}/product`, (req, res, ctx) => {
  //   return res(ctx.status(200), ctx.delay(), ctx.json<Product[]>(products));
  // }),
  http.get(`${API_PATHS.bff}/product`, () => {
    return HttpResponse.json(products);
  }),
  // rest.put(`${API_PATHS.bff}/product`, (req, res, ctx) => {
  //   return res(ctx.status(200));
  // }),
  http.put(`${API_PATHS.bff}/product`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
  // rest.delete(`${API_PATHS.bff}/product/:id`, (req, res, ctx) => {
  //   return res(ctx.status(200));
  // }),
  http.delete(`${API_PATHS.bff}/product/:id`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
  // rest.get(`${API_PATHS.bff}/product/available`, (req, res, ctx) => {
  //   return res(
  //     ctx.status(200),
  //     ctx.delay(),
  //     ctx.json<AvailableProduct[]>(availableProducts)
  //   );
  // }),
  http.get(`${API_PATHS.bff}/product/available`, () => {
    return HttpResponse.json(availableProducts);
  }),
  // rest.get(`${API_PATHS.bff}/product/:id`, (req, res, ctx) => {
  //   const product = availableProducts.find((p) => p.id === req.params.id);
  //   if (!product) {
  //     return res(ctx.status(404));
  //   }
  //   return res(
  //     ctx.status(200),
  //     ctx.delay(),
  //     ctx.json<AvailableProduct>(product)
  //   );
  // }),
  http.get(`${API_PATHS.bff}/product/:id`, ({ params }) => {
    const product = availableProducts.find((p) => p.id === params.id);
    return product ? HttpResponse.json(product) : HttpResponse.json(null, { status: 404 });
  }),
  // rest.get(`${API_PATHS.cart}/profile/cart`, (req, res, ctx) => {
  //   return res(ctx.status(200), ctx.delay(), ctx.json<CartItem[]>(cart));
  // }),
  http.get(`${API_PATHS.cart}/profile/cart`, () => {
    return HttpResponse.json(cart);
  }),
  // rest.put(`${API_PATHS.cart}/profile/cart`, (req, res, ctx) => {
  //   return res(ctx.status(200));
  // }),
  http.put(`${API_PATHS.cart}/profile/cart`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
  // rest.get(`${API_PATHS.order}/order`, (req, res, ctx) => {
  //   return res(ctx.status(200), ctx.delay(), ctx.json<Order[]>(orders));
  // })
  http.get(`${API_PATHS.order}/order`, () => {
    return HttpResponse.json(orders);
  }),
  // rest.put(`${API_PATHS.order}/order`, (req, res, ctx) => {
  //   return res(ctx.status(200));
  // }),
  http.put(`${API_PATHS.order}/order`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
  // rest.get(`${API_PATHS.order}/order/:id`, (req, res, ctx) => {
  //   const order = orders.find((p) => p.id === req.params.id);
  //   if (!order) {
  //     return res(ctx.status(404));
  //   }
  //   return res(ctx.status(200), ctx.delay(), ctx.json(order));
  // }),
  http.get(`${API_PATHS.order}/order/:id`, ({ params }) => {
    const order = orders.find((o) => o.id === params.id);
    return order ? HttpResponse.json(order) : HttpResponse.json(null, { status: 404 });
  }),
  // rest.delete(`${API_PATHS.order}/order/:id`, (req, res, ctx) => {
  //   return res(ctx.status(200));
  // }),
  http.delete(`${API_PATHS.order}/order/:id`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
  // rest.put(`${API_PATHS.order}/order/:id/status`, (req, res, ctx) => {
  //   return res(ctx.status(200));
  // }),
  http.put(`${API_PATHS.order}/order/:id/status`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
];
