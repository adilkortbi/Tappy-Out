
const express = require('express');
const app = express();
const cors = require('cors');
const stripe = require('stripe')('sk_test_51Re1IdGa4vKkZfMe09jINyPmpiMDcCa8onGt4OT6mAn2kV18rLU3mx2xXD6rV17X8NxKKzr3MwdsSIe5sexaYrKc00djk3bsrG');


app.use(cors());
app.use(express.json());


app.post('Tappy-Out.com:1/create-checkout-session', async (req, res) => {
  try {
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
      line_items,
      mode: 'payment',
      success_url: 'http://Tappy-Out.com/success.html',
      cancel_url: 'http://Tappy-Out.com/cancel.html',
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use(express.static('public'));

app.listen(3000, () => console.log('Server running at http://Tappy-Out.com'));