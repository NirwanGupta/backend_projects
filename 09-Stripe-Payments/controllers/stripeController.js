require(`dotenv`).config();
const stripe = require(`stripe`)(process.env.SECRET_KEY);   //  we have to pass the secret key here also

const stripeController = async(req, res) => {
    const {purchase, total_amount, shipping_fee} = req.body;

    //  because we are not setting up the database in this project we are not confirmiung the total_amount
    //  but always in backend it is a good practise to calculate the total_Amount here alse because the user can manuplaite the frontend sometimes
    const calculateOrderAmount = () => {
        return total_amount + shipping_fee;
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(),
        currency: `usd`,
    })
    
    console.log(paymentIntent);
    res.json({clientSecret: paymentIntent.client_secret});
}

module.exports = stripeController;