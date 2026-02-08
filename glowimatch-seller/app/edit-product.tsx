import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { Camera, X } from 'lucide-react-native';

import { api, handleApiError } from '@/lib/api';
import Colors from '@/constants/colors';
import { ApiResponse, Product } from '@/types';
import { CATEGORIES, SKIN_TYPES, CONCERNS } from '@/constants/product-options';

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [name, setName] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [skinTypes, setSkinTypes] = useState<string[]>([]);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string>('');
  const [purchaseUrl, setPurchaseUrl] = useState<string>('');
  const [imageUri, setImageUri] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const productQuery = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Product>>(`/seller/products/${id}`);
      return response.data.data!;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (productQuery.data) {
      const product = productQuery.data;
      setName(product.name);
      setBrand(product.brand || '');
      setDescription(product.description || '');
      setPrice(product.price?.toString() || '');
      setOriginalPrice(product.originalPrice?.toString() || '');
      setCategory(product.category || '');
      setSkinTypes(product.skinTypes || []);
      setConcerns(product.concerns || []);
      setIngredients(product.ingredients);
      setPurchaseUrl(product.purchaseUrl || '');
      setImageUri(product.imageUrl || '');
    }
  }, [productQuery.data]);

  const updateProductMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      brand?: string;
      description?: string;
      price?: number;
      originalPrice?: number;
      imageUrl?: string;
      category?: string;
      skinTypes?: string[];
      concerns?: string[];
      ingredients: string;
      purchaseUrl?: string;
    }) => {
      const response = await api.put<ApiResponse<Product>>(
        `/seller/products/${id}`,
        data
      );
      return response.data.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      queryClient.invalidateQueries({ queryKey: ['seller-stats'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      router.back();
    },
    onError: (error: unknown) => {
      const message = handleApiError(error);
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Error', message);
      }
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      const filename = uri.split('/').pop() || 'image.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('file', {
        uri,
        name: filename,
        type,
      } as any);

      const response = await api.post<ApiResponse<{ url: string }>>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setImageUri(response.data.data!.url);
    } catch (error) {
      alert(handleApiError(error));
    } finally {
      setUploadingImage(false);
    }
  };

  const toggleSkinType = (type: string) => {
    setSkinTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleConcern = (concern: string) => {
    setConcerns((prev) =>
      prev.includes(concern) ? prev.filter((c) => c !== concern) : [...prev, concern]
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('Product name is required');
      return;
    }
    if (!ingredients.trim()) {
      alert('Ingredients are required for safety check');
      return;
    }

    updateProductMutation.mutate({
      name: name.trim(),
      brand: brand.trim() || undefined,
      description: description.trim() || undefined,
      price: price ? parseFloat(price) : undefined,
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      imageUrl: imageUri || undefined,
      category: category || undefined,
      skinTypes: skinTypes.length > 0 ? skinTypes : undefined,
      concerns: concerns.length > 0 ? concerns : undefined,
      ingredients: ingredients.trim(),
      purchaseUrl: purchaseUrl.trim() || undefined,
    });
  };

  if (productQuery.isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: 'Edit Product', headerShown: true }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Edit Product', headerShown: true }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Image</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {imageUri ? (
              <>
                <Image source={{ uri: imageUri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeImage}
                  onPress={() => setImageUri('')}
                >
                  <X color={Colors.textLight} size={16} />
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.imagePickerContent}>
                {uploadingImage ? (
                  <ActivityIndicator color={Colors.primary} />
                ) : (
                  <>
                    <Camera color={Colors.textSecondary} size={32} />
                    <Text style={styles.imagePickerText}>Add Photo</Text>
                  </>
                )}
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            Product Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Hydrating Serum"
            placeholderTextColor={Colors.textSecondary}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Brand</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. The Ordinary"
            placeholderTextColor={Colors.textSecondary}
            value={brand}
            onChangeText={setBrand}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your product..."
            placeholderTextColor={Colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.section, styles.half]}>
            <Text style={styles.label}>Price ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="29.99"
              placeholderTextColor={Colors.textSecondary}
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={[styles.section, styles.half]}>
            <Text style={styles.label}>Original Price ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="39.99"
              placeholderTextColor={Colors.textSecondary}
              value={originalPrice}
              onChangeText={setOriginalPrice}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, category === cat && styles.chipSelected]}
                onPress={() => setCategory(cat === category ? '' : cat)}
              >
                <Text
                  style={[styles.chipText, category === cat && styles.chipTextSelected]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Skin Types</Text>
          <View style={styles.chipsWrap}>
            {SKIN_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.chip, skinTypes.includes(type) && styles.chipSelected]}
                onPress={() => toggleSkinType(type)}
              >
                <Text
                  style={[
                    styles.chipText,
                    skinTypes.includes(type) && styles.chipTextSelected,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Concerns</Text>
          <View style={styles.chipsWrap}>
            {CONCERNS.map((concern) => (
              <TouchableOpacity
                key={concern}
                style={[styles.chip, concerns.includes(concern) && styles.chipSelected]}
                onPress={() => toggleConcern(concern)}
              >
                <Text
                  style={[
                    styles.chipText,
                    concerns.includes(concern) && styles.chipTextSelected,
                  ]}
                >
                  {concern}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            Ingredients <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.helpText}>
            List all ingredients for safety verification
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Water, Glycerin, Niacinamide..."
            placeholderTextColor={Colors.textSecondary}
            value={ingredients}
            onChangeText={setIngredients}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Purchase URL</Text>
          <TextInput
            style={styles.input}
            placeholder="https://..."
            placeholderTextColor={Colors.textSecondary}
            value={purchaseUrl}
            onChangeText={setPurchaseUrl}
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            updateProductMutation.isPending && styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={updateProductMutation.isPending}
        >
          {updateProductMutation.isPending ? (
            <ActivityIndicator color={Colors.textLight} />
          ) : (
            <Text style={styles.submitButtonText}>Update Product</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  required: {
    color: Colors.error,
  },
  helpText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  imagePicker: {
    width: 150,
    height: 150,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed' as const,
    overflow: 'hidden',
  },
  imagePickerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  imagePickerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeImage: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: Colors.text,
  },
  chipTextSelected: {
    color: Colors.textLight,
    fontWeight: '600' as const,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Colors.textLight,
  },
});