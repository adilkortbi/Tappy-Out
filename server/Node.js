const express = require('express');
const app = express();
const stripe = require('stripe')('YOUR_SECRET_KEY');

app.post('/create-checkout-session', async (req, res) => {
  const { cart } = req.body; 

  const line_items = Object.values(cart).map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: line_items,
    mode: 'payment',
    success_url: 'https://yourwebsite.com/success',
    cancel_url: 'https://yourwebsite.com/cancel',
  });

  res.json({ id: session.id });
});

app.listen(3000, () => console.log('Server running on port 3000'));
