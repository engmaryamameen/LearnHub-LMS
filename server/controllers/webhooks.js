import Stripe from "stripe";
import { request, response } from "express";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);


// export const stripeWebhooks = async (request,response) => {
//     const sig = request.headers['stripe-signature'];

//   let event;

//   try {
//     event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//   }
//   catch (err) {
//     response.status(400).send(`Webhook Error: ${err.message}`);
//   }
//     // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':{
//       const paymentIntent = event.data.object;
//       const paymentIntentId = paymentIntent.id;
//       const session = await stripeInstance.checkout.sessions.list({
//         payment_intent: paymentIntentId
//       })
//       const {purchaseId} = session.data[0].metadata;
//       const purchaseData = await Purchase.findById(purchaseId)

//       const userData = await User.findById(purchaseData.userId)
//       const courseData = await Course.findById(purchaseData.courseId.toString())

//       courseData.enrolledStudents.push(userData)
//       await courseData.save()

//       userData.enrolledCourses.push(courseData._id)
//       await userData.save()

//       purchaseData.status = 'completed'

//       await purchaseData.save()

//       break;
//     }


//     case 'payment_intent.payment_failed':{
//         const paymentIntent = event.data.object;
//         const paymentIntentId = paymentIntent.id;
//         const session = await stripeInstance.checkout.sessions.list({
//           payment_intent: paymentIntentId
//         })
//         const {purchaseId} = session.data[0].metadata;
//         const purchaseData = await Purchase.findById(purchaseId)

//         purchaseData.status = 'failed'
//         await purchaseData.save();
      
//       break;
//     }
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a response to acknowledge receipt of the event
//   response.json({received: true});
// }


// import Stripe from 'stripe';

// const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (request, response) => {
    console.log('Webhook received:', request.method, request.url);
    
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        console.log('Webhook event type:', event.type);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    const handlePaymentSuccess = async (paymentIntent) => {
        try {
            console.log('Processing payment success for payment intent:', paymentIntent.id);
            
            const paymentIntentId = paymentIntent.id;
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            if (!session.data.length) {
                console.error("No session data found for payment intent:", paymentIntentId);
                return;
            }

            const { purchaseId } = session.data[0].metadata;
            console.log('Purchase ID from metadata:', purchaseId);
            
            const purchaseData = await Purchase.findById(purchaseId);

            if (!purchaseData) {
                console.error("No purchase found for ID:", purchaseId);
                return;
            }

            console.log('Purchase data found:', {
                userId: purchaseData.userId,
                courseId: purchaseData.courseId,
                status: purchaseData.status
            });

            const userData = await User.findOne({ supabaseId: purchaseData.userId });
            const courseData = await Course.findById(purchaseData.courseId.toString());

            if (!userData || !courseData) {
                console.error("User or Course not found", {
                    userFound: !!userData,
                    courseFound: !!courseData,
                    userId: purchaseData.userId,
                    courseId: purchaseData.courseId
                });
                return;
            }

            console.log('User and course found, updating enrollments...');

            // Add user to enrolled students
            courseData.enrolledStudents.push(userData.supabaseId);
            await courseData.save();
            console.log('User added to course enrolled students');

            // Add course to user's enrolled courses
            userData.enrolledCourses.push(courseData._id);
            await userData.save();
            console.log('Course added to user enrolled courses');

            // Update purchase status
            purchaseData.status = 'completed';
            await purchaseData.save();
            console.log('Purchase status updated to completed');
            
            console.log('Payment success processing completed successfully');
        } catch (error) {
            console.error("Error handling payment success:", error);
        }
    };

    const handlePaymentFailed = async (paymentIntent) => {
        try {
            const paymentIntentId = paymentIntent.id;
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            if (!session.data.length) {
                console.error("No session data found for failed payment intent:", paymentIntentId);
                return;
            }

            const { purchaseId } = session.data[0].metadata;
            const purchaseData = await Purchase.findById(purchaseId);

            if (!purchaseData) {
                console.error("No purchase found for ID:", purchaseId);
                return;
            }

            purchaseData.status = 'failed';
            await purchaseData.save();
        } catch (error) {
            console.error("Error handling payment failure:", error);
        }
    };

    switch (event.type) {
        case 'payment_intent.succeeded':
            await handlePaymentSuccess(event.data.object);
            break;

        case 'payment_intent.payment_failed':
            await handlePaymentFailed(event.data.object);
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
};




