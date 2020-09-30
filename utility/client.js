const stripe = require('stripe')('pk_test_TYooMQauvdEDq54NiTphI7jx');
const checkoutButton = document.querySelector('#checkout-button');
checkoutButton.addEventListener('click', () => {
    stripe.redirectToCheckout({
        lineItems: [{
            // Define the product and price in the Dashboard first, and use the price
            // ID in your client-side code.
            price: '{PRICE_ID}',
            quantity: 1
        }],
        sessionId: stripeSession,
        successUrl: 'https://www.example.com/success',
        cancelUrl: 'https://www.example.com/cancel'
    });
});
