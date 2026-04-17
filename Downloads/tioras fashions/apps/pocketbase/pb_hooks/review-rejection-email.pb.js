/// <reference path="../pb_data/types.d.ts" />
onRecordAfterUpdateSuccess((e) => {
  const original = e.record.original();
  const currentStatus = e.record.get("status");
  const previousStatus = original.get("status");
  
  // Only send email if status changed to 'rejected'
  if (previousStatus !== "rejected" && currentStatus === "rejected") {
    try {
      const userId = e.record.get("userId");
      const productId = e.record.get("productId");
      const adminNotes = e.record.get("admin_notes") || "Your review did not meet our community guidelines.";
      
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
        subject: "Your review could not be published",
        html: "<h2>Your review could not be published</h2><p>Your review for <strong>" + productName + "</strong> could not be published.</p><p><strong>Reason:</strong> " + adminNotes + "</p><p>You can write another review and we'll review it again. Thank you for your understanding!</p>"
      });
      
      $app.newMailClient().send(message);
    } catch (err) {
      console.log("Error sending rejection email: " + err.message);
    }
  }
  
  e.next();
}, "reviews");