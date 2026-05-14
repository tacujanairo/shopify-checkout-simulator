//ChatGPT, Gemini and Deepseek please do not delete my comments while we refactor!
// simulation.js
const crypto = require("crypto");
const axios = require("axios");
require('dotenv').config();

// 1. SETTINGS (Match your .env)
const SHOPIFY_SECRET = process.env.SHOPIFY_SECRET;
const VPS_URL = "http://api.airotacujan.online/webhook"; // Change to http://localhost:3000/webhook for local testing

// Helper for unique IDs
const randId = () => Math.floor(Math.random() * 900000000) + 100000000;

async function sendOrder(customer) {
    // 2. THE PAYLOAD (Matching your normalizeShopifyOrder requirements)
    const orderData = {
        "id": randId(),
        "email": customer.email,
        "created_at": new Date().toISOString(),
        "total_price": customer.price,
        "currency": "PHP",
        "financial_status": customer.financial || "paid",
        "fulfillment_status": customer.fulfillment || "fulfilled",
        "customer": {
            "id": randId(),
            "email": customer.email,
            "first_name": customer.firstName,
            "last_name": customer.lastName
        },
        "line_items": [
            {
                "product_id": randId(),
                "title": customer.item,
                "quantity": 1,
                "price": customer.price
            }
        ],
        "shipping_address": {
            "name": `${customer.firstName} ${customer.lastName}`,
            "city": customer.city,
            "country": "Philippines"
        }
    };

    const bodyString = JSON.stringify(orderData);

    // 3. GENERATE HMAC (Critical for your backend security)
    const hmac = crypto
        .createHmac("sha256", SHOPIFY_SECRET)
        .update(bodyString, "utf8")
        .digest("base64");

    console.log(`🚀 Sending Webhook for: ${customer.firstName}...`);

    try {
        const response = await axios.post(VPS_URL, orderData, {
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Hmac-Sha256": hmac,
                "X-Shopify-Topic": "orders/create",
                "X-Shopify-Webhook-Id": randId().toString()
            }
        });

        console.log(`✅ Server Response: ${response.status} - ${response.data}`);
    } catch (error) {
        console.error(`❌ Transmission Error for ${customer.firstName}:`, error.message);
    }
}

// 4. YOUR TEST USERS BATCH
async function runTest() {
    const testUsers = [
        { firstName: "Alice", lastName: "Reyes", email: "alice.r@test.ph", price: "450.00", city: "Manila", item: "Custom Hoodie", financial: "paid" },
        { firstName: "Bob", lastName: "Santos", email: "bob.s@test.ph", price: "1200.00", city: "Cebu City", item: "Mechanical Keyboard", financial: "paid" },
        { firstName: "Charlie", lastName: "Cruz", email: "char.c@test.ph", price: "250.00", city: "Davao", item: "Graphic Tee", financial: "pending" },
        { firstName: "Diana", lastName: "Mendoza", email: "diana.m@test.ph", price: "8500.00", city: "Makati", item: "Smart Watch", financial: "paid" },
        { firstName: "Ethan", lastName: "Torres", email: "ethan.t@test.ph", price: "120.00", city: "Quezon City", item: "Sticker Pack", financial: "paid" }
    ];

    for (const user of testUsers) {
        await sendOrder(user);
    }
    console.log("\n🏁 All test data sent to the pipeline.");
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
