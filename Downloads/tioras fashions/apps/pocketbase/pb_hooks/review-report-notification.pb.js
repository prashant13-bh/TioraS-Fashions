/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  try {
    const reviewId = e.record.get("reviewId");
    const reason = e.record.get("reason");
    const comment = e.record.get("comment") || "No additional comment";
    
    // Get the reported review
    let reviewContent = "Review not found";
    let productName = "Unknown product";
    try {
      const review = $app.findRecordById("reviews", reviewId);
      if (review) {
        reviewContent = review.get("title") + ": " + review.get("content");
        
        // Get product name
        const productId = review.get("productId");
        try {
          const product = $app.findRecordById("products", productId);
          if (product) {
            productName = product.get("name") || "Unknown product";
          }
        } catch (err) {
          // Product not found
        }
      }
    } catch (err) {
      // Review not found
    }
    
    // Send to admin email (using senderAddress as admin email)
    const adminEmail = $app.settings().meta.senderAddress;
    
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: adminEmail }],
      subject: "Review reported - Action required",
      html: "<h2>A review has been reported</h2><p><strong>Product:</strong> " + productName + "</p><p><strong>Reason:</strong> " + reason + "</p><p><strong>Reporter comment:</strong> " + comment + "</p><p><strong>Review content:</strong></p><blockquote>" + reviewContent + "</blockquote><p><a href='/admin/reviews'>View all reports in admin panel</a></p>"
    });
    
    $app.newMailClient().send(message);
  } catch (err) {
    console.log("Error sending report notification: " + err.message);
  }
  
  e.next();
}, "review_reports");