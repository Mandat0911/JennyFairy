export const checkoutDTO = (session, totalAmount) => ({
    id: session.id,
    url: session.url,
    totalAmount: totalAmount
});

