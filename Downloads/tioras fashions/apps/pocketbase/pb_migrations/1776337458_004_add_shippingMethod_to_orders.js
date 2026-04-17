/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("orders");

  const existing = collection.fields.getByName("shippingMethod");
  if (existing) {
    if (existing.type === "select") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("shippingMethod"); // exists with wrong type, remove first
  }

  collection.fields.add(new SelectField({
    name: "shippingMethod",
    values: ["Standard", "Express", "Overnight"]
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("orders");
    collection.fields.removeByName("shippingMethod");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})
