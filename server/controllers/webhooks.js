// import { Webhook } from "svix";
// import User from "../models/User.js";

// // Api controller function to manage clerk user with databse

// export const clerkWebhooks = async (req,res)=>{

//     try {
//         const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
//         await whook.verify(JSON.stringify(req.body),{
//             "svix-id": req.headers["svix-id"],
//             "svix-timestamp": req.headers["svix-timestamp"],
//             "svix-signature": req.headers["svix-signature"]
//         })

//         const {data, type} = req.body

//         switch (type) {
//             case 'user.created':{
//                 const userData = {
//                     _id: data.id,
//                     email:data.email_addresses[0].email_address,
//                     name: data.first_name + " " + data.last_name,
//                     imageUrl: data.image_url,
//                 }
//                 await User.create(userData)
//                 res.json({})
//                 break;
//             }
                
//                 case 'user.updated':{
//                     const userData = {
//                         email:data.email_address[0].email_address,
//                         name: data.first_name + " " + data.last_name,
//                         imageUrl: data.image_url,
//                     }
//                     await User.findByIdAndUpdate(data.id, userData)
//                     res.json({})
//                     break;
//                 }

//                 case 'user.deleted': {
//                     await User.findByIdAndDelete(data.id);
//                     res.json({})
//                     break;
//                 }
        
//             default:
//                 break;
//         }

//     } catch (error) {
//         res.json({success: false, message: error.message})
//     }

// }

import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import { request, response } from "express";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const payload = JSON.stringify(req.body); // Use req.rawBody if available

        await whook.verify(payload, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        const { data, type } = req.body;

        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses?.[0]?.email_address || "",
                    name: (data.first_name || "") + " " + (data.last_name || ""),
                    imageUrl: data.image_url || "",
                };
                await User.create(userData);
                return res.json({});
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_addresses?.[0]?.email_address || "",
                    name: (data.first_name || "") + " " + (data.last_name || ""),
                    imageUrl: data.image_url || "",
                };
                await User.findByIdAndUpdate(data.id, userData);
                return res.json({});
            }

            case 'user.deleted': {
                await User.findByIdAndDelete(data.id);
                return res.json({});
            }

            default:
                return res.status(400).json({ success: false, message: "Unhandled event type" });
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};


const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);


export const stripeWebhooks = async (request,response) => {
    const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  }
  catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }
    // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':{
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId
      })
      const {purchaseId} = session.data[0].metadata;
      const purchaseData = await Purchase.findById(purchaseId)

      const userData = await User.findById(purchaseData.userId)
      const courseData = await Course.findById(purchaseData.courseId.toString())

      courseData.enrolledStudents.push(userData)
      await courseData.save()

      userData.enrolledCourses.push(courseData._id)
      await userData.save()

      purchaseData.status = 'complete'

      await purchaseData.save()

      break;
    }


    case 'payment_intent.payment_failed':{
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;
        const session = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId
        })
        const {purchaseId} = session.data[0].metadata;
        const purchaseData = await Purchase.findById(purchaseId)

        purchaseData.status = 'failed'
        await purchaseData.save();
      
      break;
    }
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});
}










// const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const stripeWebhooks = async (req, res) => {
//     const sig = req.headers["stripe-signature"];
//     let event;

//     try {
//         event = stripeInstance.webhooks.constructEvent(
//             req.body,
//             sig,
//             process.env.STRIPE_WEBHOOK_SECRET
//         );
//     } catch (err) {
//         return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     try {
//         switch (event.type) {
//             case "payment_intent.succeeded": {
//                 const paymentIntent = event.data.object;
//                 const paymentIntentId = paymentIntent.id;

//                 // Fetch checkout session (Better if you store session ID when creating checkout)
//                 const sessions = await stripeInstance.checkout.sessions.list({ limit: 10 });
//                 const session = sessions.data.find(s => s.payment_intent === paymentIntentId);

//                 if (!session || !session.metadata.purchaseId) {
//                     console.error("No matching session found.");
//                     return res.status(400).send("Invalid session data");
//                 }

//                 const { purchaseId } = session.metadata;
//                 const purchaseData = await Purchase.findById(purchaseId);

//                 if (!purchaseData) {
//                     console.error("Purchase not found");
//                     return res.status(404).send("Purchase not found");
//                 }

//                 const userData = await User.findById(purchaseData.userId);
//                 const courseData = await Course.findById(purchaseData.courseId.toString());

//                 if (!userData || !courseData) {
//                     console.error("User or Course not found");
//                     return res.status(404).send("User or Course not found");
//                 }

//                 courseData.enrolledStudents.push(userData._id);
//                 await courseData.save();

//                 userData.enrolledCourses.push(courseData._id);
//                 await userData.save();

//                 purchaseData.status = "completed";
//                 await purchaseData.save();

//                 break;
//             }

//             case "payment_intent.payment_failed": {
//                 const paymentIntent = event.data.object;
//                 const paymentIntentId = paymentIntent.id;

//                 // Fetch checkout session
//                 const sessions = await stripeInstance.checkout.sessions.list({ limit: 10 });
//                 const session = sessions.data.find(s => s.payment_intent === paymentIntentId);

//                 if (!session || !session.metadata.purchaseId) {
//                     console.error("No matching session found.");
//                     return res.status(400).send("Invalid session data");
//                 }

//                 const { purchaseId } = session.metadata;
//                 const purchaseData = await Purchase.findById(purchaseId);

//                 if (!purchaseData) {
//                     console.error("Purchase not found");
//                     return res.status(404).send("Purchase not found");
//                 }

//                 purchaseData.status = "failed";
//                 await purchaseData.save();

//                 break;
//             }

//             default:
//                 console.log(`Unhandled event type ${event.type}`);
//         }
//     } catch (error) {
//         console.error("Webhook processing error:", error);
//         return res.status(500).send("Internal Server Error");
//     }

//     res.json({ received: true });
// };