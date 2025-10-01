import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SubUser from '@/lib/models/SubUser';

// POST /api/debug/migrate-subuser-access - Migrate existing subuser access fields
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Find all subusers with old access fields
    const subusers = await SubUser.find({
      $or: [
        { 'access.sales': { $exists: true } },
        { 'access.customers': { $exists: true } }
      ]
    });

    console.log(`Found ${subusers.length} subusers to migrate`);

    let migratedCount = 0;

    for (const subuser of subusers) {
      const updateData: any = {};
      
      // If salesAndPayments doesn't exist, set it based on old fields
      if (subuser.access && !subuser.access.hasOwnProperty('salesAndPayments')) {
        const hasSalesAccess = subuser.access.sales === true || subuser.access.customers === true;
        updateData['access.salesAndPayments'] = hasSalesAccess;
      }

      // Remove old fields
      updateData.$unset = {
        'access.sales': '',
        'access.customers': ''
      };

      if (Object.keys(updateData).length > 0) {
        await SubUser.updateOne(
          { _id: subuser._id },
          updateData
        );
        migratedCount++;
        console.log(`Migrated subuser: ${subuser.name} (${subuser.email})`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migration completed. ${migratedCount} subusers migrated.`,
      totalFound: subusers.length,
      migrated: migratedCount
    });

  } catch (error: any) {
    console.error('Error during migration:', error);
    return NextResponse.json(
      { success: false, error: 'Migration failed', details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/debug/migrate-subuser-access - Check migration status
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Count subusers with old fields
    const withOldFields = await SubUser.countDocuments({
      $or: [
        { 'access.sales': { $exists: true } },
        { 'access.customers': { $exists: true } }
      ]
    });

    // Count subusers with new field
    const withNewField = await SubUser.countDocuments({
      'access.salesAndPayments': { $exists: true }
    });

    // Count total subusers
    const total = await SubUser.countDocuments({});

    return NextResponse.json({
      success: true,
      data: {
        total,
        withOldFields,
        withNewField,
        needsMigration: withOldFields > 0
      }
    });

  } catch (error: any) {
    console.error('Error checking migration status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check migration status' },
      { status: 500 }
    );
  }
}
