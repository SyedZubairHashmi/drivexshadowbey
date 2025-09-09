"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense, useMemo } from "react";
import { ArrowLeft, X, Upload, Loader2, FileText, Trash2, Image as ImageIcon, ChevronRight, ChevronDown } from "lucide-react";
import { carAPI, batchAPI } from "@/lib/api";
import FlagDropdown from "@/components/ui/flag-dropdown";
import Image from "next/image";
import SuccessPopupCard from "@/components/ui/success-popup-card";
import DynamicInput from "@/components/ui/dynamic-input";

interface AddCarPageProps {
  params: {
    batchNumber: string;
  };
}



function AddCarContent({ params }: AddCarPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { batchNumber } = params;
  const isFromTransit = searchParams.get('from') === 'transit';
  const isEditMode = searchParams.get('edit') === 'true';
  const carDataParam = searchParams.get('carData');

  // Step management
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    // Step 1: Car Information
    carName: "",
    company: "",
    chassisNumber: "",
    carSegment: "",
    engineNumber: "",
    importYear: "",
    auctionGrade: "",
    engineCapacity: "",
    assembly: "",
    mileage: "",
    interiorColor: "",
    keywords: [] as string[],
    status: "warehouse", // Keep default status
    deliveryTimeframe: "",
    exteriorColor: "",
    selectedBatch: batchNumber, // Keep batch number
    manufacturingYear: "",
    engineType: "",
          features: [
        "TPMS", "TRACTION CONTROL", "ABS", "TURBOCHARGER", "KEYLESS ENTRY", 
        "SUPERCHARGER", "PADDLE SHIFTER", "ABS+EBD", "AUTOMATIC CLIMATE CONTROL", 
        "APPLE CAR PLAY", "ANDROID AUTO", "MILD HYBRID", "360 CAMERA", 
        "GPS", "ESP", "HILL ASSIST", "BLIND SPOT MONITOR", 
        "ELECTRONIC PARKING BRAKE", "DIGITAL COCKPIT", "SMART KEY ENTRY", 
        "HEADS UP DISPLAY HUD", "AUTOMATIC PARKING ASSIST APA", 
        "NIGHT VISION", "ADAPTIVE CRUISE CONTROL","MANY MORE"
      ],
    selectedFeatures: ["ABS", "AIR CONDITIONING"] as string[], // Default selected features
    description: "",

    // Step 2: Financial Information
    auctionPrice: "",
    auctionPriceRate: "",
    inlandCharges: "",
    inlandChargesRate: "",
    containerCharges: "",
    containerChargesRate: "",
    auctionExpenses: "",
    auctionExpensesRate: "",
    loadingCharges: "",
    loadingChargesRate: "",
    freightSea: "",
    freightSeaRate: "",
    originCity: "",
    destinationCity: "",
    variantDuty: "",
    passportCharges: "",
    servicesCharges: "",
    transportCharges: "",
    repairCharges: "",
    miscellaneousCharges: "",
    vehicleValueCif: "",
    landingCharges: "",
    customsDuty: "",
    salesTax: "",
    federalExciseDuty: "",
    incomeTax: "",
    freightAndStorageCharges: "",
    demurrage: "",
    ageOfVehicle: ""
  });

  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [invoiceReceipt, setInvoiceReceipt] = useState<File | null>(null);
  const [auctionSheet, setAuctionSheet] = useState<File | null>(null);
  const [carPictures, setCarPictures] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<{ name: string; flag: string; code: string; rate: number } | null>({
    name: "United States",
    flag: "/flags/usa.svg",
    code: "USD",
    rate: 200
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');
  const [batchData, setBatchData] = useState<any>(null);

  // Country to flag mapping
  const countryToFlagMap: { [key: string]: { name: string; flag: string; code: string; rate: number } } = {
    'United States': { name: "United States", flag: "/flags/usa.svg", code: "USD", rate: 200 },
    'USA': { name: "United States", flag: "/flags/usa.svg", code: "USD", rate: 200 },
    'US': { name: "United States", flag: "/flags/usa.svg", code: "USD", rate: 200 },
    'Australia': { name: "Australia", flag: "/flags/australia.svg", code: "AUD", rate: 135 },
    'AUS': { name: "Australia", flag: "/flags/australia.svg", code: "AUD", rate: 135 },
    'Japan': { name: "Japan", flag: "/flags/japan.svg", code: "JPY", rate: 1.35 },
    'JPN': { name: "Japan", flag: "/flags/japan.svg", code: "JPY", rate: 1.35 },
    'UK': { name: "UK", flag: "/flags/uk.svg", code: "GBP", rate: 250 },
    'United Kingdom': { name: "UK", flag: "/flags/uk.svg", code: "GBP", rate: 250 },
    'Korea': { name: "Korea", flag: "/flags/korea.svg", code: "KRW", rate: 0.15 },
    'South Korea': { name: "Korea", flag: "/flags/korea.svg", code: "KRW", rate: 0.15 },
    'KOR': { name: "Korea", flag: "/flags/korea.svg", code: "KRW", rate: 0.15 }
  };

  // Handle pre-filling form data when in edit mode
  useEffect(() => {
    if (isEditMode && carDataParam) {
      try {
        const carData = JSON.parse(decodeURIComponent(carDataParam));
        console.log('Car data for editing:', carData);
        
        setFormData(prev => ({
          ...prev,
          // Car Information - Step 1
          carName: carData.carName || carData.name || prev.carName,
          company: carData.company || prev.company,
          carSegment: carData.carSegment || carData.carType || prev.carSegment,
          chassisNumber: carData.chasisNumber || carData.chassisNumber || prev.chassisNumber,
          engineNumber: carData.engineNumber || prev.engineNumber,
          mileage: carData.mileage || prev.mileage,
          auctionGrade: carData.auctionGrade?.toString() || carData.grade?.toString() || prev.auctionGrade,
          importYear: carData.importYear?.toString() || prev.importYear,
          manufacturingYear: carData.manufacturingYear?.toString() || prev.manufacturingYear,
          assembly: carData.assembly || prev.assembly,
          engineCapacity: carData.engineCapacity || prev.engineCapacity,
          engineType: carData.engineType || prev.engineType,
          interiorColor: carData.interiorColor || prev.interiorColor,
          keywords: carData.keywords || prev.keywords,
          status: carData.status || prev.status,
          deliveryTimeframe: carData.deliveryTimeframe || prev.deliveryTimeframe,
          exteriorColor: carData.exteriorColor || carData.color || prev.exteriorColor,
          selectedBatch: carData.batchNo || carData.batch || batchNumber,
          description: carData.description || prev.description,
          selectedFeatures: carData.features || prev.selectedFeatures,
          
          // Financial Information - Step 2
          originCity: carData.financing?.originCity || prev.originCity,
          destinationCity: carData.financing?.destinationCity || prev.destinationCity,
          auctionPrice: carData.financing?.auctionPrice?.amount?.toString() || carData.financing?.auctionPrice?.toString() || prev.auctionPrice,
          auctionPriceRate: carData.financing?.auctionPrice?.rate?.toString() || carData.financing?.auctionPriceRate?.toString() || prev.auctionPriceRate,
          auctionExpenses: carData.financing?.auctionExpenses?.amount?.toString() || carData.financing?.auctionTaxes?.amount?.toString() || carData.financing?.auctionExpenses?.toString() || prev.auctionExpenses,
          auctionExpensesRate: carData.financing?.auctionExpenses?.rate?.toString() || carData.financing?.auctionTaxes?.rate?.toString() || carData.financing?.auctionExpensesRate?.toString() || prev.auctionExpensesRate,
          inlandCharges: carData.financing?.inlandCharges?.amount?.toString() || carData.financing?.inlandCharges?.toString() || prev.inlandCharges,
          inlandChargesRate: carData.financing?.inlandCharges?.rate?.toString() || carData.financing?.inlandChargesRate?.toString() || prev.inlandChargesRate,
          loadingCharges: carData.financing?.loadingCharges?.amount?.toString() || carData.financing?.loadingCharges?.toString() || prev.loadingCharges,
          loadingChargesRate: carData.financing?.loadingCharges?.rate?.toString() || carData.financing?.loadingChargesRate?.toString() || prev.loadingChargesRate,
          containerCharges: carData.financing?.containerCharges?.amount?.toString() || carData.financing?.containerCharges?.toString() || prev.containerCharges,
          containerChargesRate: carData.financing?.containerCharges?.rate?.toString() || carData.financing?.containerChargesRate?.toString() || prev.containerChargesRate,
          freightSea: carData.financing?.freightSea?.amount?.toString() || carData.financing?.freightSea?.toString() || prev.freightSea,
          freightSeaRate: carData.financing?.freightSea?.rate?.toString() || carData.financing?.freightSeaRate?.toString() || prev.freightSeaRate,
          variantDuty: carData.financing?.variantDuty?.toString() || prev.variantDuty,
          passportCharges: carData.financing?.passportCharges?.toString() || prev.passportCharges,
          servicesCharges: carData.financing?.servicesCharges?.toString() || carData.financing?.serviceCharges?.toString() || prev.servicesCharges,
          transportCharges: carData.financing?.transportCharges?.toString() || prev.transportCharges,
          repairCharges: carData.financing?.repairCharges?.toString() || prev.repairCharges,
          miscellaneousCharges: carData.financing?.miscellaneousCharges?.toString() || prev.miscellaneousCharges,
          vehicleValueCif: carData.financing?.vehicleValueCif?.toString() || prev.vehicleValueCif,
          landingCharges: carData.financing?.landingCharges?.toString() || prev.landingCharges,
          customsDuty: carData.financing?.customsDuty?.toString() || prev.customsDuty,
          salesTax: carData.financing?.salesTax?.toString() || prev.salesTax,
          federalExciseDuty: carData.financing?.federalExciseDuty?.toString() || prev.federalExciseDuty,
          incomeTax: carData.financing?.incomeTax?.toString() || prev.incomeTax,
          freightAndStorageCharges: carData.financing?.freightAndStorageCharges?.toString() || prev.freightAndStorageCharges,
          demurrage: carData.financing?.demurrage?.toString() || prev.demurrage,
          ageOfVehicle: carData.financing?.ageOfVehicle?.toString() || prev.ageOfVehicle,
        }));

        // Set keyword input if keywords exist
        if (carData.keywords && carData.keywords.length > 0) {
          setKeywordInput('');
        }

        // Set selected country based on financing data if available
        if (carData.financing?.auctionPrice?.rate) {
          const rate = carData.financing.auctionPrice.rate;
          // You can add logic here to set the appropriate country based on the rate
          // For now, we'll keep the default
        }
      } catch (error) {
        console.error('Error parsing car data:', error);
      }
    }
  }, [isEditMode, carDataParam, batchNumber]);

  // Fetch batch data to get country of origin and set flag
  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        const response = await batchAPI.getByBatchNo(batchNumber);
        if (response.success && response.data && response.data.length > 0) {
          const batch = response.data[0];
          setBatchData(batch);
          
          // Set flag based on batch's country of origin
          if (batch.countryOfOrigin) {
            const countryName = batch.countryOfOrigin;
            const flagData = countryToFlagMap[countryName];
            
            if (flagData) {
              setSelectedCountry(flagData);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching batch data:', error);
      }
    };

    if (batchNumber) {
      fetchBatchData();
    }
  }, [batchNumber]);

  // Function to fetch batch data and update flag when batch number is changed in the form
  const fetchBatchDataAndUpdateFlag = async (batchNo: string) => {
    try {
      const response = await batchAPI.getByBatchNo(batchNo);
      if (response.success && response.data && response.data.length > 0) {
        const batch = response.data[0];
        setBatchData(batch);
        
        // Set flag based on batch's country of origin
        if (batch.countryOfOrigin) {
          const countryName = batch.countryOfOrigin;
          const flagData = countryToFlagMap[countryName];
          
          if (flagData) {
            setSelectedCountry(flagData);
          }
        }
      } else {
        // If batch not found, reset flag to default
        setSelectedCountry(null);
        setBatchData(null);
      }
    } catch (error) {
      console.error('Error fetching batch data for batch:', batchNo, error);
      // Reset flag on error
      setSelectedCountry(null);
      setBatchData(null);
    }
  };

  // Function to handle rate changes and auto-populate other rate fields
  const handleRateChange = (field: string, value: string) => {
    setIsCalculating(true);
    
    // List of all rate fields
    const rateFields = [
      'auctionPriceRate',
      'inlandChargesRate', 
      'containerChargesRate',
      'auctionExpensesRate',
      'loadingChargesRate',
      'freightSeaRate'
    ];
    
    // Create updated form data with the new rate value
    const updatedFormData = { ...formData, [field]: value };
    
    // Auto-populate all other rate fields with the same value
    rateFields.forEach(rateField => {
      if (rateField !== field) {
        updatedFormData[rateField] = value;
      }
    });
    
    setFormData(updatedFormData);
    
    // Reset calculating state after a short delay
    setTimeout(() => setIsCalculating(false), 100);
  };

  const handleInputChange = (field: string, value: string) => {
    setIsCalculating(true);
    
    // Prevent negative numbers for all number fields
    if (value.startsWith('-')) return;
    
    // Auto-capitalize first letter for car name field
    let processedValue = value;
    if (field === 'carName' && value.length > 0) {
      processedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }
    
    // Normal field update
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));
    
    // Check for duplicate chassis number when chassisNumber field is updated
    if (field === 'chassisNumber' && value.trim().length > 0) {
      checkDuplicateChassisNumber(value.trim());
    }
    
    // Fetch batch data and update flag when selectedBatch field is updated
    if (field === 'selectedBatch' && value.trim().length > 0) {
      fetchBatchDataAndUpdateFlag(value.trim());
    }
    
    // Clear calculating status after a short delay
    setTimeout(() => {
      setIsCalculating(false);
    }, 500);
  };

  // Function to check for duplicate chassis number
  const checkDuplicateChassisNumber = async (chassisNumber: string) => {
    try {
      // Skip validation if in edit mode and chassis number hasn't changed
      if (isEditMode && carDataParam) {
        try {
          const carData = JSON.parse(decodeURIComponent(carDataParam));
          if (carData.chassisNumber === chassisNumber || carData.chasisNumber === chassisNumber) {
            return; // Same chassis number in edit mode, no need to check
          }
        } catch (error) {
          console.error('Error parsing car data:', error);
        }
      }

      const response = await carAPI.getAll();
      if (response.success && response.data) {
        const existingCar = response.data.find((car: any) => 
          (car.chassisNumber === chassisNumber || car.chasisNumber === chassisNumber) && 
          car._id !== (isEditMode && carDataParam ? JSON.parse(decodeURIComponent(carDataParam))?._id : null)
        );
        
        if (existingCar) {
          setError(`Chassis number "${chassisNumber}" already exists. Please use a different chassis number.`);
          // Clear the chassis number field
          setFormData(prev => ({
            ...prev,
            chassisNumber: ""
          }));
        } else {
          // Clear any previous chassis number error
          setError(null);
        }
      }
    } catch (error) {
      console.error('Error checking duplicate chassis number:', error);
      // Don't show error to user for API failures, just log it
    }
  };



  // Helper function to calculate PKR value
  const calculatePKR = (amount: string, rate: string) => {
    const numAmount = parseFloat(amount) || 0;
    const numRate = parseFloat(rate) || 0;
    return (numAmount * numRate).toLocaleString();
  };

  // Calculate total amount based on currency
  const calculateTotal = (amount: string, rate: string) => {
    const numAmount = parseFloat(amount) || 0;
    const numRate = parseFloat(rate) || 0;
    return (numAmount * numRate).toLocaleString();
  };

  // Handle currency change
  const handleCurrencyChange = (country: { name: string; flag: string; code: string; rate: number }) => {
    setSelectedCountry(country);
    // Clear all finance inputs and set new rates when currency changes
    setFormData(prev => ({
      ...prev,
      // Clear all finance amount inputs
      auctionPrice: "",
      inlandCharges: "",
      containerCharges: "",
      auctionExpenses: "",
      loadingCharges: "",
      freightSea: "",
      originCity: "",
      destinationCity: "",
      variantDuty: "",
      passportCharges: "",
      servicesCharges: "",
      transportCharges: "",
      repairCharges: "",
      miscellaneousCharges: "",
      vehicleValueCif: "",
      landingCharges: "",
      customsDuty: "",
      salesTax: "",
      federalExciseDuty: "",
      incomeTax: "",
      freightAndStorageCharges: "",
      demurrage: "",
      ageOfVehicle: "",
      // Update all rates to the new currency rate
      auctionPriceRate: country.rate.toString(),
      inlandChargesRate: country.rate.toString(),
      containerChargesRate: country.rate.toString(),
      auctionExpensesRate: country.rate.toString(),
      loadingChargesRate: country.rate.toString(),
      freightSeaRate: country.rate.toString()
    }));
  };

  const handleKeywordAdd = (keyword: string) => {
    if (keyword && !formData.keywords.includes(keyword)) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keyword]
      }));
    }
  };

  const handleKeywordRemove = (keywordToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(keyword => keyword !== keywordToRemove)
    }));
  };

  const handleAddKeyword = handleKeywordAdd;
  const handleRemoveKeyword = handleKeywordRemove;

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(feature)
        ? prev.selectedFeatures.filter(f => f !== feature)
        : [...prev.selectedFeatures, feature]
    }));
  };

  const handleFileUpload = (type: 'cover' | 'invoice' | 'auction' | 'pictures', file: File) => {
    if (type === 'cover') {
      setCoverPhoto(file);
    } else if (type === 'invoice') {
      setInvoiceReceipt(file);
    } else if (type === 'auction') {
      setAuctionSheet(file);
    } else if (type === 'pictures') {
      setCarPictures(prev => [...prev, file]);
    }
  };

  const handleRemoveFile = (type: 'cover' | 'invoice' | 'auction' | 'pictures', index?: number) => {
    if (type === 'cover') {
      setCoverPhoto(null);
    } else if (type === 'invoice') {
      setInvoiceReceipt(null);
    } else if (type === 'auction') {
      setAuctionSheet(null);
    } else if (type === 'pictures' && index !== undefined) {
      setCarPictures(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate required fields based on current step
              if (currentStep === 1) {
          const requiredFields = [
            'carName', 'company', 'chassisNumber','carSegment', 'engineNumber', 'auctionGrade', 'importYear',
            'assembly', 'engineCapacity', 'interiorColor', 'mileage', 'exteriorColor',
            'description'
          ];

          // Check if at least one feature is selected
          if (!formData.selectedFeatures || formData.selectedFeatures.length === 0) {
            setError('Please select at least one feature for the car');
            return;
          }

        for (const field of requiredFields) {
          if (!formData[field as keyof typeof formData] || formData[field as keyof typeof formData] === '') {
            setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
            return;
          }
        }
      }

      if (currentStep === 2) {
        const requiredFields = [
          'auctionPrice', 'auctionPriceRate', 'inlandCharges', 'inlandChargesRate', 
          'containerCharges', 'containerChargesRate', 'auctionExpenses', 'auctionExpensesRate',
          'loadingCharges', 'loadingChargesRate', 'freightSea', 'freightSeaRate', 
          'originCity', 'destinationCity', 'variantDuty', 'passportCharges', 
          'servicesCharges', 'transportCharges', 'repairCharges', 'miscellaneousCharges',
          'vehicleValueCif', 'landingCharges', 'customsDuty', 'salesTax', 
          'federalExciseDuty', 'incomeTax', 'freightAndStorageCharges', 'demurrage', 'ageOfVehicle'
        ];

        for (const field of requiredFields) {
          if (!formData[field as keyof typeof formData] || formData[field as keyof typeof formData] === '') {
            setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
            return;
          }
        }
              }

        // Validate delivery timeframe only for transit status
        if (formData.status === 'transit' && (!formData.deliveryTimeframe || formData.deliveryTimeframe === '')) {
          setError('Please fill in delivery timeframe (required for transit status)');
          return;
        }

        if (currentStep === 3) {
        // Car pictures are optional - no validation required
        // You can add pictures if needed, but they're not mandatory
      }

      // If this is the final step, save the car
      if (currentStep === 3) {
        // Prepare car data for API
        const carData = {
          carName: formData.carName.trim(),
          company: formData.company.trim(),
          engineNumber: formData.engineNumber.trim(),
          chasisNumber: formData.chassisNumber.trim(),
          carSegment: formData.carSegment,
          auctionGrade: parseInt(formData.auctionGrade),
          importYear: parseInt(formData.importYear),
          manufacturingYear: parseInt(formData.manufacturingYear),
          assembly: formData.assembly,
          engineType: formData.engineType,
          engineCapacity: formData.engineCapacity.trim(),
          interiorColor: formData.interiorColor.trim(),
          mileage: formData.mileage.trim(),
          keywords: Array.isArray(formData.keywords) ? formData.keywords : [],
          features: Array.isArray(formData.selectedFeatures) ? formData.selectedFeatures : [],
          status: formData.status,
          exteriorColor: formData.exteriorColor.trim(),
          ...(formData.status === 'transit' && { deliveryTimeframe: formData.deliveryTimeframe.trim() }),
          batchNo: formData.selectedBatch,
          description: formData.description.trim(),
          financing: {
            originCity: formData.originCity.trim(),
            destinationCity: formData.destinationCity.trim(),
            auctionPrice: {
              amount: parseFloat(formData.auctionPrice || '0'),
              rate: parseFloat(formData.auctionPriceRate || '0'),
              totalAmount: parseFloat(formData.auctionPrice || '0') * parseFloat(formData.auctionPriceRate || '0')
            },
            auctionExpenses: {
              amount: parseFloat(formData.auctionExpenses || '0'),
              rate: parseFloat(formData.auctionExpensesRate || '0'),
              totalAmount: parseFloat(formData.auctionExpenses || '0') * parseFloat(formData.auctionExpensesRate || '0')
            },
            inlandCharges: {
              amount: parseFloat(formData.inlandCharges || '0'),
              rate: parseFloat(formData.inlandChargesRate || '0'),
              totalAmount: parseFloat(formData.inlandCharges || '0') * parseFloat(formData.inlandChargesRate || '0')
            },
            loadingCharges: {
              amount: parseFloat(formData.loadingCharges || '0'),
              rate: parseFloat(formData.loadingChargesRate || '0'),
              totalAmount: parseFloat(formData.loadingCharges || '0') * parseFloat(formData.loadingChargesRate || '0')
            },
            containerCharges: {
              amount: parseFloat(formData.containerCharges || '0'),
              rate: parseFloat(formData.containerChargesRate || '0'),
              totalAmount: parseFloat(formData.containerCharges || '0') * parseFloat(formData.containerChargesRate || '0')
            },
            freightSea: {
              amount: parseFloat(formData.freightSea || '0'),
              rate: parseFloat(formData.freightSeaRate || '0'),
              totalAmount: parseFloat(formData.freightSea || '0') * parseFloat(formData.freightSeaRate || '0')
            },
            variantDuty: parseFloat(formData.variantDuty || '0'),
            passportCharges: parseFloat(formData.passportCharges || '0'),
            servicesCharges: parseFloat(formData.servicesCharges || '0'),
            transportCharges: parseFloat(formData.transportCharges || '0'),
            repairCharges: parseFloat(formData.repairCharges || '0'),
            miscellaneousCharges: parseFloat(formData.miscellaneousCharges || '0'),
            vehicleValueCif: parseFloat(formData.vehicleValueCif || '0'),
            landingCharges: parseFloat(formData.landingCharges || '0'),
            customsDuty: parseFloat(formData.customsDuty || '0'),
            salesTax: parseFloat(formData.salesTax || '0'),
            federalExciseDuty: parseFloat(formData.federalExciseDuty || '0'),
            incomeTax: parseFloat(formData.incomeTax || '0'),
            freightAndStorageCharges: parseFloat(formData.freightAndStorageCharges || '0'),
            demurrage: parseFloat(formData.demurrage || '0'),
            ageOfVehicle: parseFloat(formData.ageOfVehicle || '0'),
            
            // Finance Total Amount - inline calculation
            financeTotalAmount: (parseFloat(formData.auctionPrice || '0') * parseFloat(formData.auctionPriceRate || '0')) +
                               (parseFloat(formData.inlandCharges || '0') * parseFloat(formData.inlandChargesRate || '0')) +
                               (parseFloat(formData.containerCharges || '0') * parseFloat(formData.containerChargesRate || '0')) +
                               (parseFloat(formData.auctionExpenses || '0') * parseFloat(formData.auctionExpensesRate || '0')) +
                               (parseFloat(formData.loadingCharges || '0') * parseFloat(formData.loadingChargesRate || '0')) +
                               (parseFloat(formData.freightSea || '0') * parseFloat(formData.freightSeaRate || '0')) +
                               (parseFloat(formData.variantDuty || '0')) +
                               (parseFloat(formData.passportCharges || '0')) +
                               (parseFloat(formData.servicesCharges || '0')) +
                               (parseFloat(formData.transportCharges || '0')) +
                               (parseFloat(formData.repairCharges || '0')) +
                               (parseFloat(formData.miscellaneousCharges || '0')) +
                               (parseFloat(formData.vehicleValueCif || '0')) +
                               (parseFloat(formData.landingCharges || '0')) +
                               (parseFloat(formData.customsDuty || '0')) +
                               (parseFloat(formData.salesTax || '0')) +
                               (parseFloat(formData.federalExciseDuty || '0')) +
                               (parseFloat(formData.incomeTax || '0')) +
                               (parseFloat(formData.freightAndStorageCharges || '0')) +
                               (parseFloat(formData.demurrage || '0')) +
                               (parseFloat(formData.ageOfVehicle || '0'))
          }
        };

        console.log('Sending car data to API:', JSON.stringify(carData, null, 2));
        console.log('Selected features:', formData.selectedFeatures);
        console.log('Features array length:', formData.selectedFeatures.length);
        console.log('Features field in carData:', carData.features);
        const response = await carAPI.create(carData, {
          coverPhoto,
          invoiceReceipt,
          auctionSheet,
          carPictures
        });

        if (response.success) {
          console.log('Car saved successfully:', response.data);
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            router.push(`/cars/inventory/${batchNumber}`);
          }, 800);
        } else {
          // Handle specific error messages
          if (response.error?.includes('chassis number already exists')) {
            setError('A car with this chassis number already exists. Please use a different chassis number.');
          } else {
            setError(response.error || 'Failed to save car');
          }
        }
      } else {
        // Move to next step
        handleNextStep();
      }
    } catch (error: any) {
      console.error('Error saving car:', error);
      // Show the full error message including details
      setError(error.message || 'An error occurred while saving the car');
    } finally {
      setIsLoading(false);
    }
  };

  const getModalHeight = () => {
    switch (currentStep) {
      case 1: return '800px';
      case 2: return '900px';
      case 3: return '700px';
      default: return '800px';
    }
  };

  // Step 1: Car Information
  const renderStep1 = () => (
    <div className=" py-3">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '24px',
        alignSelf: 'stretch'
      }}>
        <div>
          <h2 style={{
            color: 'var(--Black-black-500, #000)',
            // fontFamily: 'Serotiva',
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: '500',
            lineHeight: '120%',
            textTransform: 'capitalize'
          }}>Car Information</h2>
          
          {isEditMode && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-800">
                  Edit Mode - All car data has been pre-filled. You can modify any field as needed.
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-5 w-full">
          <div>
            <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Car Name</label>
            <Input
              type="text"
              placeholder="Enter Car Name"
              value={formData.carName}
              onChange={(e) => handleInputChange('carName', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Company</label>
            <Select value={formData.company} onValueChange={(value) => handleInputChange('company', value)}>
              <SelectTrigger className="placeholder-custom text-sm" style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}>
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent
                style={{
                  backgroundColor: "white",
                  border: "1px solid rgba(0, 0, 0, 0.24)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  opacity: 1
                }}
              >
                {/* Japanese Brands */}
                <SelectItem value="TOYOTA">TOYOTA</SelectItem>
                <SelectItem value="HONDA">HONDA</SelectItem>
                <SelectItem value="SUZUKI">SUZUKI</SelectItem>
                <SelectItem value="DAIHATSU">DAIHATSU</SelectItem>
                <SelectItem value="NISSAN">NISSAN</SelectItem>
                <SelectItem value="MAZDA">MAZDA</SelectItem>
                <SelectItem value="ISUZU">ISUZU</SelectItem>
                <SelectItem value="MITSUBISHI">MITSUBISHI</SelectItem>
                
                {/* German Luxury Brands */}
                <SelectItem value="MERCEDES-BENZ">MERCEDES-BENZ</SelectItem>
                <SelectItem value="BMW">BMW</SelectItem>
                <SelectItem value="AUDI">AUDI</SelectItem>
                
                {/* Japanese Luxury Brands */}
                <SelectItem value="LEXUS">LEXUS</SelectItem>
                <SelectItem value="ACURA">ACURA</SelectItem>
                
                {/* Korean Brands */}
                <SelectItem value="KIA">KIA</SelectItem>
                <SelectItem value="HYUNDAI">HYUNDAI</SelectItem>
                
                {/* Chinese Brands */}
                <SelectItem value="GWM">GWM</SelectItem>
                <SelectItem value="BYD">BYD</SelectItem>
                <SelectItem value="CHANGAN">CHANGAN</SelectItem>
                <SelectItem value="CHERY">CHERY</SelectItem>
                <SelectItem value="FAW">FAW</SelectItem>
                
                {/* American Brands */}
                <SelectItem value="TESLA">TESLA</SelectItem>
                <SelectItem value="FORD">FORD</SelectItem>
                <SelectItem value="CADILLAC">CADILLAC</SelectItem>
                <SelectItem value="CHRYSLER">CHRYSLER</SelectItem>
                <SelectItem value="CHEVROLET">CHEVROLET</SelectItem>
                <SelectItem value="GMC">GMC</SelectItem>
                <SelectItem value="JEEP">JEEP</SelectItem>
                
                {/* British Brands */}
                <SelectItem value="LAND ROVER">LAND ROVER</SelectItem>
                <SelectItem value="MG">MG</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>
              Chassis Number (VIN) <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2">(Must be unique)</span>
            </label>
          <Input
            type="text"
            placeholder="Enter Chassis Number"
            value={formData.chassisNumber}
            onChange={(e) => handleInputChange('chassisNumber', e.target.value)}
            className="placeholder-custom text-sm"
            style={{
              width: '100%',
              height: '42px',
              borderRadius: '8px',
              opacity: 1,
              gap: '12px',
              border: '1px solid #0000003D',
              paddingTop: '10px',
              paddingRight: '12px',
              paddingBottom: '10px',
              paddingLeft: '12px'
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-5 w-full">
        

          <div>
            <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Engine Number</label>
            <Input
              type="text"
              placeholder="Enter Engine Number"
              value={formData.engineNumber}
              onChange={(e) => handleInputChange('engineNumber', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Car Segment</label>
            <Select value={formData.carSegment} onValueChange={(value) => handleInputChange('carSegment', value)}>
              <SelectTrigger className="placeholder-custom text-sm" style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}>
                <SelectValue placeholder="Select Car Segment" style={{ opacity: 0.5 }} />
              </SelectTrigger>
              <SelectContent
                style={{
                  backgroundColor: "white",
                  border: "1px solid rgba(0, 0, 0, 0.24)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  opacity: 1
                }}
              >
                <SelectItem value="SUV">SUV</SelectItem>
                <SelectItem value="Sedan">Sedan</SelectItem>
                <SelectItem value="Hatchback">Hatchback</SelectItem>
                <SelectItem value="Truck">Truck</SelectItem>
                <SelectItem value="Van">Van</SelectItem>
                <SelectItem value="Kei">Kei</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          

          <div>
            <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Auction Grade</label>
            <Select value={formData.auctionGrade} onValueChange={(value) => handleInputChange('auctionGrade', value)}>
              <SelectTrigger className="placeholder-custom text-sm" style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}>
                <SelectValue placeholder="Select Auction Grade" style={{ opacity: 0.5 }} />
              </SelectTrigger>
              <SelectContent
                style={{
                  backgroundColor: "white",
                  border: "1px solid rgba(0, 0, 0, 0.24)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  opacity: 1
                }}
              >
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="3.5">3.5</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="4.5">4.5</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="5.5">5.5</SelectItem>
                <SelectItem value="6">6</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Import Year</label>
            <Input
              type="number"
              value={formData.importYear}
              onChange={(e) => handleInputChange('importYear', e.target.value)}
              placeholder="Enter Import Year"
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Manufacturing Year</label>
            <Input
              type="number"
              value={formData.manufacturingYear}
              onChange={(e) => handleInputChange('manufacturingYear', e.target.value)}
              placeholder="Enter Manufacturing Year"
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Engine Type</label>
            <Select value={formData.engineType} onValueChange={(value) => handleInputChange('engineType', value)}>
              <SelectTrigger className="placeholder-custom text-sm" style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                borderWidth: '1px',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}>
                <SelectValue placeholder="Select Engine Type" style={{ opacity: 0.5 }} />
              </SelectTrigger>
              <SelectContent
                style={{
                  backgroundColor: "white",
                  border: "1px solid rgba(0, 0, 0, 0.24)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  opacity: 1
                }}
              >
                <SelectItem value="Petrol">Petrol</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
                <SelectItem value="Plug-in Hybrid">Plug-in Hybrid</SelectItem>
                <SelectItem value="CNG">CNG</SelectItem>
                <SelectItem value="LPG">LPG</SelectItem>
              </SelectContent>
            </Select>
          </div>
          

         

          <div>
            <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Assembly</label>
            <Select value={formData.assembly} onValueChange={(value) => handleInputChange('assembly', value)}>
              <SelectTrigger className="placeholder-custom text-sm" style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}>
                <SelectValue placeholder="Select Assembly"  />
              </SelectTrigger>
              <SelectContent
                style={{
                  backgroundColor: "white",
                  border: "1px solid rgba(0, 0, 0, 0.24)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  opacity: 1
                }}
              >
                <SelectItem value="Import">Import</SelectItem>
                <SelectItem value="Local">Local</SelectItem>
                <SelectItem value="CKD">CKD</SelectItem>
                <SelectItem value="CBU">CBU</SelectItem>
                <SelectItem value="JDM">JDM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Engine Capacity</label>
            <Input
              type="text"
              placeholder="Enter Engine Capacity (e.g., 1600 cc, 2.0L)"
              value={formData.engineCapacity}
              onChange={(e) => handleInputChange('engineCapacity', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>

          

          <div>
            <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Interior Color</label>
            <Input
              type="text"
              placeholder="Enter Interior Color (e.g., Black Leather, Beige)"
              value={formData.interiorColor}
              onChange={(e) => handleInputChange('interiorColor', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Mileage</label>
            <Input
              type="text"
              placeholder="Enter Mileage (e.g., 14k, 50,000 km)"
              value={formData.mileage}
              onChange={(e) => handleInputChange('mileage', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Keywords</label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Type keywords and press Enter to add tags"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (keywordInput.trim()) {
                    handleAddKeyword(keywordInput.trim());
                    setKeywordInput('');
                  }
                }
              }}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>
          {formData.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.keywords.map((keyword, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    padding: '4px 6px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '4px',
                    borderRadius: '8px',
                    background: '#00674F',
                    color: 'white',
                    fontSize: '15px',
                    fontWeight: '500',
                    border: 'none',
                    boxShadow: 'none'
                  }}
                >
                  <span className="mr-1">{keyword}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keyword)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'white',
                      padding: '0',
                      margin: '0'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 12 12" fill="none">
                      <path d="M1.33366 11.8333L0.166992 10.6666L4.83366 5.99996L0.166992 1.33329L1.33366 0.166626L6.00033 4.83329L10.667 0.166626L11.8337 1.33329L7.16699 5.99996L11.8337 10.6666L10.667 11.8333L6.00033 7.16663L1.33366 11.8333Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6 w-full">
          <div>
            <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Select Status</label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger className="placeholder-custom text-sm" style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}>
                <SelectValue placeholder="Select Status" style={{ opacity: 0.5 }} />
              </SelectTrigger>
              <SelectContent
                style={{
                  backgroundColor: "white",
                  border: "1px solid rgba(0, 0, 0, 0.24)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  opacity: 1
                }}
              >
                <SelectItem value="warehouse">Warehouse</SelectItem>
                <SelectItem value="transit">Transit</SelectItem>
                <SelectItem value="showroom">Showroom</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.status === 'transit' && (
            <div>
              <label className="block text-sm font-medium text-black mb-2" >Delivery timeframe</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Enter weeks"
                  value={formData.deliveryTimeframe}
                  onChange={(e) => handleInputChange('deliveryTimeframe', e.target.value)}
                  className="placeholder-custom text-sm"
                  style={{
                    width: '100%',
                    height: '42px',
                    borderRadius: '8px',
                    opacity: 1,
                    gap: '12px',
                    border: '1px solid #0000003D',
                    paddingTop: '10px',
                    paddingRight: '12px',
                    paddingBottom: '10px',
                    paddingLeft: '12px'
                  }}
                />
                <span className="text-sm text-gray-600 whitespace-nowrap">weeks</span>
              </div>
            </div>
          )}

          {formData.status !== 'transit' && (
            <div>
              <label className="block text-sm font-medium text-black mb-2 opacity-50" >Delivery timeframe</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Only available for Transit status"
                  value={formData.deliveryTimeframe}
                  onChange={(e) => handleInputChange('deliveryTimeframe', e.target.value)}
                  disabled
                  className="placeholder-custom text-sm opacity-50"
                  style={{
                    width: '100%',
                    height: '42px',
                    borderRadius: '8px',
                    opacity: 0.5,
                    gap: '12px',
                    border: '1px solid #0000003D',
                    paddingTop: '10px',
                    paddingRight: '12px',
                    paddingBottom: '10px',
                    paddingLeft: '12px',
                    backgroundColor: '#f3f4f6',
                    cursor: 'not-allowed'
                  }}
                />
                <span className="text-sm text-gray-400 whitespace-nowrap">weeks</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Exterior Color</label>
            <Input
              type="text"
              placeholder="Enter Exterior Color (e.g., Sonic Red, Pearl White)"
              value={formData.exteriorColor}
              onChange={(e) => handleInputChange('exteriorColor', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',  
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Select Batch</label>
            <Input
              type="text"
              placeholder="Enter Batch Number"
              value={formData.selectedBatch}
              onChange={(e) => handleInputChange('selectedBatch', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Car description</label>
          <Textarea
            placeholder="Enter detailed car description..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="placeholder-custom text-sm w-full"
            style={{
              minHeight: '100px',
              borderRadius: '8px',
              border: '1px solid #0000003D',
              padding: '12px',
              resize: 'vertical'
            }}
          />
          <p className="text-sm text-gray-500 mt-1">
            Total words: {formData.description.split(' ').length}/500
          </p>
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>
            Features ({formData.features.length} available) <span className="text-red-500">*</span>
            <span className="text-xs text-gray-500 ml-2">(Select at least one feature)</span>
            <span className="text-sm text-blue-600 ml-2">({formData.selectedFeatures.length} selected)</span>
          </label>
          <div style={{
            display: 'flex',
            width: '100%',
            padding: '20px',
            alignItems: 'center',
            alignContent: 'center',
            gap: '18px',
            flexWrap: 'wrap',
            borderRadius: '24px',
            border: '1px solid rgba(0, 0, 0, 0.24)'
          }}>

            {formData.features && formData.features.length > 0 ? (
              formData.features.map((feature, index) => (
              <div
                key={index}
                onClick={() => handleFeatureToggle(feature)}
                style={{
                  display: 'flex',
                  height: '42px',
                  padding: '10px 12px',
                  alignItems: 'center',
                  gap: '12px',
                  borderRadius: '8px',
                  backgroundColor: formData.selectedFeatures.includes(feature) ? '#00674F' : 'white',
                  color: formData.selectedFeatures.includes(feature) ? 'white' : '#00000066',
                  border: formData.selectedFeatures.includes(feature) ? 'none' : '1px solid rgba(0, 0, 0, 0.24)',
                  boxShadow: '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  textTransform: 'uppercase'
                }}>
                  {feature}
                </span>
                {formData.selectedFeatures.includes(feature) && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1.33366 11.8333L0.166992 10.6666L4.83366 5.99996L0.166992 1.33329L1.33366 0.166626L6.00033 4.83329L10.667 0.166626L11.8337 1.33329L7.16699 5.99996L11.8337 10.6666L10.667 11.8333L6.00033 7.16663L1.33366 11.8333Z" fill="white"/>
                  </svg>
                )}
              </div>
            ))
            ) : (
              <div style={{ color: '#666', fontSize: '14px' }}>No features available</div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            💡 <strong>Tip:</strong> Click on features to select/deselect them. At least one feature must be selected.
          </p>
        </div>
      </div>
    </div>
  );

  // Step 2: Financial Information
  const renderStep2 = () => (
    <div className=" py-3">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '24px',
        alignSelf: 'stretch'
      }}>
        <div className="flex justify-between items-center w-full">
          <h2 style={{
            color: 'var(--Black-black-500, #000)',
            // fontFamily: 'Serotiva',
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: '500',
            lineHeight: '120%',
            textTransform: 'capitalize'
          }}>Financing Information</h2>

          <FlagDropdown
            selectedCountry={selectedCountry}
            onSelect={handleCurrencyChange}
            hideOtherFlags={true}
          />
        </div>

        {/* Auction Origin Dropdown */}


        {/* Financing Information - Left Column */}
        <div className="grid grid-cols-2 gap-6 w-full">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '24px',
            width: '100%',
            alignSelf: 'stretch'
          }}>
   <div className="w-full">
  <label
    className="block text-sm font-medium text-black mb-2"
    style={{ fontWeight: "500" }}
  >
    Auction price
  </label>

  <div
    style={{
      display: "flex",
      width: "100%",
      height: "42px",
      padding: "10px 12px",
      alignItems: "center",
      gap: "12px",
      border: "1px solid #0000003D",
      borderRadius: "8px",
      backgroundColor: "#fff",
    }}
  >
    {/* Amount input - starts with 1 digit width, expands to 5 digits, then fixes */}
    <DynamicInput
      value={formData.auctionPrice}
      onChange={(value) =>
        setFormData({ ...formData, auctionPrice: value })
      }
      maxDigits={5}
    />

    <span className="text-sm text-gray-600">{selectedCountry?.code}</span>
    <span className="text-sm text-gray-600">x</span>

    {/* Rate input - starts with 1 digit width, expands to 3 digits, then fixes */}
    <DynamicInput
      value={formData.auctionPriceRate}
      onChange={(value) => handleRateChange('auctionPriceRate', value)}
      maxDigits={3}
    />

    <span className="text-sm text-gray-600">PKR</span>
    <span className="text-sm text-gray-600">=</span>

    <span className="text-sm font-medium">
      {calculateTotal(formData.auctionPrice, formData.auctionPriceRate)}/- PKR
    </span>

    {/* Flag pinned at right */}
    <div style={{ marginLeft: "auto" }}>
      <Image
        src={selectedCountry?.flag || "/flags/us.svg"}
        alt={selectedCountry?.name || "USA"}
        width={24}
        height={16}
        className="rounded border"
      />
    </div>
  </div>
</div>



            <div className="w-full">
              <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Inland charges</label>
              <div style={{
                display: 'flex',
                width: '100%',
                height: '42px',
                padding: '10px 12px',
                alignItems: 'center',
                gap: '12px',
                border: '1px solid #0000003D',
                borderRadius: '8px',
                backgroundColor: '#fff'
              }}>
                {/* Amount input - starts with initial width, increases dynamically, fixes at 5 digits */}
                <DynamicInput
                  value={formData.inlandCharges}
                  onChange={(value) => setFormData({ ...formData, inlandCharges: value })}
                  initialWidth={80}
                  maxDigits={5}
                />

                <span className="text-sm text-gray-600">{selectedCountry?.code}</span>
                <span className="text-sm text-gray-600">x</span>

                {/* Rate input - starts with initial width, increases dynamically, fixes at 3 digits */}
                <DynamicInput
                  value={formData.inlandChargesRate}
                  onChange={(value) => handleRateChange('inlandChargesRate', value)}
                  initialWidth={60}
                  maxDigits={3}
                />

                <span className="text-sm text-gray-600">PKR</span>
                <span className="text-sm text-gray-600">=</span>

                <span className="text-sm font-medium">
                  {calculateTotal(formData.inlandCharges, formData.inlandChargesRate)}/- PKR
                </span>

                {/* Flag pinned at right */}
                <div style={{ marginLeft: "auto" }}>
                  <Image
                    src={selectedCountry?.flag || "/flags/us.svg"}
                    alt={selectedCountry?.name || "USA"}
                    width={24}
                    height={16}
                    className="rounded border"
                  />
                </div>
              </div>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Container Charges (Inland)</label>
              <div style={{
                display: 'flex',
                width: '100%',
                height: '42px',
                padding: '10px 12px',
                alignItems: 'center',
                gap: '12px',
                border: '1px solid #0000003D',
                borderRadius: '8px',
                backgroundColor: '#fff'
              }}>
                {/* Amount input - starts with 1 digit width, expands to 5 digits, then fixes */}
                <DynamicInput
                  value={formData.containerCharges}
                  onChange={(value) => setFormData({ ...formData, containerCharges: value })}
                  maxDigits={5}
                />

                <span className="text-sm text-gray-600">{selectedCountry?.code}</span>
                <span className="text-sm text-gray-600">x</span>

                {/* Rate input - starts with 1 digit width, expands to 3 digits, then fixes */}
                <DynamicInput
                  value={formData.containerChargesRate}
                  onChange={(value) => handleRateChange('containerChargesRate', value)}
                  maxDigits={3}
                />

                <span className="text-sm text-gray-600">PKR</span>
                <span className="text-sm text-gray-600">=</span>

                <span className="text-sm font-medium">
                  {calculateTotal(formData.containerCharges, formData.containerChargesRate)}/- PKR
                </span>

                {/* Flag pinned at right */}
                <div style={{ marginLeft: "auto" }}>
                  <Image
                    src={selectedCountry?.flag || "/flags/us.svg"}
                    alt={selectedCountry?.name || "USA"}
                    width={24}
                    height={16}
                    className="rounded border"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Financing Information - Right Column */}
          <div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "24px",
    alignSelf: "stretch",
  }}
>
  {/* Auction expenses/taxes */}
  <div className="w-full">
    <label
      className="block text-sm font-medium text-black mb-2"
      style={{ fontWeight: "500" }}
    >
      Auction expenses/taxes
    </label>
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "42px",
        padding: "10px 12px",
        alignItems: "center",
        gap: "12px",
        border: "1px solid #0000003D",
        borderRadius: "8px",
        backgroundColor: "#fff",
      }}
    >
      {/* Amount input - expands up to 5 digits */}
      <DynamicInput
        value={formData.auctionExpenses}
        onChange={(value) =>
          setFormData({ ...formData, auctionExpenses: value })
        }
        maxDigits={5}
      />

      <span className="text-sm text-gray-600">{selectedCountry?.code}</span>
      <span className="text-sm text-gray-600">x</span>

      {/* Rate input - expands up to 3 digits */}
      <DynamicInput
        value={formData.auctionExpensesRate}
        onChange={(value) => handleRateChange('auctionExpensesRate', value)}
        maxDigits={3}
      />

      <span className="text-sm text-gray-600">PKR</span>
      <span className="text-sm text-gray-600">=</span>

      <span className="text-sm font-medium">
        {calculateTotal(
          formData.auctionExpenses,
          formData.auctionExpensesRate
        )}
        /- PKR
      </span>

      {/* Flag pinned at right */}
      <div style={{ marginLeft: "auto" }}>
        <Image
          src={selectedCountry?.flag || "/flags/us.svg"}
          alt={selectedCountry?.name || "USA"}
          width={24}
          height={16}
          className="rounded border"
        />
      </div>
    </div>
  </div>

  {/* Loading charges (inland) */}
  <div className="w-full">
    <label
      className="block text-sm font-medium text-black mb-2"
      style={{ fontWeight: "500" }}
    >
      Loading charges (inland)
    </label>
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "42px",
        padding: "10px 12px",
        alignItems: "center",
        gap: "12px",
        border: "1px solid #0000003D",
        borderRadius: "8px",
        backgroundColor: "#fff",
      }}
    >
      <DynamicInput
        value={formData.loadingCharges}
        onChange={(value) =>
          setFormData({ ...formData, loadingCharges: value })
        }
        maxDigits={5}
      />

      <span className="text-sm text-gray-600">{selectedCountry?.code}</span>
      <span className="text-sm text-gray-600">x</span>

      <DynamicInput
        value={formData.loadingChargesRate}
        onChange={(value) => handleRateChange('loadingChargesRate', value)}
        maxDigits={3}
      />

      <span className="text-sm text-gray-600">PKR</span>
      <span className="text-sm text-gray-600">=</span>

      <span className="text-sm font-medium">
        {calculateTotal(formData.loadingCharges, formData.loadingChargesRate)}/-
        PKR
      </span>

      <div style={{ marginLeft: "auto" }}>
        <Image
          src={selectedCountry?.flag || "/flags/us.svg"}
          alt={selectedCountry?.name || "USA"}
          width={24}
          height={16}
          className="rounded border"
        />
      </div>
    </div>
  </div>

  {/* Freight Sea */}
  <div className="w-full">
    <label
      className="block text-sm font-medium text-black mb-2"
      style={{ fontWeight: "500" }}
    >
      Freight Sea
    </label>
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "42px",
        padding: "10px 12px",
        alignItems: "center",
        gap: "12px",
        border: "1px solid #0000003D",
        borderRadius: "8px",
        backgroundColor: "#fff",
      }}
    >
      <DynamicInput
        value={formData.freightSea}
        onChange={(value) => setFormData({ ...formData, freightSea: value })}
        maxDigits={5}
      />

      <span className="text-sm text-gray-600">USD</span>
      <span className="text-sm text-gray-600">x</span>

      <DynamicInput
        value={formData.freightSeaRate}
        onChange={(value) => handleRateChange('freightSeaRate', value)}
        maxDigits={3}
      />

      <span className="text-sm text-gray-600">PKR</span>
      <span className="text-sm text-gray-600">=</span>

      <span className="text-sm font-medium">
        {calculateTotal(formData.freightSea, formData.freightSeaRate)}/- PKR
      </span>

      <div style={{ marginLeft: "auto" }}>
        <Image
          src="/flags/usa.svg"
          alt="USA"
          width={24}
          height={16}
          className="rounded border"
        />
      </div>
    </div>
  </div>
</div>



        </div>

        {/* Other Charges and Details */}
        <div className="grid grid-cols-2 gap-6 w-full">
          <div>
                          <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Origin City</label>
            <Input
              type="text"
              placeholder="Enter origin city"
              value={formData.originCity}
              onChange={(e) => {
                // Only allow letters, spaces, and common city name characters
                const value = e.target.value.replace(/[0-9]/g, '');
                handleInputChange('originCity', value);
              }}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>

          <div>
                          <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Destination City</label>
            <Input
              type="text"
              placeholder="Enter destination city"
              value={formData.destinationCity}
              onChange={(e) => {
                // Only allow letters, spaces, and common city name characters
                const value = e.target.value.replace(/[0-9]/g, '');
                handleInputChange('destinationCity', value);
              }}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>

          <div>
                          <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Varient duty</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={formData.variantDuty}
              onChange={(e) => handleInputChange('variantDuty', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>

          <div>
                          <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Passport charges</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={formData.passportCharges}
              onChange={(e) => handleInputChange('passportCharges', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>

          <div>
                          <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Services charges</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={formData.servicesCharges}
              onChange={(e) => handleInputChange('servicesCharges', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>

          <div>
                          <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Transport charges</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={formData.transportCharges}
              onChange={(e) => handleInputChange('transportCharges', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>

          <div>
                          <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Repair charges</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={formData.repairCharges}
              onChange={(e) => handleInputChange('repairCharges', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>
          <div>
                          <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Vehicle Value CIF</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter vehicle value CIF"
              value={formData.vehicleValueCif}
              onChange={(e) => handleInputChange('vehicleValueCif', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>

          <div>
                          <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Landing charges</label>
            <Input
              type="number"
              placeholder="Enter landing charges"
              value={formData.landingCharges}
              onChange={(e) => handleInputChange('landingCharges', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>

          <div>
                          <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Customs duty</label>
            <Input
              type="number"
              placeholder="Enter customs duty"
              value={formData.customsDuty}
              onChange={(e) => handleInputChange('customsDuty', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>

          <div>
                          <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Sales tax</label>
            <Input
              type="number"
              placeholder="Enter sales tax"
              value={formData.salesTax}
              onChange={(e) => handleInputChange('salesTax', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>

          <div>
                          <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Federal excise duty</label>
            <Input
              type="number"
              placeholder="Enter federal excise duty"
              value={formData.federalExciseDuty}
              onChange={(e) => handleInputChange('federalExciseDuty', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>

          <div>
                          <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Income tax</label>
            <Input
              type="number"
              placeholder="Enter income tax"
              value={formData.incomeTax}
              onChange={(e) => handleInputChange('incomeTax', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>

          <div>
                          <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Freight and storage charges</label>
            <Input
              type="number"
              placeholder="Enter freight and storage charges"
              value={formData.freightAndStorageCharges}
              onChange={(e) => handleInputChange('freightAndStorageCharges', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>

          <div>
                          <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Demurrage</label>
            <Input
              type="number"
              placeholder="Enter demurrage"
              value={formData.demurrage}
              onChange={(e) => handleInputChange('demurrage', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>

          <div>
                          <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Age of the vehicle</label>
            <Input
              type="number"
              placeholder="Enter age of vehicle"
              value={formData.ageOfVehicle}
              onChange={(e) => handleInputChange('ageOfVehicle', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>
        </div>
          <div className="w-full">
                          <label className="block text-sm font-medium text-black mb-2" style={{ fontWeight: "500" }}>Miscellaneous charges</label>
            <Input
              type="number"
              placeholder="Enter miscellaneous charges"
              value={formData.miscellaneousCharges}
              onChange={(e) => handleInputChange('miscellaneousCharges', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>

                 <div className="flex justify-end w-full">
   <span className={`text-base font-medium ${isCalculating ? 'text-orange-600' : 'text-gray-800'}`}>
     Total Amount = {calculateTotalPrice()}{!isCalculating && '/- PKR'}
   </span>
 </div>
      </div>
    </div>
  );

  // Step 3: File Uploads
  const renderStep3 = () => (
    <div className="py-3">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '24px',
        alignSelf: 'stretch'
      }}>
        <div>
          <h3 style={{
            color: 'var(--Black-black-500, #000)',
            
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: '500',
            lineHeight: '120%',
            textTransform: 'capitalize'
          }}>Uploading Docs & Images</h3>
        </div>

        {/* Invoice & Receipt */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '24px',
          alignSelf: 'stretch'
        }}>
          <h4 className="text-sm font-medium text-black">Invoice Reciept</h4>
          {invoiceReceipt ? (
            <div style={{
              display: 'flex',
              width: '388px',
              padding: '16px 12px',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: '24px',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              borderRadius: '12px'
            }}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6.13342 8.00002H9.86675M6.13342 10.4889H9.86675M11.1112 13.6H4.88898C4.20169 13.6 3.64453 13.0429 3.64453 12.3556V3.64447C3.64453 2.95718 4.20169 2.40002 4.88898 2.40002H8.36458C8.5296 2.40002 8.68787 2.46558 8.80455 2.58227L12.1734 5.95111C12.2901 6.0678 12.3556 6.22607 12.3556 6.39109V12.3556C12.3556 13.0429 11.7985 13.6 11.1112 13.6Z" stroke="#4B4EFC" strokeWidth="1.336" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{invoiceReceipt.name}</span>
                    <span className="text-xs text-gray-500">345kb • 100% uploaded</span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFile('invoice')}
                  style={{
                    display: 'flex',
                    width: '32px',
                    height: '32px',
                    padding: '8px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    borderRadius: '50%',
                    border: '1px solid #EF4444',
                    background: '#EF4444',
                    cursor: 'pointer'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.444 4.11111L12.7694 13.5553C12.7113 14.3693 12.0339 15 11.2178 15H4.78131C3.9652 15 3.28785 14.3693 3.2297 13.5553L2.55512 4.11111M6.44401 7.22222V11.8889M9.55512 7.22222V11.8889M10.3329 4.11111V1.77778C10.3329 1.34822 9.98468 1 9.55512 1H6.44401C6.01446 1 5.66623 1.34822 5.66623 1.77778V4.11111M1.77734 4.11111H14.2218" stroke="#FFFFFF" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              height: '180px',
              padding: '16px',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              alignSelf: 'stretch',
              border: '1px dashed rgba(0, 0, 0, 0.50)',
              borderRadius: '24px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58" fill="none">
                <path d="M31.417 21.75H44.7087L31.417 8.45831V21.75ZM14.5003 4.83331H33.8337L48.3337 19.3333V48.3333C48.3337 49.6152 47.8244 50.8446 46.918 51.751C46.0116 52.6574 44.7822 53.1666 43.5003 53.1666H14.5003C13.2184 53.1666 11.9891 52.6574 11.0826 51.751C10.1762 50.8446 9.66699 49.6152 9.66699 48.3333V9.66665C9.66699 8.38477 10.1762 7.15539 11.0826 6.24896C11.9891 5.34254 13.2184 4.83331 14.5003 4.83331ZM26.4145 30.0633C27.4053 32.2383 28.662 34.0266 30.112 35.2591L31.1028 36.0325C29.0003 36.4191 26.1003 37.0958 23.0312 38.28L22.7653 38.3766L23.9737 35.8633C25.0612 33.7608 25.8587 31.8516 26.4145 30.0633ZM42.0745 39.2708C42.5095 38.8358 42.727 38.28 42.7512 37.6758C42.8237 37.1925 42.7028 36.7333 42.4612 36.3466C41.7603 35.2108 39.9478 34.6791 36.9512 34.6791L33.8337 34.8483L31.7312 33.4466C30.2087 32.19 28.8312 29.9908 27.8645 27.26L27.9612 26.9216C28.7587 23.7075 29.5078 19.8166 27.9128 18.2216C27.7177 18.0322 27.487 17.8834 27.2339 17.7838C26.9808 17.6843 26.7105 17.6359 26.4387 17.6416H25.8587C24.9645 17.6416 24.167 18.5841 23.9495 19.5025C23.0553 22.7166 23.587 24.4808 24.4812 27.405V27.4291C23.877 29.5558 23.1037 32.0208 21.8712 34.51L19.5512 38.86L17.4003 40.0441C14.5003 41.8566 13.1228 43.8866 12.857 45.1675C12.7603 45.6266 12.8087 46.0375 12.9778 46.4725L13.0503 46.5933L14.2103 47.3425L15.2737 47.6083C17.2312 47.6083 19.4545 45.3125 22.4512 40.1891L22.8862 40.02C25.3753 39.2225 28.4687 38.6666 32.6253 38.2075C35.1145 39.44 38.0387 39.9958 39.8753 39.9958C40.9387 39.9958 41.6637 39.73 42.0745 39.2708ZM41.0837 37.555L41.3012 37.8208C41.277 38.0625 41.2045 38.0866 41.0837 38.135H40.987L40.5278 38.1833C39.4162 38.1833 37.7003 37.7241 35.9362 36.9508C36.1537 36.7091 36.2503 36.7091 36.492 36.7091C39.8753 36.7091 40.842 37.3133 41.0837 37.555ZM18.9228 41.0833C17.352 43.9591 15.9262 45.5541 14.8387 45.9166C14.9595 44.9983 16.047 43.4033 17.7628 41.8325L18.9228 41.0833ZM26.2212 24.3841C25.6653 22.2091 25.6412 20.445 26.052 19.43L26.2212 19.14L26.5837 19.2608C26.9945 19.8408 27.0428 20.6141 26.8012 21.9191L26.7287 22.3058L26.342 24.2875L26.2212 24.3841Z" fill="#EF5350" />
              </svg>
              <div className="text-center">
                <label htmlFor="invoice-receipt" className="cursor-pointer">
                  <p className="text-sm text-blue-600 hover:text-blue-500 font-medium">Upload a file or drag and drop</p>
                </label>
                <p className="text-xs text-gray-500">PNG, JPG, GIF upto 5MB</p>
              </div>
              <input
                id="invoice-receipt"
                type="file"
                accept=".pdf,.doc,.docx,image/*"
                onChange={(e) => e.target.files?.[0] && handleFileUpload('invoice', e.target.files[0])}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Cover Photo */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '24px',
          alignSelf: 'stretch'
        }}>
          <h4 className="text-sm font-medium text-black">Cover Photo</h4>
          {coverPhoto ? (
            <div style={{
              display: 'flex',
              height: '180px',
              padding: '16px',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              gap: '12px',
              alignSelf: 'stretch',
              backgroundImage: `url(${URL.createObjectURL(coverPhoto)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '12px',
              position: 'relative',
              border: '1px solid rgba(0, 0, 0, 0.12)'
            }}>
              <button
                onClick={() => handleRemoveFile('cover')}
                style={{
                  display: 'flex',
                  width: '32px',
                  height: '32px',
                  padding: '8px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  borderRadius: '50%',
                  border: '1px solid #EF4444',
                  background: '#EF4444',
                  cursor: 'pointer'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.444 4.11111L12.7694 13.5553C12.7113 14.3693 12.0339 15 11.2178 15H4.78131C3.9652 15 3.28785 14.3693 3.2297 13.5553L2.55512 4.11111M6.44401 7.22222V11.8889M9.55512 7.22222V11.8889M10.3329 4.11111V1.77778C10.3329 1.34822 9.98468 1 9.55512 1H6.44401C6.01446 1 5.66623 1.34822 5.66623 1.77778V4.11111M1.77734 4.11111H14.2218" stroke="#FFFFFF" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              height: '180px',
              padding: '16px',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              alignSelf: 'stretch',
              border: '1px dashed rgba(0, 0, 0, 0.50)',
              borderRadius: '24px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M3 22.5L10.4519 15.0481C11.7211 13.7789 13.7789 13.7789 15.0481 15.0481L22.5 22.5M19.25 19.25L21.8269 16.6731C23.0961 15.4039 25.1539 15.4039 26.4231 16.6731L29 19.25M19.25 9.5H19.2663M6.25 29H25.75C27.5449 29 29 27.5449 29 25.75V6.25C29 4.45507 27.5449 3 25.75 3H6.25C4.45507 3 3 4.45507 3 6.25V25.75C3 27.5449 4.45507 29 6.25 29Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="text-center">
                <label htmlFor="cover-photo" className="cursor-pointer">
                  <p className="text-sm text-blue-600 hover:text-blue-500 font-medium">Upload a file or drag and drop</p>
                </label>
                <p className="text-xs text-gray-500">PNG, JPG, GIF upto 5MB</p>
              </div>
              <input
                id="cover-photo"
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileUpload('cover', e.target.files[0])}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Auction Sheet */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '24px',
          alignSelf: 'stretch'
        }}>
          <h4 className="text-sm font-medium text-black">Auction Sheet</h4>
          {auctionSheet ? (
            <div style={{
              display: 'flex',
              width: '388px',
              padding: '16px 12px',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: '24px',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              borderRadius: '12px'
            }}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6.13342 8.00002H9.86675M6.13342 10.4889H9.86675M11.1112 13.6H4.88898C4.20169 13.6 3.64453 13.0429 3.64453 12.3556V3.64447C3.64453 2.95718 4.20169 2.40002 4.88898 2.40002H8.36458C8.5296 2.40002 8.68787 2.46558 8.80455 2.58227L12.1734 5.95111C12.2901 6.0678 12.3556 6.22607 12.3556 6.39109V12.3556C12.3556 13.0429 11.7985 13.6 11.1112 13.6Z" stroke="#4B4EFC" strokeWidth="1.336" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{auctionSheet.name}</span>
                    <span className="text-xs text-gray-500">345kb • 100% uploaded</span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFile('auction')}
                  style={{
                    display: 'flex',
                    width: '32px',
                    height: '32px',
                    padding: '8px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    borderRadius: '50%',
                    border: '1px solid #EF4444',
                    background: '#EF4444',
                    cursor: 'pointer'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.444 4.11111L12.7694 13.5553C12.7113 14.3693 12.0339 15 11.2178 15H4.78131C3.9652 15 3.28785 14.3693 3.2297 13.5553L2.55512 4.11111M6.44401 7.22222V11.8889M9.55512 7.22222V11.8889M10.3329 4.11111V1.77778C10.3329 1.34822 9.98468 1 9.55512 1H6.44401C6.01446 1 5.66623 1.34822 5.66623 1.77778V4.11111M1.77734 4.11111H14.2218" stroke="#FFFFFF" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              height: '180px',
              padding: '16px',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              alignSelf: 'stretch',
              border: '1px dashed rgba(0, 0, 0, 0.50)',
              borderRadius: '24px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58" fill="none">
                <path d="M31.417 21.75H44.7087L31.417 8.45831V21.75ZM14.5003 4.83331H33.8337L48.3337 19.3333V48.3333C48.3337 49.6152 47.8244 50.8446 46.918 51.751C46.0116 52.6574 44.7822 53.1666 43.5003 53.1666H14.5003C13.2184 53.1666 11.9891 52.6574 11.0826 51.751C10.1762 50.8446 9.66699 49.6152 9.66699 48.3333V9.66665C9.66699 8.38477 10.1762 7.15539 11.0826 6.24896C11.9891 5.34254 13.2184 4.83331 14.5003 4.83331ZM26.4145 30.0633C27.4053 32.2383 28.662 34.0266 30.112 35.2591L31.1028 36.0325C29.0003 36.4191 26.1003 37.0958 23.0312 38.28L22.7653 38.3766L23.9737 35.8633C25.0612 33.7608 25.8587 31.8516 26.4145 30.0633ZM42.0745 39.2708C42.5095 38.8358 42.727 38.28 42.7512 37.6758C42.8237 37.1925 42.7028 36.7333 42.4612 36.3466C41.7603 35.2108 39.9478 34.6791 36.9512 34.6791L33.8337 34.8483L31.7312 33.4466C30.2087 32.19 28.8312 29.9908 27.8645 27.26L27.9612 26.9216C28.7587 23.7075 29.5078 19.8166 27.9128 18.2216C27.7177 18.0322 27.487 17.8834 27.2339 17.7838C26.9808 17.6843 26.7105 17.6359 26.4387 17.6416H25.8587C24.9645 17.6416 24.167 18.5841 23.9495 19.5025C23.0553 22.7166 23.587 24.4808 24.4812 27.405V27.4291C23.877 29.5558 23.1037 32.0208 21.8712 34.51L19.5512 38.86L17.4003 40.0441C14.5003 41.8566 13.1228 43.8866 12.857 45.1675C12.7603 45.6266 12.8087 46.0375 12.9778 46.4725L13.0503 46.5933L14.2103 47.3425L15.2737 47.6083C17.2312 47.6083 19.4545 45.3125 22.4512 40.1891L22.8862 40.02C25.3753 39.2225 28.4687 38.6666 32.6253 38.2075C35.1145 39.44 38.0387 39.9958 39.8753 39.9958C40.9387 39.9958 41.6637 39.73 42.0745 39.2708ZM41.0837 37.555L41.3012 37.8208C41.277 38.0625 41.2045 38.0866 41.0837 38.135H40.987L40.5278 38.1833C39.4162 38.1833 37.7003 37.7241 35.9362 36.9508C36.1537 36.7091 36.2503 36.7091 36.492 36.7091C39.8753 36.7091 40.842 37.3133 41.0837 37.555ZM18.9228 41.0833C17.352 43.9591 15.9262 45.5541 14.8387 45.9166C14.9595 44.9983 16.047 43.4033 17.7628 41.8325L18.9228 41.0833ZM26.2212 24.3841C25.6653 22.2091 25.6412 20.445 26.052 19.43L26.2212 19.14L26.5837 19.2608C26.9945 19.8408 27.0428 20.6141 26.8012 21.9191L26.7287 22.3058L26.342 24.2875L26.2212 24.3841Z" fill="#EF5350" />
              </svg>
              <div className="text-center">
                <label htmlFor="auction-sheet" className="cursor-pointer">
                  <p className="text-sm text-blue-600 hover:text-blue-500 font-medium">Upload a file or drag and drop</p>
                </label>
                <p className="text-xs text-gray-500">PNG, JPG, GIF upto 5MB</p>
              </div>
              <input
                id="auction-sheet"
                type="file"
                accept=".pdf,.doc,.docx,image/*"
                onChange={(e) => e.target.files?.[0] && handleFileUpload('auction', e.target.files[0])}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Car Pictures */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '24px',
          alignSelf: 'stretch'
        }}>
          <h4 className="text-sm font-medium text-black">More Car Pictures (Minimum 4 Pictures)</h4>
          {carPictures.length > 0 ? (
            <div className="flex gap-4 w-full">
              {carPictures.map((file, index) => (
                <div key={index} style={{
                  display: 'flex',
                  width: '120px',
                  height: '80px',
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid rgba(0, 0, 0, 0.12)'
                }}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Car ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <button
                    onClick={() => handleRemoveFile('pictures', index)}
                    style={{
                      display: 'flex',
                      width: '20px',
                      height: '20px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '50%',
                      background: 'rgba(128, 128, 128, 0.8)',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              {carPictures.length < 4 && (
                <div style={{
                  display: 'flex',
                  width: '120px',
                  height: '80px',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '8px',
                  border: '1px dashed rgba(0, 0, 0, 0.50)',
                  background: '#f9f9f9'
                }}>
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                  <div className="text-center">
                    <label htmlFor="car-pictures" className="cursor-pointer">
                      <span className="text-xs font-medium text-blue-600 hover:text-blue-500">
                        Add
                      </span>
                    </label>
                  </div>
                  <input
                    id="car-pictures"
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('pictures', e.target.files[0])}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          ) : (
            <div style={{
              display: 'flex',
              height: '180px',
              padding: '16px',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              alignSelf: 'stretch',
              border: '1px dashed rgba(0, 0, 0, 0.50)',
              borderRadius: '24px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M3 22.5L10.4519 15.0481C11.7211 13.7789 13.7789 13.7789 15.0481 15.0481L22.5 22.5M19.25 19.25L21.8269 16.6731C23.0961 15.4039 25.1539 15.4039 26.4231 16.6731L29 19.25M19.25 9.5H19.2663M6.25 29H25.75C27.5449 29 29 27.5449 29 25.75V6.25C29 4.45507 27.5449 3 25.75 3H6.25C4.45507 3 3 4.45507 3 6.25V25.75C3 27.5449 4.45507 29 6.25 29Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="text-center">
                <label htmlFor="car-pictures" className="cursor-pointer">
                  <p className="text-sm text-blue-600 hover:text-blue-500 font-medium">Upload a file or drag and drop</p>
                </label>
                <p className="text-xs text-gray-500">PNG, JPG, GIF upto 5MB</p>
              </div>
              <input
                id="car-pictures"
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileUpload('pictures', e.target.files[0])}
                className="hidden"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const calculateTotalPrice = () => {
    if (isCalculating) {
      return "Pending...";
    }
    
    // Calculate PKR values directly from amounts and rates
    const auctionPricePKR = parseFloat(formData.auctionPrice || '0') * parseFloat(formData.auctionPriceRate || '0');
    const inlandChargesPKR = parseFloat(formData.inlandCharges || '0') * parseFloat(formData.inlandChargesRate || '0');
    const containerChargesPKR = parseFloat(formData.containerCharges || '0') * parseFloat(formData.containerChargesRate || '0');
    const auctionExpensesPKR = parseFloat(formData.auctionExpenses || '0') * parseFloat(formData.auctionExpensesRate || '0');
    const loadingChargesPKR = parseFloat(formData.loadingCharges || '0') * parseFloat(formData.loadingChargesRate || '0');
    const freightSeaPKR = parseFloat(formData.freightSea || '0') * parseFloat(formData.freightSeaRate || '0');
    
    // Direct PKR values for other fields
    const variantDutyPKR = parseFloat(formData.variantDuty || '0');
    const passportChargesPKR = parseFloat(formData.passportCharges || '0');
    const servicesChargesPKR = parseFloat(formData.servicesCharges || '0');
    const transportChargesPKR = parseFloat(formData.transportCharges || '0');
    const repairChargesPKR = parseFloat(formData.repairCharges || '0');
    const miscellaneousChargesPKR = parseFloat(formData.miscellaneousCharges || '0');
    const vehicleValueCifPKR = parseFloat(formData.vehicleValueCif || '0');
    const landingChargesPKR = parseFloat(formData.landingCharges || '0');
    const customsDutyPKR = parseFloat(formData.customsDuty || '0');
    const salesTaxPKR = parseFloat(formData.salesTax || '0');
    const federalExciseDutyPKR = parseFloat(formData.federalExciseDuty || '0');
    const incomeTaxPKR = parseFloat(formData.incomeTax || '0');
    const freightAndStorageChargesPKR = parseFloat(formData.freightAndStorageCharges || '0');
    const demurragePKR = parseFloat(formData.demurrage || '0');
    const ageOfVehiclePKR = parseFloat(formData.ageOfVehicle || '0');

    const total = auctionPricePKR + inlandChargesPKR + containerChargesPKR + auctionExpensesPKR + loadingChargesPKR + freightSeaPKR + variantDutyPKR + passportChargesPKR + servicesChargesPKR + transportChargesPKR + repairChargesPKR + miscellaneousChargesPKR + vehicleValueCifPKR + landingChargesPKR + customsDutyPKR + salesTaxPKR + federalExciseDutyPKR + incomeTaxPKR + freightAndStorageChargesPKR + demurragePKR + ageOfVehiclePKR;
    return total.toLocaleString();
  };

  return (
    <MainLayout>
      <div className="pt-6">
        {/* Simple Header */}

        <div className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--Black-black-500, #000)' }}>
          <span>Add New Car</span>
        </div>


        {/* Form Content - Full Width */}
        <div className="w-full">
          <div className="bg-white">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Error Message */}
            {error && (
              <div className="px-6 py-4 bg-red-50  border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="px-6 py-4">
              <div className="flex gap-4 w-full">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    style={{
                      display: 'flex',
                      height: '50px',
                      padding: '10px 24px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '10px',
                      flex: '1 0 0',
                      borderRadius: '50px',
                      border: '1px solid rgba(255, 255, 255, 0.24)',
                      background: '#00674F',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={isLoading}
                  style={{
                    display: 'flex',
                    height: '50px',
                    padding: '10px 24px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    flex: currentStep === 1 ? '1 0 0' : '1 0 0',
                    borderRadius: '50px',
                    border: '1px solid rgba(255, 255, 255, 0.24)',
                    background: '#00674F',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.6 : 1
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save & Continue'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup Card */}
      <SuccessPopupCard
        heading="Car Added Successfully"
        message="You have successfully added a new car to the inventory"
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </MainLayout>
  );
}

export default function AddCarPage({ params }: AddCarPageProps) {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading add car form...</p>
          </div>
        </div>
      </MainLayout>
    }>
      <AddCarContent params={params} />
    </Suspense>
  );
}
