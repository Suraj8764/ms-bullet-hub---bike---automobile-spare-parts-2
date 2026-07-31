import { Product, Coupon, BlogArticle, GarageLocation, Review } from '../types';
import { BULLET_AZ_PRODUCTS } from './bulletCatalogData';

export const POPULAR_VEHICLE_MAKES = [
  'Royal Enfield',
  'Hero MotoCorp',
  'Honda Two Wheelers',
  'TVS Motor',
  'Bajaj Auto',
  'Yamaha',
  'Suzuki Motorcycles',
  'KTM',
  'Ather Energy',
  'Ola Electric',
  'Kawasaki',
  'Jawa / Yezdi'
];

export const VEHICLE_MODELS_MAP: Record<string, string[]> = {
  'Royal Enfield': [
    'Bullet 350 (Cast Iron / CI)',
    'Bullet 350 UCE',
    'Bullet 350 J-Series (Reborn)',
    'Classic 350 (UCE)',
    'Classic 350 Reborn (J-Series)',
    'Classic 500',
    'Hunter 350',
    'Meteor 350',
    'Himalayan 411',
    'Himalayan 450',
    'Continental GT 650',
    'Interceptor 650',
    'Super Meteor 650',
    'Shotgun 650',
    'Electra 350',
    'Thunderbird 350 / 500',
    'Scram 411',
    'Standard 350'
  ],
  'Hero MotoCorp': ['Splendor Plus', 'HF Deluxe', 'Glamour', 'Xpulse 200 4V', 'Passion Pro', 'Destini 125', 'Xtreme 160R'],
  'Honda Two Wheelers': ['Activa 6G', 'Shine 125', 'Unicorn', 'Dio 125', 'Hornet 2.0', 'CB350', 'SP 125'],
  'TVS Motor': ['Jupiter 125', 'Apache RTR 160 4V', 'Ntorq 125', 'Raider 125', 'Ronin', 'XL100', 'iQube EV'],
  'Bajaj Auto': ['Pulsar 150', 'Pulsar NS200', 'Chetak EV', 'Platina 110', 'Dominar 400', 'Avenger 220'],
  'Yamaha': ['R15 V4', 'MT-15 V2', 'FZ-S FI', 'Aerox 155', 'Fascino 125', 'RayZR 125'],
  'Suzuki Motorcycles': ['Access 125', 'Burgman Street', 'Gixxer SF 250', 'V-Strom SX'],
  'KTM': ['Duke 200', 'Duke 390', 'RC 390', 'Adventure 390'],
  'Ather Energy': ['450X', '450S', 'Rizta'],
  'Ola Electric': ['S1 Pro', 'S1 Air', 'S1 X'],
  'Kawasaki': ['Ninja 300', 'Z900', 'Ninja 400'],
  'Jawa / Yezdi': ['Jawa 42', 'Yezdi Roadster', 'Jawa Perak']
};

export const FUEL_TYPES = ['Petrol', 'Electric'];

export const CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Brakes & Cables',
    slug: 'brakes-cables',
    icon: 'Disc',
    image: 'https://images.unsplash.com/photo-1600706432523-9881831dd78e?w=500&auto=format&fit=crop&q=80',
    itemCount: 420,
    description: 'Ceramic disc brake pads, drum brake shoes, clutch cables, accelerator cables, and brake levers.'
  },
  {
    id: 'cat-2',
    name: 'Engine & Spark Plugs',
    slug: 'engine-spark-plugs',
    icon: 'Cpu',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&auto=format&fit=crop&q=80',
    itemCount: 580,
    description: 'Iridium spark plugs, piston kits, timing chains, gaskets, carburettors, and cylinder head kits.'
  },
  {
    id: 'cat-3',
    name: 'Chain & Sprocket',
    slug: 'chain-sprocket-clutch',
    icon: 'Cog',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&auto=format&fit=crop&q=80',
    itemCount: 380,
    description: 'Brass heavy-duty drive chains, front/rear sprockets, clutch plates, and friction disc kits.'
  },
  {
    id: 'cat-4',
    name: '4T Oils & Lubricants',
    slug: 'oils-lubricants',
    icon: 'Droplet',
    image: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=500&auto=format&fit=crop&q=80',
    itemCount: 310,
    description: '100% synthetic 4T engine oils, fork oils, chain lube combo sprays, and foam air filters.'
  },
  {
    id: 'cat-5',
    name: 'Electricals & Batteries',
    slug: 'electricals-batteries',
    icon: 'Zap',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=500&auto=format&fit=crop&q=80',
    itemCount: 290,
    description: '12V VRLA maintenance-free bike batteries, LED headlights, indicators, horns, and RR units.'
  },
  {
    id: 'cat-6',
    name: 'Suspension & Shocks',
    slug: 'suspension-shocks',
    icon: 'Wrench',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&auto=format&fit=crop&q=80',
    itemCount: 220,
    description: 'Hydraulic front fork absorbers, gas-charged rear mono-shocks, fork seals, and swingarm bushes.'
  },
  {
    id: 'cat-7',
    name: 'Body Panels & Bike Care',
    slug: 'body-accessories',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=500&auto=format&fit=crop&q=80',
    itemCount: 340,
    description: 'High-impact visors, CNC bar-end side mirrors, crash guards, seat covers, and chain cleaning sprays.'
  }
];

export const TOP_BRANDS = [
  { name: 'Rolon', logo: '', origin: 'India' },
  { name: 'Motul', logo: '', origin: 'France' },
  { name: 'Endurance', logo: '', origin: 'India' },
  { name: 'TVS Genuine', logo: '', origin: 'India' },
  { name: 'Castrol', logo: '', origin: 'UK' },
  { name: 'Exide', logo: '', origin: 'India' },
  { name: 'NGK', logo: '', origin: 'Japan' },
  { name: 'ByBre', logo: '', origin: 'Italy / India' },
  { name: 'Shell Advance', logo: '', origin: 'UK' },
  { name: 'Bosch', logo: '', origin: 'Germany' },
  { name: 'Steelbird', logo: '', origin: 'India' },
  { name: 'Gulf Oil', logo: '', origin: 'USA' }
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-101',
    name: 'Rolon Brass Heavy-Duty Drive Chain & Sprocket Kit',
    slug: 'rolon-brass-chain-sprocket-kit-classic-350',
    sku: 'CSK-ROLON-RE350',
    oemNumber: 'ROL-RE-350-BRS',
    partNumber: 'RLN-520-104',
    category: 'Chain & Sprocket',
    categorySlug: 'chain-sprocket-clutch',
    brand: 'Rolon',
    price: 2250,
    originalPrice: 2990,
    discountPercent: 25,
    rating: 4.9,
    reviewCount: 218,
    stock: 40,
    description: 'Golden brass-plated 520 pitch heavy duty drive chain with hardened front and rear sprockets. Engineered by Rolon specifically for Royal Enfield 350cc motorcycles for zero stretch, quiet operation, and 30,000 KM lifespan.',
    specifications: [
      { label: 'Chain Pitch', value: '520 O-Ring' },
      { label: 'Sprocket Material', value: 'Hardened High-Carbon Steel' },
      { label: 'Front Sprocket Teeth', value: '16T' },
      { label: 'Rear Sprocket Teeth', value: '38T' },
      { label: 'Coating', value: 'Anti-Rust Golden Brass Plating' }
    ],
    compatibleVehicles: [
      { make: 'Royal Enfield', model: 'Classic 350', years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025], fuelType: 'Petrol', engine: '350cc J-Series' },
      { make: 'Royal Enfield', model: 'Hunter 350', years: [2022, 2023, 2024, 2025], fuelType: 'Petrol', engine: '350cc J-Series' },
      { make: 'Royal Enfield', model: 'Bullet 350', years: [2020, 2021, 2022, 2023, 2024, 2025], fuelType: 'Petrol', engine: '350cc UCE/J-Series' },
      { make: 'Royal Enfield', model: 'Meteor 350', years: [2020, 2021, 2022, 2023, 2024, 2025], fuelType: 'Petrol', engine: '350cc J-Series' }
    ],
    images: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80'
    ],
    isBestSeller: true,
    isFeatured: true,
    isTodayDeal: true,
    isTrending: true,
    warranty: '12 Months / 20,000 KM Warranty',
    deliveryDays: 2,
    hsnCode: '87141090',
    gstRate: 18,
    weightKg: 2.8,
    dimensionsCm: '25 x 18 x 8 cm',
    countryOfOrigin: 'India',
    inBoxContents: '1 Brass Drive Chain, 1 Front Sprocket, 1 Rear Sprocket, Master Link'
  },
  {
    id: 'prod-102',
    name: 'Motul 7100 4T 10W-40 100% Synthetic Motorcycle Engine Oil (1 Litre)',
    slug: 'motul-7100-4t-10w40-synthetic-oil-1L',
    sku: 'OIL-MOTUL-7100-1L',
    oemNumber: 'MOT-7100-10W40',
    partNumber: '104092',
    category: '4T Oils & Lubricants',
    categorySlug: 'oils-lubricants',
    brand: 'Motul',
    price: 890,
    originalPrice: 1150,
    discountPercent: 22,
    rating: 4.9,
    reviewCount: 380,
    stock: 85,
    description: '100% Synthetic 4-Stroke motorcycle lubricant formulated with Ester technology. Meets JASO MA2 specification for optimal wet clutch performance, crisp gear shifts, and high temperature protection.',
    specifications: [
      { label: 'Viscosity Grade', value: '10W-40' },
      { label: 'Volume', value: '1 Litre' },
      { label: 'Oil Type', value: '100% Fully Synthetic (Ester Tech)' },
      { label: 'JASO Standard', value: 'JASO MA2' },
      { label: 'API Standard', value: 'API SN' }
    ],
    compatibleVehicles: [
      { make: 'Yamaha', model: 'R15 V4', years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025], fuelType: 'Petrol', engine: '155cc VVA' },
      { make: 'Yamaha', model: 'MT-15 V2', years: [2019, 2020, 2021, 2022, 2023, 2024, 2025], fuelType: 'Petrol', engine: '155cc VVA' },
      { make: 'KTM', model: 'Duke 200', years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025], fuelType: 'Petrol', engine: '200cc DOHC' },
      { make: 'TVS Motor', model: 'Apache RTR 160 4V', years: [2018, 2019, 2020, 2021, 2022, 2023, 2024], fuelType: 'Petrol', engine: '160cc OHC' }
    ],
    images: [
      'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=800&auto=format&fit=crop&q=80'
    ],
    isBestSeller: true,
    isFeatured: true,
    isTodayDeal: false,
    isTrending: true,
    warranty: '100% Genuine Sealed Bottle',
    deliveryDays: 1,
    hsnCode: '27101980',
    gstRate: 18,
    weightKg: 1.0,
    dimensionsCm: '10 x 8 x 22 cm',
    countryOfOrigin: 'France',
    inBoxContents: '1 Litre Sealed Bottle'
  },
  {
    id: 'prod-103',
    name: 'Genuine Honda Activa 6G / 5G Air Filter & Spark Plug Tune-Up Kit',
    slug: 'honda-activa-6g-air-filter-spark-plug-kit',
    sku: 'KIT-HND-ACT6G',
    oemNumber: '17210-K0C-900',
    partNumber: '17210K0C900-SP',
    category: 'Engine & Spark Plugs',
    categorySlug: 'engine-spark-plugs',
    brand: 'Honda Two Wheelers',
    price: 490,
    originalPrice: 650,
    discountPercent: 24,
    rating: 4.8,
    reviewCount: 165,
    stock: 60,
    description: '100% Genuine Honda OEM replacement viscous paper air filter element and original resistance spark plug. Ensures maximum fuel mileage, smooth pickup, and engine protection for Honda Activa and Dio scooters.',
    specifications: [
      { label: 'Filter Type', value: 'Viscous Paper Element' },
      { label: 'Spark Plug Code', value: 'MR7C-9' },
      { label: 'Compatibility', value: 'Honda 110cc BS6 eSP Engines' },
      { label: 'Maintenance Interval', value: '10,000 KM' }
    ],
    compatibleVehicles: [
      { make: 'Honda Two Wheelers', model: 'Activa 6G', years: [2020, 2021, 2022, 2023, 2024, 2025], fuelType: 'Petrol', engine: '110cc eSP' },
      { make: 'Honda Two Wheelers', model: 'Dio 125', years: [2020, 2021, 2022, 2023, 2024, 2025], fuelType: 'Petrol', engine: '110cc / 125cc eSP' },
      { make: 'Honda Two Wheelers', model: 'Shine 125', years: [2020, 2021, 2022, 2023, 2024], fuelType: 'Petrol', engine: '125cc eSP' }
    ],
    images: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600706432523-9881831dd78e?w=800&auto=format&fit=crop&q=80'
    ],
    isBestSeller: true,
    isFeatured: false,
    isTodayDeal: true,
    isTrending: false,
    warranty: 'OEM Quality Guarantee',
    deliveryDays: 2,
    hsnCode: '84213100',
    gstRate: 18,
    weightKg: 0.35,
    dimensionsCm: '20 x 12 x 5 cm',
    countryOfOrigin: 'India',
    inBoxContents: '1 Honda Air Filter, 1 Genuine NGK Spark Plug'
  },
  {
    id: 'prod-104',
    name: 'Exide Xplore 12V 5Ah VRLA Maintenance-Free Motorcycle Battery',
    slug: 'exide-xplore-12v-5ah-vrla-bike-battery',
    sku: 'BAT-EXIDE-FXL0-XTZ5',
    oemNumber: 'XTZ5-12V5AH',
    partNumber: 'FXL0-XPLORE-TZ5',
    category: 'Electricals & Batteries',
    categorySlug: 'electricals-batteries',
    brand: 'Exide',
    price: 1390,
    originalPrice: 1750,
    discountPercent: 20,
    rating: 4.8,
    reviewCount: 290,
    stock: 35,
    description: 'Factory-charged AGM maintenance-free 12V 5Ah VRLA motorcycle battery with leak-proof design and cold cranking power. Ideal for self-start motorcycles and scooters.',
    specifications: [
      { label: 'Voltage', value: '12V DC' },
      { label: 'Capacity', value: '5 Ah' },
      { label: 'Battery Type', value: 'VRLA / AGM Sealed' },
      { label: 'Cranking Amps (CCA)', value: '70A' },
      { label: 'Warranty', value: '48 Months (24M Free + 24M Pro-Rata)' }
    ],
    compatibleVehicles: [
      { make: 'Hero MotoCorp', model: 'Splendor Plus', years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025], fuelType: 'Petrol', engine: '97.2cc i3S' },
      { make: 'Bajaj Auto', model: 'Pulsar 150', years: [2018, 2019, 2020, 2021, 2022, 2023, 2024], fuelType: 'Petrol', engine: '150cc DTS-i' },
      { make: 'Honda Two Wheelers', model: 'Activa 6G', years: [2020, 2021, 2022, 2023, 2024], fuelType: 'Petrol', engine: '110cc eSP' },
      { make: 'TVS Motor', model: 'Jupiter 125', years: [2020, 2021, 2022, 2023, 2024], fuelType: 'Petrol', engine: '124.8cc' }
    ],
    images: [
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&auto=format&fit=crop&q=80'
    ],
    isBestSeller: true,
    isFeatured: true,
    isTodayDeal: true,
    isTrending: true,
    warranty: '48 Months Exide National Warranty',
    deliveryDays: 1,
    hsnCode: '85072000',
    gstRate: 18,
    weightKg: 2.1,
    dimensionsCm: '11 x 7 x 10 cm',
    countryOfOrigin: 'India',
    inBoxContents: '1 Battery, Terminal Screw Set, Warranty Card'
  },
  {
    id: 'prod-105',
    name: 'NGK Iridium IX High Performance Spark Plug (CPR8EAIX-9)',
    slug: 'ngk-iridium-ix-spark-plug-cpr8eaix-9',
    sku: 'SPK-NGK-CPR8EAIX9',
    oemNumber: 'CPR8EAIX-9',
    partNumber: '96067',
    category: 'Engine & Spark Plugs',
    categorySlug: 'engine-spark-plugs',
    brand: 'NGK',
    price: 680,
    originalPrice: 850,
    discountPercent: 20,
    rating: 4.9,
    reviewCount: 140,
    stock: 50,
    description: 'Fine-wire Iridium tip center electrode for ultimate throttle response, superior anti-fouling, and stable combustion under high RPMs.',
    specifications: [
      { label: 'Electrode Material', value: '0.6mm Fine Iridium Tip' },
      { label: 'Thread Size', value: '10mm' },
      { label: 'Reach', value: '19mm' },
      { label: 'Resistor Value', value: '5K Ohm' }
    ],
    compatibleVehicles: [
      { make: 'Honda Two Wheelers', model: 'Shine 125', years: [2018, 2019, 2020, 2021, 2022, 2023, 2024], fuelType: 'Petrol', engine: '125cc' },
      { make: 'Honda Two Wheelers', model: 'Unicorn', years: [2018, 2019, 2020, 2021, 2022, 2023, 2024], fuelType: 'Petrol', engine: '160cc' },
      { make: 'TVS Motor', model: 'Apache RTR 160 4V', years: [2018, 2019, 2020, 2021, 2022, 2023], fuelType: 'Petrol', engine: '160cc' },
      { make: 'Yamaha', model: 'FZ-S FI', years: [2018, 2019, 2020, 2021, 2022, 2023, 2024], fuelType: 'Petrol', engine: '149cc' }
    ],
    images: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80'
    ],
    isBestSeller: false,
    isFeatured: false,
    isTodayDeal: true,
    isTrending: true,
    warranty: 'Genuine NGK Japan Quality',
    deliveryDays: 2,
    hsnCode: '85111000',
    gstRate: 18,
    weightKg: 0.08,
    dimensionsCm: '8 x 3 x 3 cm',
    countryOfOrigin: 'Japan',
    inBoxContents: '1 Iridium Spark Plug'
  },
  {
    id: 'prod-106',
    name: 'Endurance Front Ceramic Disc Brake Pad Kit (Royal Enfield & KTM)',
    slug: 'endurance-front-brake-pad-classic-350-bullet-ktm',
    sku: 'BP-END-RE350F',
    oemNumber: 'END-BP-52310',
    partNumber: 'END-350-DISC',
    category: 'Brakes & Cables',
    categorySlug: 'brakes-cables',
    brand: 'Endurance',
    price: 780,
    originalPrice: 1100,
    discountPercent: 29,
    rating: 4.8,
    reviewCount: 195,
    stock: 45,
    description: 'High friction ceramic formulation with anti-fade technology for heavy motorcycles like Royal Enfield Classic 350, Bullet, and KTM Duke 200.',
    specifications: [
      { label: 'Friction Material', value: 'Organic Ceramic Blend' },
      { label: 'Position', value: 'Front Disc Caliper' },
      { label: 'Thermal Resistance', value: 'Up to 450°C' }
    ],
    compatibleVehicles: [
      { make: 'Royal Enfield', model: 'Classic 350', years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025], fuelType: 'Petrol', engine: '350cc' },
      { make: 'Royal Enfield', model: 'Bullet 350', years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025], fuelType: 'Petrol', engine: '350cc' },
      { make: 'KTM', model: 'Duke 200', years: [2018, 2019, 2020, 2021, 2022, 2023], fuelType: 'Petrol', engine: '200cc' }
    ],
    images: [
      'https://images.unsplash.com/photo-1600706432523-9881831dd78e?w=800&auto=format&fit=crop&q=80'
    ],
    isBestSeller: true,
    isFeatured: true,
    isTodayDeal: false,
    isTrending: true,
    warranty: '6 Months Guarantee',
    deliveryDays: 2,
    hsnCode: '87141090',
    gstRate: 18,
    weightKg: 0.4,
    dimensionsCm: '10 x 8 x 4 cm',
    countryOfOrigin: 'India',
    inBoxContents: '1 Pair Front Brake Pads'
  },
  {
    id: 'prod-107',
    name: 'Castrol Power1 Ultimate 4T 10W-30 Full Synthetic Bike Oil (1 Litre)',
    slug: 'castrol-power1-ultimate-4t-10w30-1L',
    sku: 'OIL-CAS-PWR1-1L',
    oemNumber: 'CAS-P1-10W30',
    partNumber: '342918',
    category: '4T Oils & Lubricants',
    categorySlug: 'oils-lubricants',
    brand: 'Castrol',
    price: 750,
    originalPrice: 950,
    discountPercent: 21,
    rating: 4.7,
    reviewCount: 210,
    stock: 55,
    description: '5-in-1 Full Synthetic formula delivering acceleration, engine protection, smooth riding, cooler operation, and long endurance for modern motorcycles.',
    specifications: [
      { label: 'Viscosity Grade', value: '10W-30' },
      { label: 'Volume', value: '1 Litre' },
      { label: 'JASO Standard', value: 'JASO MA2' }
    ],
    compatibleVehicles: [
      { make: 'Hero MotoCorp', model: 'Splendor Plus', years: [2018, 2019, 2020, 2021, 2022, 2023, 2024], fuelType: 'Petrol', engine: '97.2cc' },
      { make: 'Honda Two Wheelers', model: 'Shine 125', years: [2018, 2019, 2020, 2021, 2022, 2023, 2024], fuelType: 'Petrol', engine: '125cc' },
      { make: 'TVS Motor', model: 'Raider 125', years: [2021, 2022, 2023, 2024, 2025], fuelType: 'Petrol', engine: '124.8cc' }
    ],
    images: [
      'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800&auto=format&fit=crop&q=80'
    ],
    isBestSeller: false,
    isFeatured: false,
    isTodayDeal: true,
    isTrending: false,
    warranty: 'Sealed Genuine Bottle',
    deliveryDays: 1,
    hsnCode: '27101980',
    gstRate: 18,
    weightKg: 0.95,
    dimensionsCm: '10 x 8 x 22 cm',
    countryOfOrigin: 'India',
    inBoxContents: '1 Litre Bottle'
  },
  {
    id: 'prod-108',
    name: 'Motul C1 Chain Clean + C2 Chain Lube Combo Spray (400ml + 400ml)',
    slug: 'motul-c1-c2-chain-care-combo-kit',
    sku: 'LUB-MOTUL-C1C2-COMBO',
    oemNumber: 'MOT-C1C2-400',
    partNumber: '102981-2',
    category: 'Body Panels & Bike Care',
    categorySlug: 'body-accessories',
    brand: 'Motul',
    price: 990,
    originalPrice: 1350,
    discountPercent: 26,
    rating: 4.9,
    reviewCount: 340,
    stock: 70,
    description: 'Essential two-wheel drive chain maintenance kit. C1 Chain Clean removes grease, road dirt and sand; C2 Chain Lube leaves a tacky protective layer for O/X-ring drive chains.',
    specifications: [
      { label: 'Cleaner Volume', value: '400ml Spray' },
      { label: 'Lube Volume', value: '400ml Spray' },
      { label: 'Chain Type', value: 'O-Ring, X-Ring, Z-Ring Compatible' }
    ],
    compatibleVehicles: [
      { make: 'Royal Enfield', model: 'Classic 350', years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025], fuelType: 'Petrol', engine: '350cc' },
      { make: 'Yamaha', model: 'R15 V4', years: [2018, 2019, 2020, 2021, 2022, 2023, 2024], fuelType: 'Petrol', engine: '155cc' },
      { make: 'KTM', model: 'Duke 390', years: [2018, 2019, 2020, 2021, 2022, 2023, 2024], fuelType: 'Petrol', engine: '373cc' },
      { make: 'Bajaj Auto', model: 'Pulsar NS200', years: [2018, 2019, 2020, 2021, 2022, 2023, 2024], fuelType: 'Petrol', engine: '200cc' }
    ],
    images: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80'
    ],
    isBestSeller: true,
    isFeatured: true,
    isTodayDeal: true,
    isTrending: true,
    warranty: 'Genuine Motul Product',
    deliveryDays: 1,
    hsnCode: '34031900',
    gstRate: 18,
    weightKg: 0.9,
    dimensionsCm: '15 x 8 x 25 cm',
    countryOfOrigin: 'France',
    inBoxContents: '1 Motul C1 Chain Clean 400ml, 1 Motul C2 Chain Lube 400ml'
  },
  ...BULLET_AZ_PRODUCTS
];

export const COUPONS: Coupon[] = [
  {
    code: 'RIDE100',
    discountPercent: 10,
    maxDiscount: 150,
    minOrderValue: 999,
    expiryDate: '2026-12-31',
    description: 'Flat 10% OFF up to ₹150 on all bike spare parts above ₹999.',
    active: true
  },
  {
    code: 'BIKE20',
    discountPercent: 20,
    maxDiscount: 300,
    minOrderValue: 1999,
    expiryDate: '2026-12-31',
    description: 'Flat 20% OFF on major bike repair kits and chain sprocket sets.',
    active: true
  },
  {
    code: 'FIRST10',
    discountPercent: 10,
    maxDiscount: 100,
    minOrderValue: 499,
    expiryDate: '2026-12-31',
    description: 'Welcome discount for new riders shopping at MS BULLET HUB.',
    active: true
  }
];

export const BLOGS: BlogArticle[] = [
  {
    id: 'blog-1',
    title: 'How to Clean & Lube Your Motorcycle Drive Chain at Home in 4 Easy Steps',
    slug: 'clean-lube-motorcycle-chain-guide',
    excerpt: 'Extend your Rolon or OEM drive chain life to 30,000 KM with proper cleaning using Motul C1/C2 sprays every 500 KM.',
    content: 'Regular motorcycle drive chain lubrication prevents dry metal friction, rust, and premature sprocket tooth wear...',
    author: 'Sunil Rout (MS BULLET HUB Master Mechanic)',
    date: '2026-07-20',
    readTime: '4 Min Read',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80',
    category: 'DIY Bike Care'
  },
  {
    id: 'blog-2',
    title: '4T Engine Oil Viscosity Grade Guide: 10W-30 vs 10W-40 for Indian Summers',
    slug: '4t-engine-oil-viscosity-guide-summer',
    excerpt: 'Should you choose Motul 7100 10W-40 or Castrol Power1 10W-30 for Royal Enfield, Pulsar or Activa in peak summer heat?',
    content: 'Understanding JASO MA2 standards and viscosity ratings ensures maximum wet clutch engagement and engine life...',
    author: 'Rakesh Verma (Lube Specialist)',
    date: '2026-07-15',
    readTime: '6 Min Read',
    image: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=600&auto=format&fit=crop&q=80',
    category: 'Lubricants & Engine'
  },
  {
    id: 'blog-3',
    title: 'Brake Pad vs Brake Shoe Replacement Guide for Bikes & Scooters',
    slug: 'brake-pad-vs-shoe-replacement-guide',
    excerpt: 'Recognize early warning signs like squeaking discs, spongy brake levers, or long stopping distances on wet roads.',
    content: 'Disc brakes on modern bikes rely on ceramic friction pads while drum rear brakes use bonded friction shoes...',
    author: 'Anil Pradhan (Two-Wheeler Brake Tech)',
    date: '2026-07-08',
    readTime: '5 Min Read',
    image: 'https://images.unsplash.com/photo-1600706432523-9881831dd78e?w=600&auto=format&fit=crop&q=80',
    category: 'Safety & Brakes'
  }
];

export const GARAGES: GarageLocation[] = [
  {
    id: 'gar-1',
    name: 'MS BULLET HUB Two-Wheeler Hub & Royal Enfield Specialist',
    address: 'Plot 88, Sahid Nagar, Near Janpath',
    city: 'Bhubaneswar',
    state: 'Odisha',
    pincode: '751007',
    phone: '+91 98765 11223',
    distanceKm: 2.4,
    rating: 4.9,
    reviewsCount: 312,
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&auto=format&fit=crop&q=80',
    services: ['Chain Sprocket Replacement', '4T Oil Change & Engine Tune-Up', 'Disc Brake Pad Fitting', 'Carburettor Tuning']
  },
  {
    id: 'gar-2',
    name: 'Speed2Wheels Certified Multi-Brand Bike Workshop',
    address: 'Badambadi Square, Near Bus Stand',
    city: 'Cuttack',
    state: 'Odisha',
    pincode: '753012',
    phone: '+91 98765 44556',
    distanceKm: 22.1,
    rating: 4.8,
    reviewsCount: 184,
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&auto=format&fit=crop&q=80',
    services: ['Scooter CVT Transmission Service', '12V Battery Replacement', 'Front Fork Oil Seal Overhaul']
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-101',
    customerName: 'Biswajit Sahoo',
    rating: 5,
    title: 'Transformed my Classic 350 ride smoothness!',
    comment: 'The Rolon brass chain kit fits my 2023 Classic 350 J-Series like a charm. Zero chain slack noise and high quality golden finish.',
    date: '2026-07-22',
    verifiedPurchase: true
  },
  {
    id: 'rev-2',
    productId: 'prod-102',
    customerName: 'Priya Ranjan Das',
    rating: 5,
    title: '100% Original Motul 7100 Ester Oil!',
    comment: 'Scanned the Motul authenticity QR code and it checked out green. Gear shifting on my Yamaha R15 V4 became butter smooth.',
    date: '2026-07-18',
    verifiedPurchase: true
  }
];
