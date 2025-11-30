import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const FeatureHighlights = () => {
  const features = [
  {
    id: 1,
    title: "Interactive Skin Quiz",
    description: "Answer 8-10 personalized questions about your skin concerns, lifestyle, and preferences to help our AI understand your unique needs.",
    icon: "MessageSquare",
    image: "https://images.unsplash.com/photo-1637851362556-46d07c374023",
    imageAlt: "Woman with glowing skin touching her face gently in natural lighting",
    color: "from-pink-500",
    benefits: [
      "Dynamic questions based on your responses",
      "Covers all skin types and concerns",
      "Saves your quiz history"
    ]
  },
  {
    id: 2,
    title: "AI Image Analysis",
    description: "Upload photos of your face, hands, or legs for advanced AI-powered skin analysis that detects dryness, acne, and determines your skin type.",
    icon: "Camera",
    image: "https://images.unsplash.com/photo-1724863448649-2c8815db09a6",
    imageAlt: "Close-up of smartphone camera taking a selfie with woman's face visible on screen",
    color: "from-purple-500",
    benefits: [
      "Confidence percentage for accuracy",
      "Instant analysis results",
      "Multi-body area scanning"
    ]
  },
  {
    id: 3,
    title: "Smart Product Matching",
    description: "Receive curated cosmetic recommendations with detailed product information, prices, and direct purchase links tailored to your skin analysis results.",
    icon: "ShoppingBag",
    image: "https://images.unsplash.com/photo-1685764289919-90136fb41df7",
    imageAlt: "Elegant cosmetic products including moisturizer, serum bottles and makeup arranged on marble surface",
    color: "from-orange-500",
    benefits: [
      "Curated product recommendations",
      "Direct purchase links included",
      "Price comparisons & reviews"
    ]
  }];


  return (
    <section className="py-20 bg-gradient-to-b from-background via-pink-50/10 dark:via-pink-950/10 to-background">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-up">
          <div className="inline-flex items-center justify-center mb-4 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full">
            <Icon name="Sparkles" size={16} className="text-accent mr-2" />
            <span className="text-sm font-semibold text-accent">How It Works</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            How GlowMatch Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Our three-step process combines advanced AI technology with personalized assessment to find your perfect beauty match.
          </p>
        </div>

        {/* Features Grid */}
        <div className="space-y-24">
          {features?.map((feature, index) =>
          <div key={feature?.id} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 animate-fade-up`}>
              {/* Content */}
              <div className="flex-1 space-y-8">
                {/* Icon & Number */}
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature?.color} to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20`}>
                    <Icon name={feature?.icon} size={32} color="white" />
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full flex items-center justify-center border-2 border-accent/30">
                    <span className="text-lg font-bold text-transparent bg-gradient-to-r from-accent to-secondary bg-clip-text">{index + 1}</span>
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-3xl lg:text-4xl font-bold text-foreground">
                  {feature?.title}
                </h3>
                
                {/* Description */}
                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                  {feature?.description}
                </p>

                {/* Feature Benefits */}
                <div className="space-y-4 pt-4">
                  {feature?.benefits?.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-start space-x-3 group">
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-gradient-to-br from-accent to-secondary">
                          <Icon name="Check" size={12} color="white" />
                        </div>
                      </div>
                      <span className="text-base text-foreground font-medium group-hover:text-accent transition-colors">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image */}
              <div className="flex-1 max-w-lg w-full">
                <div className="relative overflow-hidden rounded-3xl shadow-2xl animate-scale-hover group">
                  {/* Glow Effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${feature?.color} to-secondary rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
                  
                  {/* Image Container */}
                  <div className="relative overflow-hidden rounded-3xl">
                    <Image
                      src={feature?.image}
                      alt={feature?.imageAlt}
                      className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    
                    {/* Corner Accent */}
                    <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-br ${feature?.color} to-secondary rounded-full shadow-lg flex items-center justify-center`}>
                      <Icon name="ArrowUpRight" size={20} color="white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Process Summary */}
        <div className="mt-28 text-center animate-fade-up">
          <div className="relative group">
            {/* Glow Background */}
            <div className="absolute -inset-1 bg-gradient-to-r from-accent via-secondary to-accent rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            
            {/* Content Card */}
            <div className="relative bg-gradient-to-r from-accent/5 via-secondary/5 to-accent/5 dark:from-accent/10 dark:via-secondary/10 dark:to-accent/10 rounded-3xl p-10 lg:p-14 border border-accent/20 dark:border-accent/30 backdrop-blur-sm">
              <div className="mb-2">
                <Icon name="Zap" size={24} className="mx-auto text-accent mb-4" />
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
                Complete Your Beauty Journey in Minutes
              </h3>
              
              <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
                From skin analysis to personalized recommendations, discover products that truly match your unique beauty needs with scientific precision.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/20">
                  <Icon name="Clock" size={24} className="text-blue-600 dark:text-blue-400" />
                  <div className="font-bold text-foreground">2-3 minutes</div>
                  <div className="text-xs text-muted-foreground">Quick & Easy</div>
                </div>
                
                <div className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20">
                  <Icon name="Zap" size={24} className="text-accent" />
                  <div className="font-bold text-foreground">Instant results</div>
                  <div className="text-xs text-muted-foreground">Get answers now</div>
                </div>
                
                <div className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl border border-green-500/20">
                  <Icon name="Gift" size={24} className="text-green-600 dark:text-green-400" />
                  <div className="font-bold text-foreground">100% free</div>
                  <div className="text-xs text-muted-foreground">No hidden fees</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default FeatureHighlights;