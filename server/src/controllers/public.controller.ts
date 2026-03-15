import { Request, Response } from "express";
import { prisma } from "../lib/db";
import { getPermanentLink, getStreamableLink } from "../services/dropbox.service";

const normalizeMediaUrl = async (url?: string | null) => {
    if (!url) return '';

    if (url.startsWith('/')) {
        try {
            const permanent = await getPermanentLink(url);
            return getStreamableLink(permanent) || '';
        } catch {
            return '';
        }
    }

    return getStreamableLink(url) || '';
};

const normalizeFeaturedPostMedia = async (post: {
    pictures: Array<{ id: string; url: string; views: number; uploadedAt: Date }>;
    videos: Array<{ id: string; url: string; length: number; thumbnailUrl: string; views: number; uploadedAt: Date }>;
}) => {
    const pictures = await Promise.all(
        post.pictures.map(async (picture) => ({
            ...picture,
            url: await normalizeMediaUrl(picture.url)
        }))
    );

    const videos = await Promise.all(
        post.videos.map(async (video) => ({
            ...video,
            url: await normalizeMediaUrl(video.url),
            thumbnailUrl: await normalizeMediaUrl(video.thumbnailUrl)
        }))
    );

    return {
        ...post,
        pictures,
        videos
    };
};

export const getPosts = async (req: Request, res: Response) => {
    try {
        const post = await prisma.post.findMany({
            select: {
                id: true,
                caption: true,
                mood: true,
                createdAt: true,
                pictures: {
                    select: {
                        id: true,
                        url: true,
                        views: true,
                        uploadedAt: true,
                    }
                },
                videos: {
                    select: {
                        id: true,
                        url: true,
                        length: true,
                        thumbnailUrl: true,
                        views: true,
                        uploadedAt: true,
                    }
                }
            }
        })
        
        if (!post) {
            return res.status(404).json({ message: 'No posts found' });
        }
        res.status(200).json(post);
    } catch (error) {
        console.log((error as Error).message);
        
        res.status(500).json({ message: 'Error fetching posts' });
    }
}

export const getPostById = async (req: Request, res: Response) => {

    const { id } = req.params as { id: string };

    if (!id) {
        return res.status(400).json({ message: 'Post ID is required' });
    }

    try {

        const post = await prisma.post.findUnique({
            where: { id },
            select: {
                id: true,
                caption: true,
                mood: true,
                createdAt: true,
                pictures: {
                    select: {
                        id: true,
                        url: true,
                        views: true,
                        uploadedAt: true,
                    }
                },
                videos: {
                    select: {
                        id: true,
                        url: true,
                        length: true,
                        thumbnailUrl: true,
                        views: true,
                        uploadedAt: true,
                    }
                }
            }
        })

        res.status(200).json(post);
        
    } catch (error) {
        console.log((error as Error).message);
        res.status(500).json({ message: 'Error fetching post' });
    }

}

export const getFeaturedPost = async (req: Request, res: Response) => {
    try {
        // Get all posts, preferring unfeatured ones
        const unFeaturedPosts = await prisma.post.findMany({
            where: { lastFeaturedAt: null },
            select: {
                id: true,
                caption: true,
                mood: true,
                createdAt: true,
                pictures: {
                    select: {
                        id: true,
                        url: true,
                        views: true,
                        uploadedAt: true,
                    }
                },
                videos: {
                    select: {
                        id: true,
                        url: true,
                        length: true,
                        thumbnailUrl: true,
                        views: true,
                        uploadedAt: true,
                    }
                }
            }
        });

        let post;

        if (unFeaturedPosts.length > 0) {
            // Pick random unfeatured post
            post = unFeaturedPosts[Math.floor(Math.random() * unFeaturedPosts.length)];
        } else {
            // All posts featured, get the least recently featured one
            const allPosts = await prisma.post.findMany({
                orderBy: { lastFeaturedAt: 'asc' },
                select: {
                    id: true,
                    caption: true,
                    mood: true,
                    createdAt: true,
                    pictures: {
                        select: {
                            id: true,
                            url: true,
                            views: true,
                            uploadedAt: true,
                        }
                    },
                    videos: {
                        select: {
                            id: true,
                            url: true,
                            length: true,
                            thumbnailUrl: true,
                            views: true,
                            uploadedAt: true,
                        }
                    }
                }
            });

            if (allPosts.length === 0) {
                return res.status(404).json({ message: 'No posts available' });
            }

            post = allPosts[0];
        }

        // Update lastFeaturedAt for the selected post
        if (post) {
            await prisma.post.update({
                where: { id: post.id },
                data: { lastFeaturedAt: new Date() }
            });
        }

        const normalizedPost = post ? await normalizeFeaturedPostMedia(post) : post;
        res.status(200).json(normalizedPost);
    } catch (error) {
        console.log((error as Error).message);
        res.status(500).json({ message: 'Error fetching featured posts' });
    }
}