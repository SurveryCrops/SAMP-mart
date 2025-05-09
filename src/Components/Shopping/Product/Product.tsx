import { useState, useEffect } from "react";
import { Search, Star } from "lucide-react";
import * as React from "react";
// Material UI imports
import Slider from "@mui/material/Slider";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClearIcon from "@mui/icons-material/Clear";

// Define TypeScript interfaces
interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  thumbnail: string;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
}

interface ApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

interface PriceRange {
  min: number | null;
  max: number | null;
}

// Main component
export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [brandSearchTerm, setBrandSearchTerm] = useState("");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [itemsToShow, setItemsToShow] = useState(20);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: null,
    max: null,
  });

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<string[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  // UI states
  const [priceInputMin, setPriceInputMin] = useState<string>("");
  const [priceInputMax, setPriceInputMax] = useState<string>("");
  const [priceSliderValue, setPriceSliderValue] = useState<number>(0);
  const [maxPriceValue, setMaxPriceValue] = useState<number>(100000);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Fetch products from the actual API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://dummyjson.com/products?limit=194"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data: ApiResponse = await response.json();
        setProducts(data.products);

        // Extract and set available brands
        const brands = Array.from(
          new Set(
            data.products
              .map((product) => product.brand)
              .filter(Boolean) as string[]
          )
        );
        setAvailableBrands(brands.sort());
        setFilteredBrands(brands.sort());

        // Extract and set available categories
        const categories = Array.from(
          new Set(
            data.products
              .map((product) => product.category)
              .filter(Boolean) as string[]
          )
        );
        setAvailableCategories(categories.sort());
        setFilteredCategories(categories.sort());

        // Find min and max prices
        const prices = data.products.map((product) => product.price);
        setMinPrice(Math.min(...prices));
        setMaxPrice(Math.max(...prices));
        setMaxPriceValue(Math.max(...prices) + 1000);

        setDisplayedProducts(data.products.slice(0, itemsToShow));
        setLoading(false);
      } catch (err) {
        setError("Error fetching products. Please try again later.");
        setLoading(false);
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  // Apply all filters and search
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...products];

      // Apply search filter
      if (searchTerm.trim() !== "") {
        filtered = filtered.filter(
          (product) =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.category &&
              product.category
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (product.brand &&
              product.brand.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      // Apply brand filter
      if (selectedBrands.length > 0) {
        filtered = filtered.filter(
          (product) => product.brand && selectedBrands.includes(product.brand)
        );
      }

      // Apply category filter
      if (selectedCategories.length > 0) {
        filtered = filtered.filter(
          (product) =>
            product.category && selectedCategories.includes(product.category)
        );
      }

      // Fix: Apply price range filter with the correct price comparison
      if (priceRange.min !== null || priceRange.max !== null) {
        filtered = filtered.filter((product) => {
          const productPriceInRupees = product.price * 85;
          const meetsMinCriteria =
            priceRange.min === null || productPriceInRupees >= priceRange.min;
          const meetsMaxCriteria =
            priceRange.max === null || productPriceInRupees <= priceRange.max;
          return meetsMinCriteria && meetsMaxCriteria;
        });
      }

      setDisplayedProducts(filtered.slice(0, itemsToShow));
    };

    applyFilters();
  }, [
    searchTerm,
    products,
    itemsToShow,
    selectedBrands,
    selectedCategories,
    priceRange,
  ]);

  // Filter brands based on search
  useEffect(() => {
    if (brandSearchTerm.trim() === "") {
      setFilteredBrands(availableBrands);
    } else {
      const filtered = availableBrands.filter((brand) =>
        brand.toLowerCase().includes(brandSearchTerm.toLowerCase())
      );
      setFilteredBrands(filtered);
    }
  }, [brandSearchTerm, availableBrands]);

  // Filter categories based on search
  useEffect(() => {
    if (categorySearchTerm.trim() === "") {
      setFilteredCategories(availableCategories);
    } else {
      const filtered = availableCategories.filter((category) =>
        category.toLowerCase().includes(categorySearchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [categorySearchTerm, availableCategories]);

  // Load more products
  const handleLoadMore = () => {
    setItemsToShow((prevCount) => prevCount + 20);
  };

  // Handle product click to view details
  const handleProductClick = (productId: number) => {
    // In a real application, this would navigate to a product details page
    alert(`Navigating to product details for ID: ${productId}`);
  };

  // Calculate original price from discount
  const calculateOriginalPrice = (
    price: number,
    discountPercentage: number
  ) => {
    if (!discountPercentage) return price;
    return Math.round((price / (1 - discountPercentage / 100)) * 100) / 100;
  };

  // Handle brand selection
  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) => {
      if (prev.includes(brand)) {
        return prev.filter((b) => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
  };

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Handle price range change
  const handlePriceRangeSubmit = () => {
    const min = priceInputMin ? parseInt(priceInputMin) : null;
    const max = priceInputMax ? parseInt(priceInputMax) : null;
    setPriceRange({
      min: min !== null ? min : null, // Remove the division by 85
      max: max !== null ? max : null, // Remove the division by 85
    });
  };

  // Handle price slider change
  const handleSliderChange = (
    event: Event | null,
    newValue: number | number[]
  ) => {
    if (newValue === undefined || newValue === null) return;

    const sliderValue = Array.isArray(newValue) ? newValue[0] : newValue;
    setPriceSliderValue(sliderValue);

    if (maxPriceValue) {
      // Convert percentage to real price in INR
      const calculatedMax = Math.floor(
        (sliderValue / 100) * maxPriceValue * 85
      );

      setPriceRange({
        min: null,
        max: calculatedMax > 0 ? calculatedMax : null,
      });

      setPriceInputMax(calculatedMax > 0 ? calculatedMax.toString() : "");
    }
  };

  // Toggle show all brands
  const handleShowAllBrands = () => {
    setShowAllBrands(!showAllBrands);
  };

  // Toggle show all categories
  const handleShowAllCategories = () => {
    setShowAllCategories(!showAllCategories);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setPriceRange({ min: null, max: null });
    setPriceInputMin("");
    setPriceInputMax("");
    setPriceSliderValue(0);
    setBrandSearchTerm("");
    setCategorySearchTerm("");
    setFilteredBrands(availableBrands);
    setFilteredCategories(availableCategories);
  };

  // Display rating stars
  const RatingStars = ({ rating }: { rating?: number }) => {
    if (!rating) return null;

    const ratingRounded = Math.round(rating * 10) / 10;

    return (
      <div className="flex items-center">
        <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
          {ratingRounded} <Star size={12} className="ml-1" />
        </div>
      </div>
    );
  };

  // Determine how many brands to display
  const brandsToDisplay = showAllBrands
    ? filteredBrands
    : filteredBrands.slice(0, 10);

  // Determine how many categories to display
  const categoriesToDisplay = showAllCategories
    ? filteredCategories
    : filteredCategories.slice(0, 10);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with search */}
      <header className="bg-white shadow-md py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Product Catalog
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search products by name, category, or brand..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </header>

      {/* Main content with sidebar */}
      <main className="flex-grow container mx-auto px-4 py-8 flex">
        {/* Sidebar filter with Material UI */}
        <aside className="w-64 flex-shrink-0 mr-6">
          {/* Price filter */}
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="price-filter-content"
              id="price-filter-header"
            >
              <Typography variant="subtitle1" fontWeight="bold">
                PRICE
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="mb-4">
                <Slider
                  value={priceSliderValue}
                  onChange={handleSliderChange}
                  aria-label="Price Range"
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) =>
                    `₹${Math.floor(
                      (value / 100) * maxPriceValue * 85
                    ).toLocaleString()}`
                  }
                />
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <FormControl size="small" fullWidth>
                  <InputLabel id="min-price-label">Min</InputLabel>
                  <Select
                    labelId="min-price-label"
                    id="min-price"
                    value={priceInputMin}
                    label="Min"
                    onChange={(e) => setPriceInputMin(e.target.value)}
                  >
                    // In the MenuItem components for Min price
                    <MenuItem value="">Min</MenuItem>
                    <MenuItem value="0">₹0</MenuItem>
                    <MenuItem value="10000">₹10,000</MenuItem>
                    <MenuItem value="25000">₹25,000</MenuItem>
                    <MenuItem value="50000">₹50,000</MenuItem>
                    <MenuItem value="100000">₹1,00,000</MenuItem>
                  </Select>
                </FormControl>

                <Typography color="text.secondary">to</Typography>

                <FormControl size="small" fullWidth>
                  <InputLabel id="max-price-label">Max</InputLabel>
                  <Select
                    labelId="max-price-label"
                    id="max-price"
                    value={priceInputMax}
                    label="Max"
                    onChange={(e) => setPriceInputMax(e.target.value)}
                  >
                    // In the MenuItem components for Max price
                    <MenuItem value="">Max</MenuItem>
                    <MenuItem value="25000">₹25,000</MenuItem>
                    <MenuItem value="50000">₹50,000</MenuItem>
                    <MenuItem value="100000">₹1,00,000</MenuItem>
                    <MenuItem value="500000">₹5,00,000+</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <Button
                variant="contained"
                fullWidth
                onClick={handlePriceRangeSubmit}
              >
                Apply
              </Button>
            </AccordionDetails>
          </Accordion>

          {/* Category filter */}
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="category-filter-content"
              id="category-filter-header"
            >
              <Typography variant="subtitle1" fontWeight="bold">
                CATEGORY
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                variant="outlined"
                placeholder="Search Category"
                size="small"
                fullWidth
                className="mb-4"
                value={categorySearchTerm}
                onChange={(e) => setCategorySearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} />
                    </InputAdornment>
                  ),
                }}
              />

              <div className="space-y-1 max-h-60 overflow-y-auto">
                {categoriesToDisplay.map((category) => (
                  <FormControlLabel
                    key={category}
                    control={
                      <Checkbox
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        size="small"
                      />
                    }
                    label={category.charAt(0).toUpperCase() + category.slice(1)}
                  />
                ))}
              </div>

              {filteredCategories.length > 10 && (
                <Button
                  color="primary"
                  size="small"
                  className="mt-2"
                  onClick={handleShowAllCategories}
                >
                  {showAllCategories
                    ? "SHOW LESS"
                    : `${filteredCategories.length - 10} MORE`}
                </Button>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Brand filter */}
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="brand-filter-content"
              id="brand-filter-header"
            >
              <Typography variant="subtitle1" fontWeight="bold">
                BRAND
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                variant="outlined"
                placeholder="Search Brand"
                size="small"
                fullWidth
                className="mb-4"
                value={brandSearchTerm}
                onChange={(e) => setBrandSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} />
                    </InputAdornment>
                  ),
                }}
              />

              <div className="space-y-1 max-h-60 overflow-y-auto">
                {brandsToDisplay.map((brand) => (
                  <FormControlLabel
                    key={brand}
                    control={
                      <Checkbox
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                        size="small"
                      />
                    }
                    label={brand}
                  />
                ))}
              </div>

              {filteredBrands.length > 10 && (
                <Button
                  color="primary"
                  size="small"
                  className="mt-2"
                  onClick={handleShowAllBrands}
                >
                  {showAllBrands
                    ? "SHOW LESS"
                    : `${filteredBrands.length - 10} MORE`}
                </Button>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Clear all filters button */}
          {(selectedBrands.length > 0 ||
            selectedCategories.length > 0 ||
            priceRange.min !== null ||
            priceRange.max !== null) && (
            <div className="p-4">
              <Button
                variant="outlined"
                fullWidth
                startIcon={<ClearIcon />}
                onClick={clearAllFilters}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </aside>

        {/* Product listing */}
        <div className="flex-grow">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">{error}</div>
          ) : (
            <>
              <div className="space-y-6">
                {displayedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Product Image */}
                      <div className="relative md:w-60 h-60 flex-shrink-0">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/api/placeholder/400/320";
                          }}
                        />
                        <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md"></button>
                        {product.brand && (
                          <div className="absolute right-16  bg-white px-2 py-1 text-xs font-semibold text-gray-800 rounded shadow-sm">
                            {product.brand}
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="p-4 flex-grow">
                        <div className="mb-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {product.category
                                ? product.category.charAt(0).toUpperCase() +
                                  product.category.slice(1)
                                : ""}
                            </span>
                            {product.rating && (
                              <div className="flex items-center space-x-1">
                                <RatingStars rating={product.rating} />
                                <span className="text-xs text-gray-500 ml-1">
                                  {product.reviews ? product.reviews.length : 0}{" "}
                                  Reviews
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <h2 className="text-lg font-semibold text-gray-800 mb-2">
                          {product.brand && (
                            <span className="font-normal text-gray-600">
                              {product.brand}{" "}
                            </span>
                          )}
                          {product.title}
                        </h2>

                        <ul className="text-sm text-gray-600 mb-4 space-y-1">
                          {product.description && (
                            <li className="line-clamp-2">
                              {product.description}
                            </li>
                          )}
                          {product.stock !== undefined && (
                            <li>Stock: {product.stock} units</li>
                          )}
                          {product.warrantyInformation && (
                            <li>{product.warrantyInformation}</li>
                          )}
                        </ul>

                        {/* Price */}
                        <div className="mt-auto">
                          <div className="flex items-center mb-2">
                            <span className="text-xl font-bold text-gray-900">
                              ₹{(product.price * 85).toLocaleString()}
                            </span>

                            {product.discountPercentage && (
                              <>
                                <span className="ml-2 text-sm text-gray-500 line-through">
                                  ₹
                                  {(
                                    calculateOriginalPrice(
                                      product.price,
                                      product.discountPercentage
                                    ) * 85
                                  ).toLocaleString()}
                                </span>
                                <span className="ml-2 text-sm font-medium text-green-600">
                                  {Math.round(product.discountPercentage)}% off
                                </span>
                              </>
                            )}
                          </div>

                          {product.shippingInformation && (
                            <div className="text-sm text-green-600 font-medium mb-2">
                              Free delivery
                            </div>
                          )}

                          {/* Special tags */}
                          {product.tags &&
                            product.tags.includes("top-discount") && (
                              <div className="text-sm text-purple-600 font-medium mb-2">
                                Top Discount of the Sale
                              </div>
                            )}

                          <button
                            onClick={() => handleProductClick(product.id)}
                            className="mt-2 py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-300"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {displayedProducts.length < products.length &&
                displayedProducts.length > 0 && (
                  <div className="text-center mt-8">
                    <button
                      onClick={handleLoadMore}
                      className="py-2 px-6 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-300"
                    >
                      Load More
                    </button>
                  </div>
                )}

              {displayedProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No products found matching your search or filters.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Product Catalog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
