import { Request, Response } from "express";
import { supabase } from "../utils/supabaseClient";
import { createError } from "../utils/errorFactory";
export const createOrder = async (req: Request, res: Response) => {
  const {
    userId,
    items,
    total,
    address,
    customer,
    paymentMethod,
    customer_note,
  } = req.body;

  try {
    const { data: customerData, error: customersError } = await supabase
      .from("customers")
      .insert({
        user_id: userId,
        email: customer.email,
        phone: customer.phone,
      })
      .select("id");

    if (customersError) {
      throw createError("Failed to create customer ", 500);
    }
    let customerId = customerData[0].id;
    const { data: addressData, error: addressError } = await supabase
      .from("addresses")
      .insert({
        customer_id: customerId,
        first_name: address.first_name,
        last_name: address.last_name,
        address_line1: address.address_line1,
        address_line2: address.address_line2 || "",
        city: address.city,
        state: address.state,
        country: address.country,
        zip_code: address.zip_code,
      })
      .select("id");
    if (addressError) {
      console.error("FULL ADDRESS ERROR:", addressError);
      throw createError("Failed to create order address ", 500);
    }

    const { data: paymentMethodData, error: paymentError } = await supabase
      .from("payment_methods")
      .insert({
        customer_id: customerId,
        payment_type: paymentMethod.payment_type,
        card_last4: paymentMethod.card_last4,
        card_brand: paymentMethod.card_brand,
      })
      .select("id");
    if (paymentError) {
      console.error("FULL PAYMENT ERROR:", paymentError);
      throw createError("Failed to create payment method ", 500);
    }
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total: total,
        customer_note: customer_note,
        shipping_address_id: addressData[0].id,
        payment_method_id: paymentMethodData[0].id,
        billing_address_id: addressData[0].id,
      })
      .select("id");
    if (orderError) {
      console.error("FULL ORDER ERROR:", orderError);
      throw createError("Failed to create order ", 500);
    }
    let orderItems = [];
    if (items && items.length > 0) {
      orderItems = items.map((item: any) => ({
        order_id: order[0].id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));
    }
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("FULL ORDER ITEM ERROR:", itemsError);
      throw createError("Failed to create order items ", 500);
    }
    res.status(201).json({
      success: true,
      order: {
        order,
        items: items || [],
        address,
        customer,
        paymentMethod,
        customer_note,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Order creation failed" + error });
  }
};
