/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("trendingSearches");
  collection.indexes.push("CREATE UNIQUE INDEX idx_trendingSearches_searchTerm ON trendingSearches (searchTerm)");
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("trendingSearches");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_trendingSearches_searchTerm"));
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})
