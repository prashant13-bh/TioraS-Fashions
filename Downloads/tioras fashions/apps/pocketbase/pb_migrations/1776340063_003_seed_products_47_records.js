/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");

  const record0 = new Record(collection);
    record0.set("name", "Classic White T-Shirt");
    record0.set("category", "T-Shirts");
    record0.set("description", "Timeless classic white t-shirt perfect for everyday wear. Made from premium quality cotton.");
    record0.set("price", 299);
    record0.set("stock", 150);
    record0.set("originalPrice", 399);
    record0.set("discountPercentage", 25);
    record0.set("rating", 4.5);
    record0.set("reviewCount", 128);
    record0.set("stockStatus", "In Stock");
    record0.set("stockQuantity", 150);
    record0.set("colorsAvailable", ["White", "Black", "Navy", "Gray", "Red", "Maroon"]);
    record0.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record0.set("material", "100% Cotton");
    record0.set("careInstructions", "Machine wash cold, tumble dry low");
    record0.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record0.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record0.set("customizationOptions", ["Text Printing", "Design Printing", "Embroidery"]);
    record0.set("relatedProducts", ["Premium Cotton T-Shirt", "Striped T-Shirt", "Graphic T-Shirt"]);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    record1.set("name", "Premium Cotton T-Shirt");
    record1.set("category", "T-Shirts");
    record1.set("description", "Ultra-soft premium cotton t-shirt with superior comfort and durability.");
    record1.set("price", 399);
    record1.set("stock", 120);
    record1.set("originalPrice", 499);
    record1.set("discountPercentage", 20);
    record1.set("rating", 4.7);
    record1.set("reviewCount", 95);
    record1.set("stockStatus", "In Stock");
    record1.set("stockQuantity", 120);
    record1.set("colorsAvailable", ["White", "Black", "Navy", "Olive", "Charcoal"]);
    record1.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record1.set("material", "100% Premium Cotton");
    record1.set("careInstructions", "Machine wash cold, tumble dry low, iron on medium heat");
    record1.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record1.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record1.set("customizationOptions", ["Text Printing", "Design Printing", "Embroidery"]);
    record1.set("relatedProducts", ["Classic White T-Shirt", "Fitted T-Shirt", "Pocket T-Shirt"]);
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    record2.set("name", "Oversized T-Shirt");
    record2.set("category", "T-Shirts");
    record2.set("description", "Trendy oversized fit t-shirt for a relaxed and comfortable look.");
    record2.set("price", 449);
    record2.set("stock", 100);
    record2.set("originalPrice", 599);
    record2.set("discountPercentage", 25);
    record2.set("rating", 4.6);
    record2.set("reviewCount", 87);
    record2.set("stockStatus", "In Stock");
    record2.set("stockQuantity", 100);
    record2.set("colorsAvailable", ["White", "Black", "Cream", "Sage Green"]);
    record2.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record2.set("material", "100% Cotton");
    record2.set("careInstructions", "Machine wash cold, tumble dry low");
    record2.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record2.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record2.set("customizationOptions", ["Text Printing", "Design Printing"]);
    record2.set("relatedProducts", ["Vintage T-Shirt", "Graphic T-Shirt"]);
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    record3.set("name", "Vintage T-Shirt");
    record3.set("category", "T-Shirts");
    record3.set("description", "Retro-style vintage t-shirt with a worn-in aesthetic and comfortable fit.");
    record3.set("price", 499);
    record3.set("stock", 85);
    record3.set("originalPrice", 699);
    record3.set("discountPercentage", 28);
    record3.set("rating", 4.4);
    record3.set("reviewCount", 76);
    record3.set("stockStatus", "In Stock");
    record3.set("stockQuantity", 85);
    record3.set("colorsAvailable", ["Cream", "Tan", "Rust", "Olive"]);
    record3.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record3.set("material", "100% Cotton");
    record3.set("careInstructions", "Machine wash cold, tumble dry low, avoid bleach");
    record3.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record3.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record3.set("customizationOptions", ["Design Printing"]);
    record3.set("relatedProducts", ["Oversized T-Shirt", "Graphic T-Shirt"]);
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record4 = new Record(collection);
    record4.set("name", "Graphic T-Shirt");
    record4.set("category", "T-Shirts");
    record4.set("description", "Eye-catching graphic t-shirt with bold designs and vibrant colors.");
    record4.set("price", 549);
    record4.set("stock", 110);
    record4.set("originalPrice", 749);
    record4.set("discountPercentage", 26);
    record4.set("rating", 4.5);
    record4.set("reviewCount", 112);
    record4.set("stockStatus", "In Stock");
    record4.set("stockQuantity", 110);
    record4.set("colorsAvailable", ["Black", "Navy", "White"]);
    record4.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record4.set("material", "100% Cotton");
    record4.set("careInstructions", "Machine wash cold inside out, tumble dry low");
    record4.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record4.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record4.set("customizationOptions", ["Design Printing"]);
    record4.set("relatedProducts", ["Oversized T-Shirt", "Vintage T-Shirt"]);
  try {
    app.save(record4);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record5 = new Record(collection);
    record5.set("name", "Striped T-Shirt");
    record5.set("category", "T-Shirts");
    record5.set("description", "Classic striped t-shirt with timeless appeal and comfortable fit.");
    record5.set("price", 349);
    record5.set("stock", 130);
    record5.set("originalPrice", 449);
    record5.set("discountPercentage", 22);
    record5.set("rating", 4.3);
    record5.set("reviewCount", 68);
    record5.set("stockStatus", "In Stock");
    record5.set("stockQuantity", 130);
    record5.set("colorsAvailable", ["Navy-White", "Black-White", "Red-White"]);
    record5.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record5.set("material", "100% Cotton");
    record5.set("careInstructions", "Machine wash cold, tumble dry low");
    record5.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record5.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record5.set("customizationOptions", ["Text Printing"]);
    record5.set("relatedProducts", ["Classic White T-Shirt", "Fitted T-Shirt"]);
  try {
    app.save(record5);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record6 = new Record(collection);
    record6.set("name", "Fitted T-Shirt");
    record6.set("category", "T-Shirts");
    record6.set("description", "Slim-fit t-shirt that hugs your body for a sleek and modern look.");
    record6.set("price", 329);
    record6.set("stock", 125);
    record6.set("originalPrice", 429);
    record6.set("discountPercentage", 23);
    record6.set("rating", 4.4);
    record6.set("reviewCount", 82);
    record6.set("stockStatus", "In Stock");
    record6.set("stockQuantity", 125);
    record6.set("colorsAvailable", ["White", "Black", "Navy", "Burgundy"]);
    record6.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record6.set("material", "95% Cotton, 5% Spandex");
    record6.set("careInstructions", "Machine wash cold, tumble dry low");
    record6.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record6.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record6.set("customizationOptions", ["Text Printing", "Design Printing"]);
    record6.set("relatedProducts", ["Premium Cotton T-Shirt", "Pocket T-Shirt"]);
  try {
    app.save(record6);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record7 = new Record(collection);
    record7.set("name", "Pocket T-Shirt");
    record7.set("category", "T-Shirts");
    record7.set("description", "Casual t-shirt with a practical front pocket for added style and functionality.");
    record7.set("price", 379);
    record7.set("stock", 115);
    record7.set("originalPrice", 479);
    record7.set("discountPercentage", 20);
    record7.set("rating", 4.2);
    record7.set("reviewCount", 71);
    record7.set("stockStatus", "In Stock");
    record7.set("stockQuantity", 115);
    record7.set("colorsAvailable", ["White", "Black", "Khaki", "Gray"]);
    record7.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record7.set("material", "100% Cotton");
    record7.set("careInstructions", "Machine wash cold, tumble dry low");
    record7.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record7.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record7.set("customizationOptions", ["Text Printing", "Design Printing"]);
    record7.set("relatedProducts", ["Fitted T-Shirt", "Classic White T-Shirt"]);
  try {
    app.save(record7);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record8 = new Record(collection);
    record8.set("name", "Classic Hoodie");
    record8.set("category", "Hoodies");
    record8.set("description", "Comfortable classic hoodie perfect for casual wear and outdoor activities.");
    record8.set("price", 799);
    record8.set("stock", 95);
    record8.set("originalPrice", 999);
    record8.set("discountPercentage", 20);
    record8.set("rating", 4.6);
    record8.set("reviewCount", 156);
    record8.set("stockStatus", "In Stock");
    record8.set("stockQuantity", 95);
    record8.set("colorsAvailable", ["Black", "Navy", "Gray", "Charcoal", "Maroon"]);
    record8.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record8.set("material", "80% Cotton, 20% Polyester");
    record8.set("careInstructions", "Machine wash cold, tumble dry low, avoid bleach");
    record8.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record8.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record8.set("customizationOptions", ["Text Printing", "Design Printing", "Embroidery"]);
    record8.set("relatedProducts", ["Premium Fleece Hoodie", "Zip-up Hoodie"]);
  try {
    app.save(record8);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record9 = new Record(collection);
    record9.set("name", "Premium Fleece Hoodie");
    record9.set("category", "Hoodies");
    record9.set("description", "Ultra-soft premium fleece hoodie with superior warmth and comfort.");
    record9.set("price", 999);
    record9.set("stock", 80);
    record9.set("originalPrice", 1299);
    record9.set("discountPercentage", 23);
    record9.set("rating", 4.8);
    record9.set("reviewCount", 134);
    record9.set("stockStatus", "In Stock");
    record9.set("stockQuantity", 80);
    record9.set("colorsAvailable", ["Black", "Navy", "Cream", "Olive", "Burgundy"]);
    record9.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record9.set("material", "100% Premium Fleece");
    record9.set("careInstructions", "Machine wash cold, tumble dry low, do not iron");
    record9.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record9.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record9.set("customizationOptions", ["Text Printing", "Design Printing", "Embroidery"]);
    record9.set("relatedProducts", ["Classic Hoodie", "Oversized Hoodie"]);
  try {
    app.save(record9);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record10 = new Record(collection);
    record10.set("name", "Oversized Hoodie");
    record10.set("category", "Hoodies");
    record10.set("description", "Trendy oversized hoodie for a relaxed and cozy fit.");
    record10.set("price", 899);
    record10.set("stock", 90);
    record10.set("originalPrice", 1199);
    record10.set("discountPercentage", 25);
    record10.set("rating", 4.5);
    record10.set("reviewCount", 118);
    record10.set("stockStatus", "In Stock");
    record10.set("stockQuantity", 90);
    record10.set("colorsAvailable", ["Black", "Gray", "Cream", "Sage Green"]);
    record10.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record10.set("material", "80% Cotton, 20% Polyester");
    record10.set("careInstructions", "Machine wash cold, tumble dry low");
    record10.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record10.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record10.set("customizationOptions", ["Text Printing", "Design Printing"]);
    record10.set("relatedProducts", ["Classic Hoodie", "Lightweight Hoodie"]);
  try {
    app.save(record10);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record11 = new Record(collection);
    record11.set("name", "Zip-up Hoodie");
    record11.set("category", "Hoodies");
    record11.set("description", "Versatile zip-up hoodie with convenient front zipper for easy wear.");
    record11.set("price", 849);
    record11.set("stock", 85);
    record11.set("originalPrice", 1099);
    record11.set("discountPercentage", 22);
    record11.set("rating", 4.4);
    record11.set("reviewCount", 105);
    record11.set("stockStatus", "In Stock");
    record11.set("stockQuantity", 85);
    record11.set("colorsAvailable", ["Black", "Navy", "Gray", "Maroon"]);
    record11.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record11.set("material", "80% Cotton, 20% Polyester");
    record11.set("careInstructions", "Machine wash cold, tumble dry low");
    record11.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record11.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record11.set("customizationOptions", ["Text Printing", "Design Printing"]);
    record11.set("relatedProducts", ["Classic Hoodie", "Graphic Hoodie"]);
  try {
    app.save(record11);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record12 = new Record(collection);
    record12.set("name", "Graphic Hoodie");
    record12.set("category", "Hoodies");
    record12.set("description", "Bold graphic hoodie with eye-catching designs and vibrant colors.");
    record12.set("price", 949);
    record12.set("stock", 75);
    record12.set("originalPrice", 1249);
    record12.set("discountPercentage", 24);
    record12.set("rating", 4.5);
    record12.set("reviewCount", 92);
    record12.set("stockStatus", "In Stock");
    record12.set("stockQuantity", 75);
    record12.set("colorsAvailable", ["Black", "Navy", "White"]);
    record12.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record12.set("material", "80% Cotton, 20% Polyester");
    record12.set("careInstructions", "Machine wash cold inside out, tumble dry low");
    record12.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record12.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record12.set("customizationOptions", ["Design Printing"]);
    record12.set("relatedProducts", ["Oversized Hoodie", "Zip-up Hoodie"]);
  try {
    app.save(record12);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record13 = new Record(collection);
    record13.set("name", "Lightweight Hoodie");
    record13.set("category", "Hoodies");
    record13.set("description", "Perfect for spring and fall, this lightweight hoodie offers comfort without bulk.");
    record13.set("price", 749);
    record13.set("stock", 100);
    record13.set("originalPrice", 949);
    record13.set("discountPercentage", 21);
    record13.set("rating", 4.3);
    record13.set("reviewCount", 88);
    record13.set("stockStatus", "In Stock");
    record13.set("stockQuantity", 100);
    record13.set("colorsAvailable", ["White", "Black", "Navy", "Khaki"]);
    record13.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record13.set("material", "60% Cotton, 40% Polyester");
    record13.set("careInstructions", "Machine wash cold, tumble dry low");
    record13.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record13.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record13.set("customizationOptions", ["Text Printing", "Design Printing"]);
    record13.set("relatedProducts", ["Classic Hoodie", "Oversized Hoodie"]);
  try {
    app.save(record13);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record14 = new Record(collection);
    record14.set("name", "Casual Button-Up Shirt");
    record14.set("category", "Shirts");
    record14.set("description", "Versatile casual button-up shirt perfect for any occasion.");
    record14.set("price", 599);
    record14.set("stock", 110);
    record14.set("originalPrice", 799);
    record14.set("discountPercentage", 25);
    record14.set("rating", 4.4);
    record14.set("reviewCount", 98);
    record14.set("stockStatus", "In Stock");
    record14.set("stockQuantity", 110);
    record14.set("colorsAvailable", ["White", "Black", "Navy", "Cream", "Olive"]);
    record14.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record14.set("material", "100% Cotton");
    record14.set("careInstructions", "Machine wash warm, tumble dry medium, iron on high heat");
    record14.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record14.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record14.set("customizationOptions", ["Text Printing", "Embroidery"]);
    record14.set("relatedProducts", ["Oxford Shirt", "Linen Shirt"]);
  try {
    app.save(record14);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record15 = new Record(collection);
    record15.set("name", "Oxford Shirt");
    record15.set("category", "Shirts");
    record15.set("description", "Classic oxford cloth shirt with a refined and professional look.");
    record15.set("price", 699);
    record15.set("stock", 95);
    record15.set("originalPrice", 899);
    record15.set("discountPercentage", 22);
    record15.set("rating", 4.5);
    record15.set("reviewCount", 87);
    record15.set("stockStatus", "In Stock");
    record15.set("stockQuantity", 95);
    record15.set("colorsAvailable", ["White", "Light Blue", "Navy", "Cream"]);
    record15.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record15.set("material", "100% Cotton Oxford");
    record15.set("careInstructions", "Machine wash warm, tumble dry medium, iron on high heat");
    record15.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record15.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record15.set("customizationOptions", ["Embroidery"]);
    record15.set("relatedProducts", ["Casual Button-Up Shirt", "Denim Shirt"]);
  try {
    app.save(record15);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record16 = new Record(collection);
    record16.set("name", "Linen Shirt");
    record16.set("category", "Shirts");
    record16.set("description", "Breathable linen shirt ideal for warm weather and casual wear.");
    record16.set("price", 749);
    record16.set("stock", 85);
    record16.set("originalPrice", 999);
    record16.set("discountPercentage", 25);
    record16.set("rating", 4.3);
    record16.set("reviewCount", 76);
    record16.set("stockStatus", "In Stock");
    record16.set("stockQuantity", 85);
    record16.set("colorsAvailable", ["White", "Cream", "Khaki", "Olive"]);
    record16.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record16.set("material", "100% Linen");
    record16.set("careInstructions", "Machine wash cold, tumble dry low, iron on medium heat");
    record16.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record16.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record16.set("customizationOptions", ["Text Printing"]);
    record16.set("relatedProducts", ["Casual Button-Up Shirt", "Silk Shirt"]);
  try {
    app.save(record16);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record17 = new Record(collection);
    record17.set("name", "Denim Shirt");
    record17.set("category", "Shirts");
    record17.set("description", "Durable denim shirt with classic style and timeless appeal.");
    record17.set("price", 799);
    record17.set("stock", 80);
    record17.set("originalPrice", 1099);
    record17.set("discountPercentage", 27);
    record17.set("rating", 4.4);
    record17.set("reviewCount", 94);
    record17.set("stockStatus", "In Stock");
    record17.set("stockQuantity", 80);
    record17.set("colorsAvailable", ["Light Wash", "Medium Wash", "Dark Wash"]);
    record17.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record17.set("material", "100% Denim");
    record17.set("careInstructions", "Machine wash cold inside out, tumble dry low, iron on medium heat");
    record17.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record17.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record17.set("customizationOptions", ["Embroidery"]);
    record17.set("relatedProducts", ["Oxford Shirt", "Flannel Shirt"]);
  try {
    app.save(record17);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record18 = new Record(collection);
    record18.set("name", "Flannel Shirt");
    record18.set("category", "Shirts");
    record18.set("description", "Cozy flannel shirt perfect for layering and casual comfort.");
    record18.set("price", 649);
    record18.set("stock", 100);
    record18.set("originalPrice", 849);
    record18.set("discountPercentage", 23);
    record18.set("rating", 4.2);
    record18.set("reviewCount", 82);
    record18.set("stockStatus", "In Stock");
    record18.set("stockQuantity", 100);
    record18.set("colorsAvailable", ["Red-Black", "Blue-Black", "Green-Black"]);
    record18.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record18.set("material", "100% Cotton Flannel");
    record18.set("careInstructions", "Machine wash warm, tumble dry medium, iron on medium heat");
    record18.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record18.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record18.set("customizationOptions", ["Text Printing"]);
    record18.set("relatedProducts", ["Denim Shirt", "Casual Button-Up Shirt"]);
  try {
    app.save(record18);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record19 = new Record(collection);
    record19.set("name", "Silk Shirt");
    record19.set("category", "Shirts");
    record19.set("description", "Luxurious silk shirt with a smooth finish and elegant appearance.");
    record19.set("price", 999);
    record19.set("stock", 60);
    record19.set("originalPrice", 1399);
    record19.set("discountPercentage", 28);
    record19.set("rating", 4.6);
    record19.set("reviewCount", 71);
    record19.set("stockStatus", "In Stock");
    record19.set("stockQuantity", 60);
    record19.set("colorsAvailable", ["White", "Black", "Navy", "Burgundy", "Gold"]);
    record19.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record19.set("material", "100% Silk");
    record19.set("careInstructions", "Hand wash or dry clean only, do not tumble dry");
    record19.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record19.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record19.set("customizationOptions", ["Embroidery"]);
    record19.set("relatedProducts", ["Oxford Shirt", "Linen Shirt"]);
  try {
    app.save(record19);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record20 = new Record(collection);
    record20.set("name", "Embroidered T-Shirt");
    record20.set("category", "Embroidery");
    record20.set("description", "Premium t-shirt with beautiful embroidered designs.");
    record20.set("price", 599);
    record20.set("stock", 90);
    record20.set("originalPrice", 799);
    record20.set("discountPercentage", 25);
    record20.set("rating", 4.5);
    record20.set("reviewCount", 103);
    record20.set("stockStatus", "In Stock");
    record20.set("stockQuantity", 90);
    record20.set("colorsAvailable", ["White", "Black", "Navy", "Cream"]);
    record20.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record20.set("material", "100% Cotton");
    record20.set("careInstructions", "Machine wash cold inside out, tumble dry low");
    record20.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record20.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record20.set("customizationOptions", ["Embroidery"]);
    record20.set("relatedProducts", ["Embroidered Hoodie", "Embroidered Polo Shirt"]);
  try {
    app.save(record20);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record21 = new Record(collection);
    record21.set("name", "Embroidered Hoodie");
    record21.set("category", "Embroidery");
    record21.set("description", "Cozy hoodie with intricate embroidered details.");
    record21.set("price", 1299);
    record21.set("stock", 70);
    record21.set("originalPrice", 1699);
    record21.set("discountPercentage", 23);
    record21.set("rating", 4.6);
    record21.set("reviewCount", 87);
    record21.set("stockStatus", "In Stock");
    record21.set("stockQuantity", 70);
    record21.set("colorsAvailable", ["Black", "Navy", "Gray", "Maroon"]);
    record21.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record21.set("material", "80% Cotton, 20% Polyester");
    record21.set("careInstructions", "Machine wash cold inside out, tumble dry low");
    record21.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record21.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record21.set("customizationOptions", ["Embroidery"]);
    record21.set("relatedProducts", ["Embroidered T-Shirt", "Embroidered Jacket"]);
  try {
    app.save(record21);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record22 = new Record(collection);
    record22.set("name", "Embroidered Polo Shirt");
    record22.set("category", "Embroidery");
    record22.set("description", "Elegant polo shirt with embroidered logo or design.");
    record22.set("price", 799);
    record22.set("stock", 85);
    record22.set("originalPrice", 1099);
    record22.set("discountPercentage", 27);
    record22.set("rating", 4.4);
    record22.set("reviewCount", 76);
    record22.set("stockStatus", "In Stock");
    record22.set("stockQuantity", 85);
    record22.set("colorsAvailable", ["White", "Black", "Navy", "Olive"]);
    record22.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record22.set("material", "100% Cotton Pique");
    record22.set("careInstructions", "Machine wash warm, tumble dry medium, iron on high heat");
    record22.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record22.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record22.set("customizationOptions", ["Embroidery"]);
    record22.set("relatedProducts", ["Embroidered T-Shirt", "Embroidered Cap"]);
  try {
    app.save(record22);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record23 = new Record(collection);
    record23.set("name", "Embroidered Cap");
    record23.set("category", "Embroidery");
    record23.set("description", "Stylish cap with embroidered logo or design.");
    record23.set("price", 299);
    record23.set("stock", 150);
    record23.set("originalPrice", 399);
    record23.set("discountPercentage", 25);
    record23.set("rating", 4.2);
    record23.set("reviewCount", 64);
    record23.set("stockStatus", "In Stock");
    record23.set("stockQuantity", 150);
    record23.set("colorsAvailable", ["Black", "Navy", "White", "Red"]);
    record23.set("sizesAvailable", ["One Size"]);
    record23.set("material", "100% Cotton");
    record23.set("careInstructions", "Hand wash only, air dry");
    record23.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record23.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record23.set("customizationOptions", ["Embroidery"]);
    record23.set("relatedProducts", ["Embroidered Polo Shirt", "Embroidered Bag"]);
  try {
    app.save(record23);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record24 = new Record(collection);
    record24.set("name", "Embroidered Jacket");
    record24.set("category", "Embroidery");
    record24.set("description", "Premium jacket with beautiful embroidered details.");
    record24.set("price", 1599);
    record24.set("stock", 50);
    record24.set("originalPrice", 2099);
    record24.set("discountPercentage", 23);
    record24.set("rating", 4.5);
    record24.set("reviewCount", 58);
    record24.set("stockStatus", "In Stock");
    record24.set("stockQuantity", 50);
    record24.set("colorsAvailable", ["Black", "Navy", "Charcoal"]);
    record24.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record24.set("material", "100% Polyester");
    record24.set("careInstructions", "Dry clean only");
    record24.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record24.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record24.set("customizationOptions", ["Embroidery"]);
    record24.set("relatedProducts", ["Embroidered Hoodie", "Embroidered T-Shirt"]);
  try {
    app.save(record24);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record25 = new Record(collection);
    record25.set("name", "Embroidered Bag");
    record25.set("category", "Embroidery");
    record25.set("description", "Stylish bag with embroidered design.");
    record25.set("price", 499);
    record25.set("stock", 120);
    record25.set("originalPrice", 699);
    record25.set("discountPercentage", 28);
    record25.set("rating", 4.3);
    record25.set("reviewCount", 72);
    record25.set("stockStatus", "In Stock");
    record25.set("stockQuantity", 120);
    record25.set("colorsAvailable", ["Black", "Navy", "Cream"]);
    record25.set("sizesAvailable", ["One Size"]);
    record25.set("material", "Canvas with Embroidery");
    record25.set("careInstructions", "Hand wash only, air dry");
    record25.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record25.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record25.set("customizationOptions", ["Embroidery"]);
    record25.set("relatedProducts", ["Embroidered Cap", "Embroidered Polo Shirt"]);
  try {
    app.save(record25);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record26 = new Record(collection);
    record26.set("name", "Screen Printed T-Shirt");
    record26.set("category", "Printing");
    record26.set("description", "T-shirt with vibrant screen printed design.");
    record26.set("price", 449);
    record26.set("stock", 120);
    record26.set("originalPrice", 599);
    record26.set("discountPercentage", 25);
    record26.set("rating", 4.4);
    record26.set("reviewCount", 95);
    record26.set("stockStatus", "In Stock");
    record26.set("stockQuantity", 120);
    record26.set("colorsAvailable", ["White", "Black", "Navy", "Red"]);
    record26.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record26.set("material", "100% Cotton");
    record26.set("careInstructions", "Machine wash cold inside out, tumble dry low");
    record26.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record26.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record26.set("customizationOptions", ["Design Printing"]);
    record26.set("relatedProducts", ["DTG Printed T-Shirt", "Sublimation Printed T-Shirt"]);
  try {
    app.save(record26);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record27 = new Record(collection);
    record27.set("name", "DTG Printed T-Shirt");
    record27.set("category", "Printing");
    record27.set("description", "T-shirt with detailed DTG (Direct-to-Garment) printed design.");
    record27.set("price", 549);
    record27.set("stock", 100);
    record27.set("originalPrice", 749);
    record27.set("discountPercentage", 26);
    record27.set("rating", 4.5);
    record27.set("reviewCount", 88);
    record27.set("stockStatus", "In Stock");
    record27.set("stockQuantity", 100);
    record27.set("colorsAvailable", ["White", "Black", "Navy"]);
    record27.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record27.set("material", "100% Cotton");
    record27.set("careInstructions", "Machine wash cold inside out, tumble dry low");
    record27.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record27.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record27.set("customizationOptions", ["Design Printing"]);
    record27.set("relatedProducts", ["Screen Printed T-Shirt", "Sublimation Printed T-Shirt"]);
  try {
    app.save(record27);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record28 = new Record(collection);
    record28.set("name", "Sublimation Printed T-Shirt");
    record28.set("category", "Printing");
    record28.set("description", "T-shirt with full-color sublimation printed design.");
    record28.set("price", 599);
    record28.set("stock", 90);
    record28.set("originalPrice", 799);
    record28.set("discountPercentage", 25);
    record28.set("rating", 4.6);
    record28.set("reviewCount", 82);
    record28.set("stockStatus", "In Stock");
    record28.set("stockQuantity", 90);
    record28.set("colorsAvailable", ["White", "Light Gray"]);
    record28.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record28.set("material", "100% Polyester");
    record28.set("careInstructions", "Machine wash cold inside out, tumble dry low");
    record28.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record28.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record28.set("customizationOptions", ["Design Printing"]);
    record28.set("relatedProducts", ["DTG Printed T-Shirt", "Screen Printed T-Shirt"]);
  try {
    app.save(record28);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record29 = new Record(collection);
    record29.set("name", "Screen Printed Hoodie");
    record29.set("category", "Printing");
    record29.set("description", "Hoodie with bold screen printed design.");
    record29.set("price", 999);
    record29.set("stock", 75);
    record29.set("originalPrice", 1299);
    record29.set("discountPercentage", 23);
    record29.set("rating", 4.5);
    record29.set("reviewCount", 76);
    record29.set("stockStatus", "In Stock");
    record29.set("stockQuantity", 75);
    record29.set("colorsAvailable", ["Black", "Navy", "Gray"]);
    record29.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record29.set("material", "80% Cotton, 20% Polyester");
    record29.set("careInstructions", "Machine wash cold inside out, tumble dry low");
    record29.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record29.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record29.set("customizationOptions", ["Design Printing"]);
    record29.set("relatedProducts", ["Screen Printed T-Shirt", "All-Over Printed Shirt"]);
  try {
    app.save(record29);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record30 = new Record(collection);
    record30.set("name", "All-Over Printed Shirt");
    record30.set("category", "Printing");
    record30.set("description", "Shirt with all-over printed pattern design.");
    record30.set("price", 749);
    record30.set("stock", 85);
    record30.set("originalPrice", 999);
    record30.set("discountPercentage", 25);
    record30.set("rating", 4.3);
    record30.set("reviewCount", 68);
    record30.set("stockStatus", "In Stock");
    record30.set("stockQuantity", 85);
    record30.set("colorsAvailable", ["White", "Black", "Navy"]);
    record30.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record30.set("material", "100% Cotton");
    record30.set("careInstructions", "Machine wash cold inside out, tumble dry low");
    record30.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record30.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record30.set("customizationOptions", ["Design Printing"]);
    record30.set("relatedProducts", ["Screen Printed Hoodie", "Printed Tote Bag"]);
  try {
    app.save(record30);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record31 = new Record(collection);
    record31.set("name", "Printed Tote Bag");
    record31.set("category", "Printing");
    record31.set("description", "Stylish tote bag with printed design.");
    record31.set("price", 399);
    record31.set("stock", 130);
    record31.set("originalPrice", 549);
    record31.set("discountPercentage", 27);
    record31.set("rating", 4.2);
    record31.set("reviewCount", 81);
    record31.set("stockStatus", "In Stock");
    record31.set("stockQuantity", 130);
    record31.set("colorsAvailable", ["White", "Black", "Navy"]);
    record31.set("sizesAvailable", ["One Size"]);
    record31.set("material", "Canvas");
    record31.set("careInstructions", "Hand wash only, air dry");
    record31.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record31.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record31.set("customizationOptions", ["Design Printing"]);
    record31.set("relatedProducts", ["All-Over Printed Shirt", "Screen Printed Hoodie"]);
  try {
    app.save(record31);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record32 = new Record(collection);
    record32.set("name", "Classic Sweatshirt");
    record32.set("category", "Sweatshirts");
    record32.set("description", "Comfortable classic sweatshirt for everyday wear.");
    record32.set("price", 549);
    record32.set("stock", 110);
    record32.set("originalPrice", 749);
    record32.set("discountPercentage", 26);
    record32.set("rating", 4.4);
    record32.set("reviewCount", 92);
    record32.set("stockStatus", "In Stock");
    record32.set("stockQuantity", 110);
    record32.set("colorsAvailable", ["Black", "Navy", "Gray", "Maroon"]);
    record32.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record32.set("material", "80% Cotton, 20% Polyester");
    record32.set("careInstructions", "Machine wash cold, tumble dry low");
    record32.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record32.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record32.set("customizationOptions", ["Text Printing", "Design Printing"]);
    record32.set("relatedProducts", ["Premium Sweatshirt", "Oversized Sweatshirt"]);
  try {
    app.save(record32);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record33 = new Record(collection);
    record33.set("name", "Premium Sweatshirt");
    record33.set("category", "Sweatshirts");
    record33.set("description", "High-quality sweatshirt with superior comfort and durability.");
    record33.set("price", 649);
    record33.set("stock", 95);
    record33.set("originalPrice", 899);
    record33.set("discountPercentage", 27);
    record33.set("rating", 4.5);
    record33.set("reviewCount", 85);
    record33.set("stockStatus", "In Stock");
    record33.set("stockQuantity", 95);
    record33.set("colorsAvailable", ["Black", "Navy", "Cream", "Olive"]);
    record33.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record33.set("material", "100% Cotton");
    record33.set("careInstructions", "Machine wash cold, tumble dry low");
    record33.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record33.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record33.set("customizationOptions", ["Text Printing", "Design Printing", "Embroidery"]);
    record33.set("relatedProducts", ["Classic Sweatshirt", "Graphic Sweatshirt"]);
  try {
    app.save(record33);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record34 = new Record(collection);
    record34.set("name", "Oversized Sweatshirt");
    record34.set("category", "Sweatshirts");
    record34.set("description", "Trendy oversized sweatshirt for a relaxed fit.");
    record34.set("price", 599);
    record34.set("stock", 100);
    record34.set("originalPrice", 799);
    record34.set("discountPercentage", 25);
    record34.set("rating", 4.3);
    record34.set("reviewCount", 78);
    record34.set("stockStatus", "In Stock");
    record34.set("stockQuantity", 100);
    record34.set("colorsAvailable", ["White", "Black", "Gray", "Sage Green"]);
    record34.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record34.set("material", "80% Cotton, 20% Polyester");
    record34.set("careInstructions", "Machine wash cold, tumble dry low");
    record34.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record34.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record34.set("customizationOptions", ["Text Printing", "Design Printing"]);
    record34.set("relatedProducts", ["Classic Sweatshirt", "Premium Sweatshirt"]);
  try {
    app.save(record34);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record35 = new Record(collection);
    record35.set("name", "Graphic Sweatshirt");
    record35.set("category", "Sweatshirts");
    record35.set("description", "Sweatshirt with bold graphic design.");
    record35.set("price", 699);
    record35.set("stock", 85);
    record35.set("originalPrice", 949);
    record35.set("discountPercentage", 26);
    record35.set("rating", 4.4);
    record35.set("reviewCount", 88);
    record35.set("stockStatus", "In Stock");
    record35.set("stockQuantity", 85);
    record35.set("colorsAvailable", ["Black", "Navy", "White"]);
    record35.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record35.set("material", "80% Cotton, 20% Polyester");
    record35.set("careInstructions", "Machine wash cold inside out, tumble dry low");
    record35.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record35.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record35.set("customizationOptions", ["Design Printing"]);
    record35.set("relatedProducts", ["Premium Sweatshirt", "Oversized Sweatshirt"]);
  try {
    app.save(record35);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record36 = new Record(collection);
    record36.set("name", "Lightweight Sweatshirt");
    record36.set("category", "Sweatshirts");
    record36.set("description", "Perfect for layering, this lightweight sweatshirt offers comfort.");
    record36.set("price", 499);
    record36.set("stock", 105);
    record36.set("originalPrice", 699);
    record36.set("discountPercentage", 28);
    record36.set("rating", 4.2);
    record36.set("reviewCount", 72);
    record36.set("stockStatus", "In Stock");
    record36.set("stockQuantity", 105);
    record36.set("colorsAvailable", ["White", "Black", "Navy", "Khaki"]);
    record36.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record36.set("material", "60% Cotton, 40% Polyester");
    record36.set("careInstructions", "Machine wash cold, tumble dry low");
    record36.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record36.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record36.set("customizationOptions", ["Text Printing", "Design Printing"]);
    record36.set("relatedProducts", ["Classic Sweatshirt", "Oversized Sweatshirt"]);
  try {
    app.save(record36);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record37 = new Record(collection);
    record37.set("name", "Classic Tank Top");
    record37.set("category", "Tank Tops");
    record37.set("description", "Essential classic tank top for warm weather.");
    record37.set("price", 199);
    record37.set("stock", 150);
    record37.set("originalPrice", 299);
    record37.set("discountPercentage", 33);
    record37.set("rating", 4.3);
    record37.set("reviewCount", 105);
    record37.set("stockStatus", "In Stock");
    record37.set("stockQuantity", 150);
    record37.set("colorsAvailable", ["White", "Black", "Navy", "Red", "Gray"]);
    record37.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record37.set("material", "100% Cotton");
    record37.set("careInstructions", "Machine wash cold, tumble dry low");
    record37.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record37.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record37.set("customizationOptions", ["Text Printing", "Design Printing"]);
    record37.set("relatedProducts", ["Premium Tank Top", "Graphic Tank Top"]);
  try {
    app.save(record37);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record38 = new Record(collection);
    record38.set("name", "Premium Tank Top");
    record38.set("category", "Tank Tops");
    record38.set("description", "High-quality tank top with superior comfort.");
    record38.set("price", 249);
    record38.set("stock", 130);
    record38.set("originalPrice", 349);
    record38.set("discountPercentage", 28);
    record38.set("rating", 4.4);
    record38.set("reviewCount", 92);
    record38.set("stockStatus", "In Stock");
    record38.set("stockQuantity", 130);
    record38.set("colorsAvailable", ["White", "Black", "Navy", "Olive"]);
    record38.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record38.set("material", "100% Premium Cotton");
    record38.set("careInstructions", "Machine wash cold, tumble dry low");
    record38.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record38.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record38.set("customizationOptions", ["Text Printing", "Design Printing"]);
    record38.set("relatedProducts", ["Classic Tank Top", "Fitted Tank Top"]);
  try {
    app.save(record38);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record39 = new Record(collection);
    record39.set("name", "Fitted Tank Top");
    record39.set("category", "Tank Tops");
    record39.set("description", "Slim-fit tank top that hugs your body.");
    record39.set("price", 229);
    record39.set("stock", 120);
    record39.set("originalPrice", 329);
    record39.set("discountPercentage", 30);
    record39.set("rating", 4.2);
    record39.set("reviewCount", 78);
    record39.set("stockStatus", "In Stock");
    record39.set("stockQuantity", 120);
    record39.set("colorsAvailable", ["White", "Black", "Navy", "Burgundy"]);
    record39.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record39.set("material", "95% Cotton, 5% Spandex");
    record39.set("careInstructions", "Machine wash cold, tumble dry low");
    record39.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record39.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record39.set("customizationOptions", ["Text Printing", "Design Printing"]);
    record39.set("relatedProducts", ["Premium Tank Top", "Graphic Tank Top"]);
  try {
    app.save(record39);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record40 = new Record(collection);
    record40.set("name", "Graphic Tank Top");
    record40.set("category", "Tank Tops");
    record40.set("description", "Tank top with eye-catching graphic design.");
    record40.set("price", 279);
    record40.set("stock", 110);
    record40.set("originalPrice", 399);
    record40.set("discountPercentage", 30);
    record40.set("rating", 4.3);
    record40.set("reviewCount", 85);
    record40.set("stockStatus", "In Stock");
    record40.set("stockQuantity", 110);
    record40.set("colorsAvailable", ["Black", "Navy", "White"]);
    record40.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record40.set("material", "100% Cotton");
    record40.set("careInstructions", "Machine wash cold inside out, tumble dry low");
    record40.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record40.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record40.set("customizationOptions", ["Design Printing"]);
    record40.set("relatedProducts", ["Classic Tank Top", "Premium Tank Top"]);
  try {
    app.save(record40);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record41 = new Record(collection);
    record41.set("name", "Oversized Tank Top");
    record41.set("category", "Tank Tops");
    record41.set("description", "Trendy oversized tank top for a relaxed fit.");
    record41.set("price", 259);
    record41.set("stock", 100);
    record41.set("originalPrice", 359);
    record41.set("discountPercentage", 27);
    record41.set("rating", 4.1);
    record41.set("reviewCount", 68);
    record41.set("stockStatus", "In Stock");
    record41.set("stockQuantity", 100);
    record41.set("colorsAvailable", ["White", "Black", "Cream", "Sage Green"]);
    record41.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record41.set("material", "100% Cotton");
    record41.set("careInstructions", "Machine wash cold, tumble dry low");
    record41.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record41.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record41.set("customizationOptions", ["Text Printing", "Design Printing"]);
    record41.set("relatedProducts", ["Classic Tank Top", "Fitted Tank Top"]);
  try {
    app.save(record41);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record42 = new Record(collection);
    record42.set("name", "Classic Polo Shirt");
    record42.set("category", "Polo Shirts");
    record42.set("description", "Timeless classic polo shirt for casual and semi-formal wear.");
    record42.set("price", 449);
    record42.set("stock", 115);
    record42.set("originalPrice", 599);
    record42.set("discountPercentage", 25);
    record42.set("rating", 4.4);
    record42.set("reviewCount", 98);
    record42.set("stockStatus", "In Stock");
    record42.set("stockQuantity", 115);
    record42.set("colorsAvailable", ["White", "Black", "Navy", "Red", "Olive"]);
    record42.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record42.set("material", "100% Cotton Pique");
    record42.set("careInstructions", "Machine wash warm, tumble dry medium, iron on high heat");
    record42.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record42.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record42.set("customizationOptions", ["Text Printing", "Embroidery"]);
    record42.set("relatedProducts", ["Premium Polo Shirt", "Striped Polo Shirt"]);
  try {
    app.save(record42);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record43 = new Record(collection);
    record43.set("name", "Premium Polo Shirt");
    record43.set("category", "Polo Shirts");
    record43.set("description", "High-quality polo shirt with superior comfort and durability.");
    record43.set("price", 549);
    record43.set("stock", 95);
    record43.set("originalPrice", 749);
    record43.set("discountPercentage", 26);
    record43.set("rating", 4.5);
    record43.set("reviewCount", 87);
    record43.set("stockStatus", "In Stock");
    record43.set("stockQuantity", 95);
    record43.set("colorsAvailable", ["White", "Black", "Navy", "Cream", "Olive"]);
    record43.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record43.set("material", "100% Premium Cotton Pique");
    record43.set("careInstructions", "Machine wash warm, tumble dry medium, iron on high heat");
    record43.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record43.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record43.set("customizationOptions", ["Text Printing", "Embroidery"]);
    record43.set("relatedProducts", ["Classic Polo Shirt", "Fitted Polo Shirt"]);
  try {
    app.save(record43);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record44 = new Record(collection);
    record44.set("name", "Striped Polo Shirt");
    record44.set("category", "Polo Shirts");
    record44.set("description", "Classic striped polo shirt with timeless appeal.");
    record44.set("price", 499);
    record44.set("stock", 105);
    record44.set("originalPrice", 649);
    record44.set("discountPercentage", 23);
    record44.set("rating", 4.3);
    record44.set("reviewCount", 76);
    record44.set("stockStatus", "In Stock");
    record44.set("stockQuantity", 105);
    record44.set("colorsAvailable", ["Navy-White", "Black-White", "Red-White"]);
    record44.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record44.set("material", "100% Cotton Pique");
    record44.set("careInstructions", "Machine wash warm, tumble dry medium, iron on high heat");
    record44.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record44.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record44.set("customizationOptions", ["Embroidery"]);
    record44.set("relatedProducts", ["Classic Polo Shirt", "Premium Polo Shirt"]);
  try {
    app.save(record44);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record45 = new Record(collection);
    record45.set("name", "Fitted Polo Shirt");
    record45.set("category", "Polo Shirts");
    record45.set("description", "Slim-fit polo shirt for a modern and sleek look.");
    record45.set("price", 479);
    record45.set("stock", 100);
    record45.set("originalPrice", 629);
    record45.set("discountPercentage", 23);
    record45.set("rating", 4.2);
    record45.set("reviewCount", 82);
    record45.set("stockStatus", "In Stock");
    record45.set("stockQuantity", 100);
    record45.set("colorsAvailable", ["White", "Black", "Navy", "Burgundy"]);
    record45.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record45.set("material", "95% Cotton, 5% Spandex Pique");
    record45.set("careInstructions", "Machine wash warm, tumble dry medium, iron on high heat");
    record45.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record45.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record45.set("customizationOptions", ["Text Printing", "Embroidery"]);
    record45.set("relatedProducts", ["Premium Polo Shirt", "Classic Polo Shirt"]);
  try {
    app.save(record45);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record46 = new Record(collection);
    record46.set("name", "Oversized Polo Shirt");
    record46.set("category", "Polo Shirts");
    record46.set("description", "Trendy oversized polo shirt for a relaxed fit.");
    record46.set("price", 529);
    record46.set("stock", 90);
    record46.set("originalPrice", 699);
    record46.set("discountPercentage", 24);
    record46.set("rating", 4.1);
    record46.set("reviewCount", 71);
    record46.set("stockStatus", "In Stock");
    record46.set("stockQuantity", 90);
    record46.set("colorsAvailable", ["White", "Black", "Navy", "Cream"]);
    record46.set("sizesAvailable", ["XS", "S", "M", "L", "XL", "XXL"]);
    record46.set("material", "100% Cotton Pique");
    record46.set("careInstructions", "Machine wash warm, tumble dry medium, iron on high heat");
    record46.set("shippingInfo", "Free shipping on orders above \u20b9500. Standard delivery 3-5 business days.");
    record46.set("returnPolicy", "30-day return policy. Product must be unused and in original packaging.");
    record46.set("customizationOptions", ["Text Printing", "Embroidery"]);
    record46.set("relatedProducts", ["Classic Polo Shirt", "Striped Polo Shirt"]);
  try {
    app.save(record46);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})
