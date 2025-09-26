import Batch from '@/lib/models/Batch';
import Car from '@/lib/models/Car';
import Customer from '@/lib/models/Customer';
import connectDB from '@/lib/mongodb';

/**
 * Calculate total sale price for all cars sold in a specific batch
 * @param batchId - The batch ID to calculate for
 * @returns Object with calculation results
 */
export async function calculateBatchTotalSalePrice(batchId: string) {
  try {
    await connectDB();
    
    // Find batch by ID
    const batch = await Batch.findById(batchId);
    if (!batch) {
      throw new Error('Batch not found');
    }

    // Get all cars in this batch
    const cars = await Car.find({ 
      companyId: batch.companyId,
      batchNo: batch.batchNo 
    });

    if (cars.length === 0) {
      return {
        success: true,
        batchId,
        batchNo: batch.batchNo,
        totalSalePrice: 0,
        carsCount: 0,
        customersCount: 0,
        message: 'No cars found in batch'
      };
    }

    // Get chassis numbers of all cars in the batch
    const chassisNumbers = cars.map(car => car.chasisNumber);

    // Find customers for these cars (by chassis number)
    // Note: Car model uses 'chasisNumber' (1 s), Customer model uses 'chassisNumber' (2 s)
    const customers = await Customer.find({
      companyId: batch.companyId,
      $or: [
        { 'vehicle.chassisNumber': { $in: chassisNumbers } },
        { 'vehicle.chasisNumber': { $in: chassisNumbers } }
      ]
    });

    // Calculate total sale price
    const totalSalePrice = customers.reduce((total, customer) => {
      return total + (customer.sale.salePrice || 0);
    }, 0);

    // Calculate revenue: Revenue = Sales - Cost
    const revenue = totalSalePrice - (batch.totalCost || 0);
    
    // Calculate profit: Profit = Revenue - Expenses
    const profit = revenue - (batch.totalExpense || 0);

    // Update batch with calculated values
    const updatedBatch = await Batch.findByIdAndUpdate(
      batchId,
      { 
        totalSalePrice,
        totalRevenue: revenue,
        profit: profit
      },
      { new: true, runValidators: true }
    );

    return {
      success: true,
      batchId,
      batchNo: batch.batchNo,
      totalSalePrice,
      revenue,
      profit,
      carsCount: cars.length,
      customersCount: customers.length,
      batch: updatedBatch,
      message: 'Batch total sale price, revenue, and profit calculated and updated successfully'
    };

  } catch (error: any) {
    console.error('Error calculating batch total sale price:', error);
    return {
      success: false,
      error: error.message || 'Internal server error'
    };
  }
}

/**
 * Calculate total sale price for all batches
 * @param companyId - Optional company ID to filter by company
 * @returns Object with calculation results for all batches
 */
export async function calculateAllBatchesTotalSalePrice(companyId?: string) {
  try {
    await connectDB();
    
    // Find all batches
    const query = companyId ? { companyId } : {};
    const batches = await Batch.find(query);

    if (batches.length === 0) {
      return {
        success: true,
        totalBatches: 0,
        results: [],
        message: 'No batches found'
      };
    }

    const results = [];

    for (const batch of batches) {
      const calculation = await calculateBatchTotalSalePrice(batch._id.toString());
      results.push({
        batchId: batch._id,
        batchNo: batch.batchNo,
        ...calculation
      });
    }

    // Calculate overall totals
    const totalCars = results.reduce((sum, result) => sum + result.carsCount, 0);
    const totalCustomers = results.reduce((sum, result) => sum + result.customersCount, 0);
    const grandTotalSalePrice = results.reduce((sum, result) => sum + (result.totalSalePrice || 0), 0);
    const grandTotalRevenue = results.reduce((sum, result) => sum + (result.revenue || 0), 0);
    const grandTotalProfit = results.reduce((sum, result) => sum + (result.profit || 0), 0);

    return {
      success: true,
      totalBatches: batches.length,
      totalCars,
      totalCustomers,
      grandTotalSalePrice,
      grandTotalRevenue,
      grandTotalProfit,
      results,
      message: 'All batches total sale price, revenue, and profit calculated successfully'
    };

  } catch (error: any) {
    console.error('Error calculating all batches total sale price:', error);
    return {
      success: false,
      error: error.message || 'Internal server error'
    };
  }
}

/**
 * Calculate total cost for all cars in a specific batch
 * @param batchId - The batch ID to calculate for
 * @returns Object with calculation results
 */
export async function calculateBatchTotalCost(batchId: string) {
  try {
    await connectDB();
    
    // Find batch by ID
    const batch = await Batch.findById(batchId);
    if (!batch) {
      throw new Error('Batch not found');
    }

    // Get all cars in this batch
    const cars = await Car.find({ 
      companyId: batch.companyId,
      batchNo: batch.batchNo 
    });

    if (cars.length === 0) {
      return {
        success: true,
        batchId,
        batchNo: batch.batchNo,
        totalCost: 0,
        carsCount: 0,
        message: 'No cars found in batch'
      };
    }

    // Calculate total cost using the same logic as the virtual field
    const totalCost = cars.reduce((total, car) => {
      const f = car.financing;
      if (!f) return total;
      
      const carTotalCost = (
        (f.auctionPrice?.totalAmount || 0) +
        (f.auctionExpenses?.totalAmount || 0) +
        (f.inlandCharges?.totalAmount || 0) +
        (f.loadingCharges?.totalAmount || 0) +
        (f.containerCharges?.totalAmount || 0) +
        (f.freightSea?.totalAmount || 0) +
        (f.variantDuty || 0) +
        (f.passportCharges || 0) +
        (f.servicesCharges || 0) +
        (f.transportCharges || 0) +
        (f.repairCharges || 0) +
        (f.miscellaneousCharges || 0) +
        (f.vehicleValueCif || 0) +
        (f.landingCharges || 0) +
        (f.customsDuty || 0) +
        (f.salesTax || 0) +
        (f.federalExciseDuty || 0) +
        (f.incomeTax || 0) +
        (f.freightAndStorageCharges || 0) +
        (f.demurrage || 0) +
        (f.ageOfVehicle || 0)
      );
      
      return total + carTotalCost;
    }, 0);

    // Update batch with calculated total cost
    const updatedBatch = await Batch.findByIdAndUpdate(
      batchId,
      { totalCost },
      { new: true, runValidators: true }
    );

    return {
      success: true,
      batchId,
      batchNo: batch.batchNo,
      totalCost,
      carsCount: cars.length,
      batch: updatedBatch,
      message: 'Batch total cost calculated and updated successfully'
    };

  } catch (error: any) {
    console.error('Error calculating batch total cost:', error);
    return {
      success: false,
      error: error.message || 'Internal server error'
    };
  }
}

/**
 * Calculate total cost for all batches
 * @param companyId - Optional company ID to filter by company
 * @returns Object with calculation results for all batches
 */
export async function calculateAllBatchesTotalCost(companyId?: string) {
  try {
    await connectDB();
    
    // Find all batches
    const query = companyId ? { companyId } : {};
    const batches = await Batch.find(query);

    if (batches.length === 0) {
      return {
        success: true,
        totalBatches: 0,
        results: [],
        message: 'No batches found'
      };
    }

    const results = [];

    for (const batch of batches) {
      const calculation = await calculateBatchTotalCost(batch._id.toString());
      results.push({
        batchId: batch._id,
        batchNo: batch.batchNo,
        ...calculation
      });
    }

    // Calculate overall totals
    const totalCars = results.reduce((sum, result) => sum + result.carsCount, 0);
    const grandTotalCost = results.reduce((sum, result) => sum + (result.totalCost || 0), 0);

    return {
      success: true,
      totalBatches: batches.length,
      totalCars,
      grandTotalCost,
      results,
      message: 'All batches total cost calculated successfully'
    };

  } catch (error: any) {
    console.error('Error calculating all batches total cost:', error);
    return {
      success: false,
      error: error.message || 'Internal server error'
    };
  }
}

/**
 * Get batch statistics including total sale price
 * @param batchId - The batch ID to get statistics for
 * @returns Object with batch statistics
 */
export async function getBatchStatistics(batchId: string) {
  try {
    await connectDB();
    
    const batch = await Batch.findById(batchId).populate('cars').populate('investors');
    if (!batch) {
      throw new Error('Batch not found');
    }

    // Get cars in this batch
    const cars = await Car.find({ 
      companyId: batch.companyId,
      batchNo: batch.batchNo 
    });

    // Get chassis numbers
    const chassisNumbers = cars.map(car => car.chasisNumber);

    // Find customers for these cars
    const customers = await Customer.find({
      companyId: batch.companyId,
      $or: [
        { 'vehicle.chassisNumber': { $in: chassisNumbers } },
        { 'vehicle.chasisNumber': { $in: chassisNumbers } }
      ]
    });

    // Calculate statistics
    const totalSalePrice = customers.reduce((total, customer) => {
      return total + (customer.sale.salePrice || 0);
    }, 0);

    const totalPaidAmount = customers.reduce((total, customer) => {
      return total + (customer.sale.paidAmount || 0);
    }, 0);

    const totalRemainingAmount = customers.reduce((total, customer) => {
      return total + (customer.sale.remainingAmount || 0);
    }, 0);

    const completedSales = customers.filter(customer => 
      customer.sale.paymentStatus === 'Completed'
    ).length;

    const pendingSales = customers.filter(customer => 
      customer.sale.paymentStatus === 'Pending'
    ).length;

    return {
      success: true,
      batch: {
        id: batch._id,
        batchNo: batch.batchNo,
        countryOfOrigin: batch.countryOfOrigin,
        totalCost: batch.totalCost,
        totalSalePrice: batch.totalSalePrice,
        totalExpense: batch.totalExpense,
        totalInvestment: batch.totalInvestment,
        totalRevenue: batch.totalRevenue,
        createdAt: batch.createdAt,
        updatedAt: batch.updatedAt
      },
      statistics: {
        totalCars: cars.length,
        totalCustomers: customers.length,
        calculatedTotalSalePrice: totalSalePrice,
        totalPaidAmount,
        totalRemainingAmount,
        completedSales,
        pendingSales,
        salesCompletionRate: customers.length > 0 ? (completedSales / customers.length) * 100 : 0,
        paymentCompletionRate: totalSalePrice > 0 ? (totalPaidAmount / totalSalePrice) * 100 : 0
      },
      customers: customers.map(customer => ({
        id: customer._id,
        name: customer.customer.name,
        phoneNumber: customer.customer.phoneNumber,
        chassisNumber: customer.vehicle.chassisNumber,
        salePrice: customer.sale.salePrice,
        paidAmount: customer.sale.paidAmount,
        remainingAmount: customer.sale.remainingAmount,
        paymentStatus: customer.sale.paymentStatus,
        saleDate: customer.sale.saleDate
      }))
    };

  } catch (error: any) {
    console.error('Error getting batch statistics:', error);
    return {
      success: false,
      error: error.message || 'Internal server error'
    };
  }
}
