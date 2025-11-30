import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductFilters = ({ onFilterChange, activeFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const filterCategories = [
    {
      id: 'type',
      label: 'Product Type',
      options: [
        { value: 'cleanser', label: 'Cleanser' },
        { value: 'moisturizer', label: 'Moisturizer' },
        { value: 'serum', label: 'Serum' },
        { value: 'sunscreen', label: 'Sunscreen' },
        { value: 'toner', label: 'Toner' },
        { value: 'mask', label: 'Face Mask' }
      ]
    },
    {
      id: 'priceRange',
      label: 'Price Range',
      options: [
        { value: '0-25', label: 'Under $25' },
        { value: '25-50', label: '$25 - $50' },
        { value: '50-100', label: '$50 - $100' },
        { value: '100+', label: 'Over $100' }
      ]
    },
    {
      id: 'concerns',
      label: 'Skin Concerns',
      options: [
        { value: 'acne', label: 'Acne & Blemishes' },
        { value: 'dryness', label: 'Dryness' },
        { value: 'sensitivity', label: 'Sensitivity' },
        { value: 'aging', label: 'Anti-Aging' },
        { value: 'pores', label: 'Large Pores' },
        { value: 'pigmentation', label: 'Dark Spots' }
      ]
    }
  ];

  const handleFilterToggle = (category, value) => {
    const currentFilters = activeFilters?.[category] || [];
    const newFilters = currentFilters?.includes(value)
      ? currentFilters?.filter(f => f !== value)
      : [...currentFilters, value];
    
    onFilterChange(category, newFilters);
  };

  const clearAllFilters = () => {
    filterCategories?.forEach(category => {
      onFilterChange(category?.id, []);
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters)?.reduce((total, filters) => total + filters?.length, 0);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-accent" />
          <h3 className="font-semibold text-foreground">Filter Products</h3>
          {getActiveFilterCount() > 0 && (
            <div className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
              {getActiveFilterCount()}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {getActiveFilterCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              iconName="X"
              iconPosition="left"
              className="text-sm"
            >
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            className="md:hidden"
          >
            {isExpanded ? 'Hide' : 'Show'} Filters
          </Button>
        </div>
      </div>
      <div className={`${isExpanded ? 'block' : 'hidden'} md:block`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filterCategories?.map((category) => (
            <div key={category?.id}>
              <h4 className="font-medium text-foreground mb-3">{category?.label}</h4>
              <div className="space-y-2">
                {category?.options?.map((option) => {
                  const isActive = (activeFilters?.[category?.id] || [])?.includes(option?.value);
                  return (
                    <button
                      key={option?.value}
                      onClick={() => handleFilterToggle(category?.id, option?.value)}
                      className={`flex items-center space-x-2 w-full text-left p-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-accent/10 text-accent border border-accent/20' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        isActive ? 'border-accent bg-accent' : 'border-muted-foreground/30'
                      }`}>
                        {isActive && (
                          <Icon name="Check" size={12} className="text-accent-foreground" />
                        )}
                      </div>
                      <span className="text-sm">{option?.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;