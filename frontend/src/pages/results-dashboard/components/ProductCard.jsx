import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handlePurchaseClick = (url) => {
    // Normalize URL: add https:// if no protocol is specified
    let normalizedUrl = url;
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      normalizedUrl = `https://${url}`;
    }
    window.open(normalizedUrl, '_blank', 'noopener,noreferrer');
  };

  const formatPrice = (price) => {
    if (!price) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(price);
  };

  // Normalize field names (handle both API normalized and DB raw field names)
  const productImage = product?.image || product?.image_url;
  const productPurchaseUrl = product?.purchaseUrl || product?.purchase_url || '#';
  const productOriginalPrice = product?.originalPrice || product?.original_price;
  const productRating = product?.rating || 4.5;
  const productReviewCount = product?.reviewCount || 0;

  const discount = productOriginalPrice && product?.price
    ? Math.round(((productOriginalPrice - product.price) / productOriginalPrice) * 100)
    : null;

  return (
    <div
      className={`group relative bg-background rounded-2xl overflow-hidden border transition-all duration-300 ${isHovered
        ? 'border-accent/40 shadow-xl shadow-accent/10'
        : 'border-border/50 hover:border-border'
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-muted/30">
        <Image
          src={productImage}
          alt={product?.imageAlt || product?.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {/* AI Match Score Badge */}
          {product?.aiVoting?.voteCount > 0 && (
            <span className="px-2.5 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
              <Icon name="Sparkles" size={12} />
              {Math.round(product.aiVoting.avgScore * 10)}% Match
            </span>
          )}
          {product?.badge && (
            <span className="px-2.5 py-1 bg-foreground text-background text-xs font-medium rounded-full">
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="px-2.5 py-1 bg-accent text-white text-xs font-medium rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button className="absolute top-3 right-3 w-9 h-9 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-background">
          <Icon name="Heart" size={16} className="text-muted-foreground hover:text-accent transition-colors" />
        </button>

        {/* Quick Action Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handlePurchaseClick(productPurchaseUrl)}
            className="w-full py-2.5 bg-white text-foreground text-sm font-medium rounded-xl hover:bg-accent hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <Icon name="ShoppingBag" size={16} />
            Quick Buy
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Brand */}
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          {product?.brand}
        </p>

        {/* Name */}
        <h3 className="font-medium text-foreground mb-2 line-clamp-2 leading-snug">
          {product?.name}
        </h3>

        {/* AI Recommendation Reason */}
        {product?.aiVoting?.reasons?.length > 0 && (
          <p className="text-xs text-purple-600 mb-2 line-clamp-1 italic">
            ✨ {product.aiVoting.reasons[0]}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center">
            <Icon name="Star" size={14} className="text-amber-400 fill-amber-400" />
          </div>
          <span className="text-sm font-medium text-foreground">{productRating}</span>
          {productReviewCount > 0 && (
            <span className="text-xs text-muted-foreground">({productReviewCount?.toLocaleString()})</span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          {formatPrice(product?.price) && (
            <span className="text-lg font-bold text-foreground">
              {formatPrice(product?.price)}
            </span>
          )}
          {productOriginalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(productOriginalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
