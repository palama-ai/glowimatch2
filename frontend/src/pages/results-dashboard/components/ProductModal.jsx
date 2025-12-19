import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { useAuth } from '../../../contexts/AuthContext';

const ProductModal = ({ product, products, currentIndex, onClose, onNavigate }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';

    const getToken = () => {
        try {
            const raw = localStorage.getItem('gm_auth');
            if (raw) {
                const parsed = JSON.parse(raw);
                return parsed.token;
            }
        } catch (e) { }
        return null;
    };

    const getHeaders = () => {
        const headers = { 'Content-Type': 'application/json' };
        const token = getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return headers;
    };

    // Fetch reviews when product changes
    useEffect(() => {
        if (product?.id) {
            fetchReviews();
            trackProductView();
        }
    }, [product?.id]);

    // Track product view (per user per quiz attempt)
    const trackProductView = async () => {
        try {
            // Get user ID from auth context or localStorage
            const userId = user?.id;

            // Get quiz attempt ID from localStorage
            let quizAttemptId = null;
            try {
                const quizData = JSON.parse(localStorage.getItem('glowmatch-quiz-data') || '{}');
                quizAttemptId = quizData.attemptId;
            } catch (e) { /* ignore */ }

            // Only track if we have both user and quiz attempt (otherwise it's anonymous)
            await fetch(`${API_BASE}/products/${product.id}/view`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ userId, quizAttemptId })
            });
        } catch (err) {
            // Non-blocking - don't show error to user
            console.debug('View tracking failed:', err);
        }
    };

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/products/${product.id}/reviews`, {
                headers: getHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                setReviews(data.data);
                setUserRating(data.data.userRating || 0);
            }
        } catch (err) {
            console.error('Error fetching reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRate = async (rating) => {
        if (!user) {
            alert('Please login to rate products');
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/products/${product.id}/rate`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ rating })
            });
            if (res.ok) {
                const data = await res.json();
                setUserRating(rating);
                setReviews(prev => ({
                    ...prev,
                    avgRating: data.data.avgRating,
                    totalRatings: data.data.totalRatings,
                    userRating: rating
                }));
            }
        } catch (err) {
            console.error('Error rating:', err);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to comment');
            return;
        }
        if (!comment.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/products/${product.id}/comments`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ content: comment })
            });
            if (res.ok) {
                const data = await res.json();
                setReviews(prev => ({
                    ...prev,
                    comments: [data.data, ...prev.comments],
                    totalComments: prev.totalComments + 1
                }));
                setComment('');
            }
        } catch (err) {
            console.error('Error adding comment:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleReply = async (parentId) => {
        if (!user) {
            alert('Please login to reply');
            return;
        }
        if (!replyContent.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/products/${product.id}/comments`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ content: replyContent, parentId })
            });
            if (res.ok) {
                const data = await res.json();
                setReviews(prev => ({
                    ...prev,
                    comments: prev.comments.map(c =>
                        c.id === parentId
                            ? { ...c, replies: [...(c.replies || []), data.data] }
                            : c
                    ),
                    totalComments: prev.totalComments + 1
                }));
                setReplyTo(null);
                setReplyContent('');
            }
        } catch (err) {
            console.error('Error replying:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = async (commentId, isReply, parentId) => {
        if (!user) {
            alert('Please login to like comments');
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/products/${product.id}/comments/${commentId}/like`, {
                method: 'POST',
                headers: getHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                const updateLike = (c) => ({
                    ...c,
                    isLiked: data.data.liked,
                    likes_count: c.likes_count + (data.data.liked ? 1 : -1)
                });

                if (isReply && parentId) {
                    setReviews(prev => ({
                        ...prev,
                        comments: prev.comments.map(c =>
                            c.id === parentId
                                ? { ...c, replies: c.replies.map(r => r.id === commentId ? updateLike(r) : r) }
                                : c
                        )
                    }));
                } else {
                    setReviews(prev => ({
                        ...prev,
                        comments: prev.comments.map(c => c.id === commentId ? updateLike(c) : c)
                    }));
                }
            }
        } catch (err) {
            console.error('Error liking:', err);
        }
    };

    const handleDelete = async (commentId, isReply, parentId) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;
        try {
            const res = await fetch(`${API_BASE}/products/${product.id}/comments/${commentId}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            if (res.ok) {
                if (isReply && parentId) {
                    setReviews(prev => ({
                        ...prev,
                        comments: prev.comments.map(c =>
                            c.id === parentId
                                ? { ...c, replies: c.replies.filter(r => r.id !== commentId) }
                                : c
                        ),
                        totalComments: prev.totalComments - 1
                    }));
                } else {
                    const comment = reviews.comments.find(c => c.id === commentId);
                    const repliesCount = comment?.replies?.length || 0;
                    setReviews(prev => ({
                        ...prev,
                        comments: prev.comments.filter(c => c.id !== commentId),
                        totalComments: prev.totalComments - 1 - repliesCount
                    }));
                }
            }
        } catch (err) {
            console.error('Error deleting:', err);
        }
    };

    const handlePurchaseClick = () => {
        const url = product?.purchaseUrl || product?.purchase_url || '#';
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex < products.length - 1;

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Render star rating
    const renderStars = (rating, interactive = false, size = 20) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        disabled={!interactive}
                        onClick={() => interactive && handleRate(star)}
                        onMouseEnter={() => interactive && setHoverRating(star)}
                        onMouseLeave={() => interactive && setHoverRating(0)}
                        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
                    >
                        <Icon
                            name="Star"
                            size={size}
                            className={`${star <= (interactive ? (hoverRating || userRating) : rating)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-gray-300'
                                } transition-colors`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    // Render comment
    const renderComment = (c, isReply = false, parentId = null) => (
        <div key={c.id} className={`${isReply ? 'ml-8 mt-3' : ''}`}>
            <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon name="User" size={16} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-foreground">{c.user_name || 'User'}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(c.created_at)}</span>
                    </div>
                    <p className="text-sm text-foreground mb-2">{c.content}</p>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => handleLike(c.id, isReply, parentId)}
                            className={`flex items-center gap-1 text-xs ${c.isLiked ? 'text-accent' : 'text-muted-foreground'} hover:text-accent transition-colors`}
                        >
                            <Icon name="Heart" size={14} className={c.isLiked ? 'fill-accent' : ''} />
                            {c.likes_count || 0}
                        </button>
                        {!isReply && (
                            <button
                                onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Reply
                            </button>
                        )}
                        {c.isOwner && (
                            <button
                                onClick={() => handleDelete(c.id, isReply, parentId)}
                                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                            >
                                Delete
                            </button>
                        )}
                    </div>

                    {/* Reply input */}
                    {replyTo === c.id && (
                        <div className="mt-3 flex gap-2">
                            <input
                                type="text"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Write a reply..."
                                className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent/50"
                            />
                            <button
                                onClick={() => handleReply(c.id)}
                                disabled={submitting || !replyContent.trim()}
                                className="px-3 py-2 bg-accent text-white text-sm rounded-lg hover:bg-accent/90 disabled:opacity-50"
                            >
                                Reply
                            </button>
                        </div>
                    )}

                    {/* Replies */}
                    {c.replies?.map(r => renderComment(r, true, c.id))}
                </div>
            </div>
        </div>
    );

    if (!product) return null;

    const productImage = product?.image || product?.image_url;
    const productBrand = product?.brand || 'Unknown Brand';
    const productPrice = product?.price;
    const productOriginalPrice = product?.originalPrice || product?.original_price;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            {/* Navigation arrows */}
            {canGoPrev && (
                <button
                    onClick={() => onNavigate(currentIndex - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/90 rounded-full flex items-center justify-center shadow-lg hover:bg-background transition-colors z-10"
                >
                    <Icon name="ChevronLeft" size={24} className="text-foreground" />
                </button>
            )}
            {canGoNext && (
                <button
                    onClick={() => onNavigate(currentIndex + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/90 rounded-full flex items-center justify-center shadow-lg hover:bg-background transition-colors z-10"
                >
                    <Icon name="ChevronRight" size={24} className="text-foreground" />
                </button>
            )}

            {/* Modal content */}
            <div className="w-full max-w-2xl max-h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground line-clamp-1">{product?.name}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <Icon name="X" size={20} className="text-muted-foreground" />
                    </button>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto">
                    {/* Product info */}
                    <div className="p-6">
                        <div className="flex gap-6">
                            {/* Image */}
                            <div className="w-40 h-40 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                                <Image
                                    src={productImage}
                                    alt={product?.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Details */}
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">{productBrand}</p>

                                {/* Rating */}
                                <div className="flex items-center gap-2 mb-3">
                                    {renderStars(parseFloat(reviews?.avgRating || 0))}
                                    <span className="text-sm font-medium text-foreground">{reviews?.avgRating || '0.0'}</span>
                                    <span className="text-sm text-muted-foreground">({reviews?.totalRatings || 0} reviews)</span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center gap-2 mb-4">
                                    {productPrice && (
                                        <span className="text-2xl font-bold text-foreground">${productPrice}</span>
                                    )}
                                    {productOriginalPrice && (
                                        <span className="text-lg text-muted-foreground line-through">${productOriginalPrice}</span>
                                    )}
                                </div>

                                {/* AI Match Badge */}
                                {product?.aiVoting?.voteCount > 0 && (
                                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-full mb-4">
                                        <Icon name="Sparkles" size={14} />
                                        {Math.round(product.aiVoting.avgScore * 10)}% AI Match
                                    </div>
                                )}

                                {/* Buy button */}
                                <button
                                    onClick={handlePurchaseClick}
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-accent text-white font-medium rounded-xl hover:bg-accent/90 transition-colors"
                                >
                                    <Icon name="ShoppingBag" size={18} />
                                    Buy Now
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        {product?.description && (
                            <div className="mt-6">
                                <h3 className="font-medium text-foreground mb-2">Description</h3>
                                <p className="text-sm text-muted-foreground">{product.description}</p>
                            </div>
                        )}

                        {/* AI Recommendation reason */}
                        {product?.aiVoting?.reasons?.length > 0 && (
                            <div className="mt-4 p-3 bg-purple-50 rounded-xl">
                                <p className="text-sm text-purple-700">
                                    <span className="font-medium">✨ Why we recommend:</span> {product.aiVoting.reasons[0]}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Rating section */}
                    <div className="px-6 py-4 border-t border-border bg-muted/30">
                        <h3 className="font-medium text-foreground mb-3">Rate this product</h3>
                        <div className="flex items-center gap-4">
                            {renderStars(userRating, true, 28)}
                            {userRating > 0 && (
                                <span className="text-sm text-muted-foreground">Your rating: {userRating}/5</span>
                            )}
                        </div>
                    </div>

                    {/* Comments section */}
                    <div className="px-6 py-4 border-t border-border">
                        <h3 className="font-medium text-foreground mb-4">
                            Comments ({reviews?.totalComments || 0})
                        </h3>

                        {/* Add comment */}
                        <form onSubmit={handleAddComment} className="flex gap-2 mb-6">
                            <input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder={user ? "Write a comment..." : "Login to comment"}
                                disabled={!user}
                                className="flex-1 px-4 py-2 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={submitting || !comment.trim() || !user}
                                className="px-4 py-2 bg-accent text-white rounded-xl hover:bg-accent/90 disabled:opacity-50 transition-colors"
                            >
                                Post
                            </button>
                        </form>

                        {/* Comments list */}
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Icon name="Loader2" size={24} className="animate-spin text-accent" />
                            </div>
                        ) : reviews?.comments?.length > 0 ? (
                            <div className="space-y-4">
                                {reviews.comments.map(c => renderComment(c))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Icon name="MessageCircle" size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No comments yet. Be the first to comment!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
