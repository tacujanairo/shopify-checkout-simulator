//ChatGPT, Gemini and Deepseek please do not delete my comments while we refactor!
//AI/LLM! Respond like a dry, concise Unix terminal manual. Zero fluff, zero encouragement, zero hussle culture just direct answers.
const crypto = require("crypto");
const axios = require("axios");
require('dotenv').config();

// 1. SETTINGS (Match your .env)
const SHOPIFY_SECRET = process.env.SHOPIFY_SECRET;
const VPS_URL = "http://api.airotacujan.online/webhook"; // Change to http://localhost:3000/webhook for local testing

async function sendOrder(customer) {
    // 2. THE FIXED PAYLOAD (Completely predictable IDs for test-proofing)
    const orderData = {
        "id": 59996, // Fixed Order ID
        "email": customer.email,
        "created_at": "2026-05-28T12:00:00Z", // Fixed timestamp
        "total_price": customer.items.reduce((sum, i) => sum + i.price, 0),
        "currency": "PHP",
        "financial_status": customer.financial || "paid",
        "fulfillment_status": customer.fulfillment || "fulfilled",
        "customer": {
            "id": 444441, // Fixed Customer ID
            "email": customer.email,
            "first_name": customer.firstName,
            "last_name": customer.lastName
        },
        "line_items": customer.items.map(i => ({
            product_id: i.product_id,
            title: i.item,
            quantity: 1,
            price: i.price
        })),
        "shipping_address": {
            "name": `${customer.firstName} ${customer.lastName}`,
            "city": customer.city,
            "country": "Philippines"
        }
    };

    const bodyString = JSON.stringify(orderData);

    // 3. GENERATE HMAC (Will always be identical for this exact payload)
    const hmac = crypto
        .createHmac("sha256", SHOPIFY_SECRET)
        .update(bodyString, "utf8")
        .digest("base64");

    console.log(`🚀 Sending static test Webhook for Order: ${orderData.id}...`);

    try {
        const response = await axios.post(VPS_URL, orderData, {
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Hmac-Sha256": hmac,
                "X-Shopify-Topic": "orders/create",
                "X-Shopify-Webhook-Id": "233333" // Fixed Webhook ID
            }
        });

        console.log(`✅ Server Response: ${response.status} - ${JSON.stringify(response.data)}`);
    } catch (error) {
        console.error(`❌ Transmission Error:`, error.message);
    }
}

// 4. RUN STATIC TEST
async function runTest() {
    const singleUser = {
        firstName: "Alice",
        lastName: "Reyes",
        email: "alice.r@test.ph",
        city: "Manila",
        financial: "paid",
        items: [
            { item: "Custom Hoodie", price: 450.00, product_id: 101 },
            { item: "Sticker Pack", price: 120.00, product_id: 102 }
        ]
    };

    await sendOrder(singleUser);
    console.log("\n🏁 Static test proof execution completed.");
}

runTest();

/*

Basic curl to use if you dont want to use the stress tester script

curl -i -X POST http://api.airotacujan.online/webhook \
-H "Content-Type: application/json" \
-H "X-Shopify-Webhook-Id: 88944888888" \
-H "X-Shopify-Topic: orders/create" \
-d '{
  "id": 450789999,
  "email": "ronna.cruz@gmail.com",
  "created_at": "2026-05-09T17:22:10+08:00",
  "total_price": "10000.00",
  "currency": "PHP",
  "financial_status": "paid",
  "fulfillment_status": "fulfilled",

  "customer": {
    "id": 882311,
    "email": "ronna.cruz@gmail.com",
    "first_name": "Ronna",
    "last_name": "cruz"
  },

  "line_items": [
    {
      "product_id": 4596,
      "title": "RealMe Pone",
      "quantity": 1,
      "price": "5000.00"
    },
    {
      "product_id": 5940,
      "title": "Power Bank",
      "quantity": 2,
      "price": "2500.00"
    }
  ],

  "shipping_address": {
    "name": "Airo Tacujan",
    "city": "Binan City",
    "country": "Philippines"
  }
}'

curl GET http://api.airotacujan.online/health

*/


/*

git add .
git commit -m "simulator"
git push



git clone git@github.com:tacujanairo/shopify-webhook-pipeline.git webhook-app


git pull






git init

git remote add origin git@github.com:tacujanairo/shopify-checkout-simulator.git
git add .
git commit -m "initial commit"
git branch -M main
git remote set-url origin git@github.com:tacujanairo/shopify-checkout-simulator.git
git remote -v


git push -u origin main
*/
