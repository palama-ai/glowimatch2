import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handlePurchaseClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(price);
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(<Icon key={i} name="Star" size={14} className="text-yellow-400 fill-current" />);
    }

    if (hasHalfStar) {
      stars?.push(<Icon key="half" name="StarHalf" size={14} className="text-yellow-400 fill-current" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars?.push(<Icon key={`empty-${i}`} name="Star" size={14} className="text-gray-300" />);
    }

    return stars;
  };

  return (
    <div 
      className={`bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 animate-scale-hover ${
        isHovered ? 'shadow-lg shadow-accent/20 border-accent/30' : 'hover:shadow-md'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden h-48">
        <Image
          src={product?.image}
          alt={product?.imageAlt}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {product?.badge && (
          <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
            {product?.badge}
          </div>
        )}
        <div className="absolute top-3 right-3">
          <button className="w-8 h-8 bg-background/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-background transition-colors">
            <Icon name="Heart" size={16} className="text-muted-foreground hover:text-accent" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-foreground text-lg leading-tight mb-1">
            {product?.name}
          </h3>
          <p className="text-sm text-muted-foreground">{product?.brand}</p>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            {getRatingStars(product?.rating)}
          </div>
          <span className="text-sm text-muted-foreground">
            ({product?.reviewCount} reviews)
          </span>
        </div>

        <p className="text-sm text-foreground mb-4 line-clamp-2">
          {product?.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-foreground">
              {formatPrice(product?.price)}
            </span>
            {product?.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product?.originalPrice)}
              </span>
            )}
          </div>
          {product?.originalPrice && (
            <div className="bg-success/10 text-success px-2 py-1 rounded-full text-xs font-medium">
              Save {Math.round(((product?.originalPrice - product?.price) / product?.originalPrice) * 100)}%
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Button
            variant="default"
            fullWidth
            onClick={() => handlePurchaseClick(product?.purchaseUrl)}
            iconName="ShoppingCart"
            iconPosition="left"
            className="animate-scale-hover"
          >
            Buy Now
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={() => handlePurchaseClick(product?.detailsUrl)}
            iconName="ExternalLink"
            iconPosition="right"
            className="text-sm"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;