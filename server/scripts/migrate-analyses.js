import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/visa-advisor";

async function migrateAnalyses() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection("analyses");

    // Find all documents that have userId but not user_id
    const oldDocs = await collection.find({ userId: { $exists: true } }).toArray();
    console.log(`\nFound ${oldDocs.length} documents with old schema (userId field)`);

    if (oldDocs.length === 0) {
      console.log("\n✓ No migration needed - all documents already use new schema");
      await mongoose.disconnect();
      return;
    }

    // Show sample document structure
    if (oldDocs.length > 0) {
      console.log("\nSample old document structure:");
      console.log(JSON.stringify(oldDocs[0], null, 2));
    }

    // Perform migration
    console.log("\n🔄 Starting migration...");
    
    let migratedCount = 0;
    let errorCount = 0;

    for (const doc of oldDocs) {
      try {
        const updates = {};
        
        // Rename userId to user_id
        if (doc.userId) {
          updates.user_id = doc.userId;
        }
        
        // Rename formData to form_data
        if (doc.formData) {
          updates.form_data = doc.formData;
        }
        
        // Restructure analysis_results if needed
        if (!doc.analysis_results && (doc.percentage !== undefined || doc.reasoning || doc.improvements)) {
          updates.analysis_results = {
            percentage: doc.percentage,
            summary: doc.summary || "",
            reasoning: doc.reasoning || [],
            improvements: doc.improvements || [],
            explanations: doc.explanations || "",
          };
        }
        
        // Rename timestamps
        if (doc.createdAt) {
          updates.created_at = doc.createdAt;
        }
        if (doc.updatedAt) {
          updates.updated_at = doc.updatedAt;
        }

        // Apply updates
        await collection.updateOne(
          { _id: doc._id },
          { 
            $set: updates,
            $unset: {
              userId: "",
              formData: "",
              ...(updates.analysis_results ? { 
                percentage: "", 
                summary: "", 
                reasoning: "", 
                improvements: "", 
                explanations: "" 
              } : {}),
              createdAt: "",
              updatedAt: "",
            }
          }
        );

        migratedCount++;
        console.log(`✓ Migrated document ${doc._id} (${migratedCount}/${oldDocs.length})`);
      } catch (error) {
        errorCount++;
        console.error(`✗ Error migrating document ${doc._id}:`, error.message);
      }
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   Successfully migrated: ${migratedCount}`);
    console.log(`   Errors: ${errorCount}`);

    // Verify migration
    const newDocs = await collection.find({ user_id: { $exists: true } }).toArray();
    console.log(`\n📊 Total documents with new schema: ${newDocs.length}`);

    // Show sample migrated document
    if (newDocs.length > 0) {
      console.log("\nSample migrated document structure:");
      console.log(JSON.stringify(newDocs[0], null, 2));
    }

    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateAnalyses();
