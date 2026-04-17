/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("blogPosts");

  const record0 = new Record(collection);
    record0.set("title", "Summer Fashion Trends 2024");
    record0.set("slug", "summer-fashion-trends-2024");
    record0.set("excerpt", "Discover the hottest fashion trends for summer 2024. From vibrant colors to lightweight fabrics, learn what's in style this season.");
    record0.set("content", "Summer 2024 brings exciting fashion trends that blend comfort with style. Discover the hottest fashion trends for summer 2024. From vibrant colors to lightweight fabrics, learn what's in style this season. Pastel colors, oversized silhouettes, and sustainable materials are dominating the summer fashion scene. Whether you're heading to the beach or a casual brunch, these trends will keep you looking fresh and fashionable.");
    record0.set("category", "Fashion Tips");
    record0.set("author", "TioraS Team");
    record0.set("publishedDate", "2024-06-15");
    record0.set("readTime", 5);
    record0.set("status", "published");
    record0.set("tags", ["summer", "trends", "fashion", "2024", "style"]);
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
    record1.set("title", "How to Style Your Wardrobe");
    record1.set("slug", "how-to-style-your-wardrobe");
    record1.set("excerpt", "Master the art of wardrobe styling with our comprehensive guide. Learn how to mix and match pieces to create endless outfit combinations.");
    record1.set("content", "Styling your wardrobe doesn't have to be complicated. Master the art of wardrobe styling with our comprehensive guide. Learn how to mix and match pieces to create endless outfit combinations. Start with neutral basics, add statement pieces, and accessorize strategically. Our expert tips will help you build a versatile wardrobe that works for any occasion.");
    record1.set("category", "Style Guides");
    record1.set("author", "TioraS Team");
    record1.set("publishedDate", "2024-05-20");
    record1.set("readTime", 7);
    record1.set("status", "published");
    record1.set("tags", ["styling", "wardrobe", "fashion", "tips", "basics"]);
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
    record2.set("title", "Sustainable Fashion Guide");
    record2.set("slug", "sustainable-fashion-guide");
    record2.set("excerpt", "Learn how to make eco-friendly fashion choices without compromising on style. Discover sustainable brands and practices that matter.");
    record2.set("content", "Sustainable fashion is more than a trend\u2014it's a responsibility. Learn how to make eco-friendly fashion choices without compromising on style. Discover sustainable brands and practices that matter. From organic cotton to recycled materials, explore how you can build a sustainable wardrobe. Every purchase counts towards a better future for our planet.");
    record2.set("category", "Sustainability");
    record2.set("author", "TioraS Team");
    record2.set("publishedDate", "2024-07-10");
    record2.set("readTime", 6);
    record2.set("status", "published");
    record2.set("tags", ["sustainable", "eco-friendly", "fashion", "environment", "ethical"]);
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
    record3.set("title", "Color Matching Tips");
    record3.set("slug", "color-matching-tips");
    record3.set("excerpt", "Unlock the secrets of color coordination. Learn which colors work best together and how to create harmonious outfits.");
    record3.set("content", "Color matching is an essential skill for any fashion enthusiast. Unlock the secrets of color coordination. Learn which colors work best together and how to create harmonious outfits. Understand color theory, complementary colors, and how to use them to enhance your personal style. With these tips, you'll never have a fashion mishap again.");
    record3.set("category", "Fashion Tips");
    record3.set("author", "TioraS Team");
    record3.set("publishedDate", "2024-04-25");
    record3.set("readTime", 4);
    record3.set("status", "published");
    record3.set("tags", ["color", "matching", "coordination", "fashion", "style"]);
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
    record4.set("title", "Fabric Care Guide");
    record4.set("slug", "fabric-care-guide");
    record4.set("excerpt", "Extend the life of your favorite clothes with proper fabric care. Learn washing, drying, and storage tips for different materials.");
    record4.set("content", "Taking care of your clothes is crucial for longevity. Extend the life of your favorite clothes with proper fabric care. Learn washing, drying, and storage tips for different materials. From delicate silks to sturdy denims, each fabric requires specific care. Our comprehensive guide covers everything you need to know to keep your wardrobe looking fresh.");
    record4.set("category", "Fashion Tips");
    record4.set("author", "TioraS Team");
    record4.set("publishedDate", "2024-03-30");
    record4.set("readTime", 5);
    record4.set("status", "published");
    record4.set("tags", ["fabric", "care", "washing", "maintenance", "clothing"]);
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
    record5.set("title", "Fashion for Different Body Types");
    record5.set("slug", "fashion-for-different-body-types");
    record5.set("excerpt", "Celebrate your unique body shape with our styling guide. Discover cuts, silhouettes, and styles that flatter your figure.");
    record5.set("content", "Fashion should be inclusive and flattering for everyone. Celebrate your unique body shape with our styling guide. Discover cuts, silhouettes, and styles that flatter your figure. Whether you're pear-shaped, apple-shaped, or anything in between, we have styling tips that work for you. Confidence is the best accessory, and the right clothes can help you feel amazing.");
    record5.set("category", "Style Guides");
    record5.set("author", "TioraS Team");
    record5.set("publishedDate", "2024-06-01");
    record5.set("readTime", 8);
    record5.set("status", "published");
    record5.set("tags", ["body-type", "styling", "fashion", "flattering", "confidence"]);
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
    record6.set("title", "Accessory Styling Tips");
    record6.set("slug", "accessory-styling-tips");
    record6.set("excerpt", "Master the art of accessorizing. Learn how to choose and combine accessories to elevate any outfit.");
    record6.set("content", "Accessories are the finishing touch that transforms an outfit. Master the art of accessorizing. Learn how to choose and combine accessories to elevate any outfit. From jewelry to bags to scarves, discover how to balance and coordinate your accessories. Small details make a big difference in your overall look.");
    record6.set("category", "Style Guides");
    record6.set("author", "TioraS Team");
    record6.set("publishedDate", "2024-05-10");
    record6.set("readTime", 4);
    record6.set("status", "published");
    record6.set("tags", ["accessories", "jewelry", "styling", "fashion", "details"]);
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
    record7.set("title", "Seasonal Fashion Guide");
    record7.set("slug", "seasonal-fashion-guide");
    record7.set("excerpt", "Navigate fashion through every season. Learn what to wear and how to adapt your style for spring, summer, fall, and winter.");
    record7.set("content", "Each season brings unique fashion opportunities and challenges. Navigate fashion through every season. Learn what to wear and how to adapt your style for spring, summer, fall, and winter. From layering techniques to seasonal color palettes, our guide covers everything you need to stay stylish year-round. Embrace the changes and have fun with seasonal fashion.");
    record7.set("category", "Trends");
    record7.set("author", "TioraS Team");
    record7.set("publishedDate", "2024-02-14");
    record7.set("readTime", 6);
    record7.set("status", "published");
    record7.set("tags", ["seasonal", "fashion", "spring", "summer", "fall", "winter"]);
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
    record8.set("title", "Interview with Fashion Designer");
    record8.set("slug", "interview-with-fashion-designer");
    record8.set("excerpt", "Get exclusive insights from a renowned fashion designer. Learn about their creative process, inspiration, and vision for the future.");
    record8.set("content", "We had the pleasure of interviewing a renowned fashion designer who shares their creative journey. Get exclusive insights from a renowned fashion designer. Learn about their creative process, inspiration, and vision for the future. Discover what drives their designs and how they stay ahead of trends. This exclusive interview offers valuable perspectives on the fashion industry.");
    record8.set("category", "Customer Stories");
    record8.set("author", "TioraS Team");
    record8.set("publishedDate", "2024-07-20");
    record8.set("readTime", 7);
    record8.set("status", "published");
    record8.set("tags", ["interview", "designer", "fashion", "creative", "inspiration"]);
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
    record9.set("title", "Behind the Scenes at TioraS");
    record9.set("slug", "behind-the-scenes-at-tioras");
    record9.set("excerpt", "Take a peek into our creative studio. See how we design, produce, and bring your favorite pieces to life.");
    record9.set("content", "Ever wondered how your favorite TioraS pieces are made? Take a peek into our creative studio. See how we design, produce, and bring your favorite pieces to life. From initial sketches to final production, we share our process with you. Our team is passionate about creating quality, stylish pieces that you'll love.");
    record9.set("category", "Behind the Scenes");
    record9.set("author", "TioraS Team");
    record9.set("publishedDate", "2024-08-05");
    record9.set("readTime", 5);
    record9.set("status", "published");
    record9.set("tags", ["behind-the-scenes", "production", "design", "tioras", "process"]);
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
    record10.set("title", "Eco-Friendly Fashion Choices");
    record10.set("slug", "eco-friendly-fashion-choices");
    record10.set("excerpt", "Make a positive impact with your fashion choices. Learn about eco-friendly materials, ethical brands, and sustainable practices.");
    record10.set("content", "Your fashion choices have an impact on the environment. Make a positive impact with your fashion choices. Learn about eco-friendly materials, ethical brands, and sustainable practices. From organic cotton to recycled polyester, discover alternatives that are better for the planet. Join the sustainable fashion movement and be part of the solution.");
    record10.set("category", "Sustainability");
    record10.set("author", "TioraS Team");
    record10.set("publishedDate", "2024-07-15");
    record10.set("readTime", 6);
    record10.set("status", "published");
    record10.set("tags", ["eco-friendly", "sustainable", "ethical", "environment", "choices"]);
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
    record11.set("title", "Winter Fashion Essentials");
    record11.set("slug", "winter-fashion-essentials");
    record11.set("excerpt", "Stay warm and stylish this winter. Discover essential pieces and layering techniques for the cold season.");
    record11.set("content", "Winter fashion is all about staying warm without sacrificing style. Stay warm and stylish this winter. Discover essential pieces and layering techniques for the cold season. From cozy sweaters to elegant coats, we cover the must-have items for your winter wardrobe. Learn how to layer effectively and create chic winter outfits.");
    record11.set("category", "Trends");
    record11.set("author", "TioraS Team");
    record11.set("publishedDate", "2024-01-20");
    record11.set("readTime", 5);
    record11.set("status", "published");
    record11.set("tags", ["winter", "essentials", "fashion", "layering", "warm"]);
  try {
    app.save(record11);
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
