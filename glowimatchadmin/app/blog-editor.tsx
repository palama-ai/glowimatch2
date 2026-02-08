import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ImagePlus, Save, Trash2, X } from 'lucide-react-native';

import Button from '@/components/Button';
import Card from '@/components/Card';
import Loading from '@/components/Loading';
import Colors from '@/constants/colors';
import { api } from '@/services/api';
import { Blog } from '@/types';

export default function BlogEditorScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const router = useRouter();
    const isEditing = !!id;

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState<string | undefined>(undefined);
    const [published, setPublished] = useState(false);

    const blogQuery = useQuery<Blog>({
        queryKey: ['admin', 'blogs', id],
        queryFn: async () => {
            const response = await api.get(`/admin/blogs/${id}`);
            // Backend returns { data: blog }
            return response.data.data;
        },
        enabled: isEditing,
    });

    React.useEffect(() => {
        if (blogQuery.data) {
            setTitle(blogQuery.data.title);
            setSlug(blogQuery.data.slug);
            setExcerpt(blogQuery.data.excerpt);
            setContent(blogQuery.data.content);
            setCoverImage(blogQuery.data.coverImage);
            setPublished(blogQuery.data.published);
        }
    }, [blogQuery.data]);

    const saveMutation = useMutation({
        mutationFn: async (data: Partial<Blog>) => {
            if (isEditing) {
                const response = await api.put(`/admin/blogs/${id}`, data);
                return response.data;
            } else {
                const response = await api.post('/admin/blogs', data);
                return response.data;
            }
        },
        onSuccess: () => {
            Alert.alert('Success', `Blog ${isEditing ? 'updated' : 'created'} successfully`);
            router.back();
        },
        onError: (error: any) => {
            Alert.alert('Error', error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} blog`);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const response = await api.delete(`/admin/blogs/${id}`);
            return response.data;
        },
        onSuccess: () => {
            Alert.alert('Success', 'Blog deleted successfully');
            router.back();
        },
        onError: (error: any) => {
            Alert.alert('Error', error.response?.data?.message || 'Failed to delete blog');
        },
    });

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setCoverImage(result.assets[0].uri);
        }
    };

    const handleSave = () => {
        if (!title || !slug || !excerpt || !content) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        saveMutation.mutate({
            title,
            slug,
            excerpt,
            content,
            coverImage,
            published,
        });
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Blog',
            'Are you sure you want to delete this blog? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteMutation.mutate(),
                },
            ]
        );
    };

    if (isEditing && blogQuery.isLoading) {
        return <Loading text="Loading blog..." />;
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.header}>
                <Text style={styles.title}>{isEditing ? 'Edit Blog' : 'Create Blog'}</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <X size={24} color={Colors.dark.text} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <Card style={styles.formCard}>
                        <TouchableOpacity style={styles.imageUpload} onPress={handlePickImage}>
                            {coverImage ? (
                                <Image source={{ uri: coverImage }} style={styles.coverImage} />
                            ) : (
                                <View style={styles.imagePlaceholder}>
                                    <ImagePlus size={32} color={Colors.dark.textMuted} />
                                    <Text style={styles.imagePlaceholderText}>Add Cover Image</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </Card>

                    <Card style={styles.formCard}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Title *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter blog title"
                                placeholderTextColor={Colors.dark.textMuted}
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Slug *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="blog-url-slug"
                                placeholderTextColor={Colors.dark.textMuted}
                                value={slug}
                                onChangeText={setSlug}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Excerpt *</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Brief description of the blog"
                                placeholderTextColor={Colors.dark.textMuted}
                                value={excerpt}
                                onChangeText={setExcerpt}
                                multiline
                                numberOfLines={3}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Content *</Text>
                            <TextInput
                                style={[styles.input, styles.contentArea]}
                                placeholder="Write your blog content here..."
                                placeholderTextColor={Colors.dark.textMuted}
                                value={content}
                                onChangeText={setContent}
                                multiline
                                numberOfLines={10}
                            />
                        </View>

                        <View style={styles.switchRow}>
                            <Text style={styles.switchLabel}>Publish Blog</Text>
                            <Switch
                                value={published}
                                onValueChange={setPublished}
                                trackColor={{ false: Colors.dark.border, true: Colors.dark.success }}
                                thumbColor={Colors.dark.text}
                            />
                        </View>
                    </Card>

                    <View style={styles.actionsContainer}>
                        <Button
                            title={isEditing ? 'Update Blog' : 'Create Blog'}
                            onPress={handleSave}
                            loading={saveMutation.isPending}
                            icon={<Save size={20} color={Colors.dark.text} />}
                        />
                        {isEditing && (
                            <Button
                                title="Delete Blog"
                                onPress={handleDelete}
                                variant="danger"
                                loading={deleteMutation.isPending}
                                icon={<Trash2 size={20} color={Colors.dark.text} />}
                            />
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
    },
    title: {
        fontSize: 20,
        fontWeight: '700' as const,
        color: Colors.dark.text,
    },
    closeButton: {
        padding: 4,
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        gap: 16,
    },
    formCard: {
        gap: 16,
    },
    imageUpload: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    coverImage: {
        width: '100%',
        height: 200,
        backgroundColor: Colors.dark.surfaceLight,
    },
    imagePlaceholder: {
        width: '100%',
        height: 200,
        backgroundColor: Colors.dark.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    imagePlaceholderText: {
        fontSize: 14,
        color: Colors.dark.textMuted,
    },
    inputContainer: {
        gap: 8,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: Colors.dark.textSecondary,
    },
    input: {
        backgroundColor: Colors.dark.background,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: Colors.dark.text,
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    contentArea: {
        minHeight: 200,
        textAlignVertical: 'top',
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    switchLabel: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: Colors.dark.text,
    },
    actionsContainer: {
        gap: 12,
        paddingBottom: 24,
    },
});