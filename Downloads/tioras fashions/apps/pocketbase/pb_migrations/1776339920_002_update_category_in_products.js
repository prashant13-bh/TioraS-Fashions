/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");
  const field = collection.fields.getByName("category");
  field.values = ["T-Shirts", "Hoodies", "Shirts", "Embroidery", "Printing", "Sweatshirts", "Tank Tops", "Polo Shirts"];
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("products");
  const field = collection.fields.getByName("category");
  if (!field) { console.log("Field not found, skipping revert"); return; }
  field.values = ["T-shirts", "Hoodies", "Shirts", "Caps", "Bags", "Saree Blouse Embroidery", "School/Company Uniforms", "Mugs/Keychains/Gifts/Stickers", "Blank Materials"];
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection or field not found, skipping revert");
      return;
    }
    throw e;
  }
})
