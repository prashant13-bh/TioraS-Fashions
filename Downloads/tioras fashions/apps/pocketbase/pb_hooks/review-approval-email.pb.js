/// <reference path="../pb_data/types.d.ts" />
onRecordAfterUpdateSuccess((e) => {
  const original = e.record.original();
  const currentStatus = e.record.get("status");
  const previousStatus = original.get("status");
  
  // Only send email if status changed to 'approved'
  if (previousStatus !== "approved" && currentStatus === "approved") {
    try {
      const userId = e.record.get("userId");
      const productId = e.record.get("productId");
      const title = e.record.get("title");
      
      // Get user record to find email
      const user = $app.findRecordById("users", userId);
      if (!user) {
        e.next();
        return;
      }
      
      const userEmail = user.get("email");
      
      // Get product name
      let productName = "your product";
      try {
        const product = $app.findRecordById("products", productId);
        if (product) {
          productName = product.get("name") || "your product";
        }
      } catch (err) {
        // Product not found, use default
      }
      
      const message = new MailerMessage({
        from: {
          address: $app.settings().meta.senderAddress,
          name: $app.settings().meta.senderName
        },
        to: [{ address: userEmail }],
        subject: "Your review has been approved!",
        html: "<h2>Your review has been approved!</h2><p>Your review for <strong>" + productName + "</strong> has been approved and is now visible on the product page.</p><p><strong>Review title:</strong> " + title + "</p><p>Thank you for sharing your feedback with our community!</p>"
      });
      
      $app.newMailClient().send(message);
    } catch (err) {
      console.log("Error sending approval email: " + err.message);
    }
  }
  
  e.next();
}, "reviews");