
import { Request, Response } from 'express'
import multer from 'multer'
import { prisma } from '../lib/db'
import { getPermanentLink, getVideoDuration, uploadToDropbox, getVideoThumbnail, deleteFromDropbox, getStreamableLink } from '../services/dropbox.service'

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

export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                pictures: true,
                videos: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        // Normalize media URLs
        const normalizedPosts = await Promise.all(
            posts.map(async (post) => ({
                ...post,
                pictures: await Promise.all(
                    post.pictures.map(async (pic) => ({
                        ...pic,
                        url: await normalizeMediaUrl(pic.url)
                    }))
                ),
                videos: await Promise.all(
                    post.videos.map(async (video) => ({
                        ...video,
                        url: await normalizeMediaUrl(video.url),
                        thumbnailUrl: await normalizeMediaUrl(video.thumbnailUrl)
                    }))
                )
            }))
        );

        console.log('getAllPosts - Returning posts:', JSON.stringify(normalizedPosts, null, 2));
        res.json(normalizedPosts)
    } catch (error) {
        console.error('getAllPosts error:', error);
        res.status(500).json({ error: 'Failed to fetch posts' })
    }
}

export const getPost =  async (req: Request, res: Response) => {

}

export const createPost = async (req: Request, res: Response) => {

    let {caption, mood} = req.body

    const files = req.files as { [fieldname: string]: Express.Multer.File[] }

    if(!mood) return res.status(400).json({error: "mood is required"});
    
    // Convert mood to uppercase to match Prisma enum
    mood = mood.toUpperCase();

    try {

        const pictureData : {url: string}[] = [];

        if(files?.images) {
            for(const file of files.images) {
                const filename = `${Date.now()}-${file.originalname}`;
                await uploadToDropbox({buffer: file.buffer, filename, path: '/posts/images'});
                const filepath = `/posts/images/${filename}`;
                try {
                    const url = await Promise.race([
                        getPermanentLink(filepath),
                        new Promise<string>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
                    ]);
                    pictureData.push({url});
                } catch (linkErr) {
                    console.warn('Failed to get permanent link, using filepath:', filepath, linkErr);
                    pictureData.push({url: filepath});
                }
            }
        }

        const videoData : {url: string, thumbnailUrl: string, length: number}[] = [];

        if(files?.videos) {
            for(const file of files.videos) {
                const filename = `${Date.now()}-${file.originalname}`;
                await uploadToDropbox({buffer: file.buffer, filename, path: '/posts/videos'});
                const filepath = `/posts/videos/${filename}`;
                try {
                    const url = await Promise.race([
                        getPermanentLink(filepath),
                        new Promise<string>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
                    ]);
                    const duration = await Promise.race([
                        getVideoDuration(file.buffer),
                        new Promise<number>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 30000))
                    ]);
                    
                    let thumbnailUrl = '';
                    try {
                        const thumbnailBuffer = await Promise.race([
                            getVideoThumbnail(file.buffer),
                            new Promise<Buffer>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 30000))
                        ]);
                        const thumbnailFilename = `${Date.now()}-thumb-${file.originalname.split('.')[0]}.png`;
                        await uploadToDropbox({buffer: thumbnailBuffer, filename: thumbnailFilename, path: '/posts/thumbnails'});
                        thumbnailUrl = await Promise.race([
                            getPermanentLink(`/posts/thumbnails/${thumbnailFilename}`),
                            new Promise<string>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
                        ]);
                    } catch (thumbErr) {
                        console.warn('Failed to generate/upload thumbnail:', thumbErr);
                        thumbnailUrl = '';
                    }
                    
                    videoData.push({
                        url,
                        thumbnailUrl,
                        length: Math.round(duration as number || 0)
                    });
                } catch (processErr) {
                    console.warn('Failed to process video metadata, using filepath:', filepath, processErr);
                    videoData.push({
                        url: filepath,
                        thumbnailUrl: '',
                        length: 0
                    });
                }
            }
        }

        const newPost = await prisma.post.create({
            data: {
                caption,
                mood,
                pictures: { create: pictureData },
                videos: { create: videoData },
                createdAt: new Date(),
            },
            include: {
                pictures: true,
                videos: true
            }
        })
        
        // Normalize media URLs
        const normalizedPost = {
            ...newPost,
            pictures: await Promise.all(
                newPost.pictures.map(async (pic) => ({
                    ...pic,
                    url: await normalizeMediaUrl(pic.url)
                }))
            ),
            videos: await Promise.all(
                newPost.videos.map(async (video) => ({
                    ...video,
                    url: await normalizeMediaUrl(video.url),
                    thumbnailUrl: await normalizeMediaUrl(video.thumbnailUrl)
                }))
            )
        };

        console.log('createPost - Created post:', JSON.stringify(normalizedPost, null, 2));
        res.status(201).json(normalizedPost);
    } catch (error) {
        console.error('createPost error:', error);
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: 'Failed to create post', details: message })
    }
}

export const deletePost = async (req: Request, res: Response) => {
    const {id} = req.params;

    if(!id || Array.isArray(id)) {
        return res.status(400).json({error: 'Post ID is required'});
    }

    try {
        const post = await prisma.post.findUnique({
            where: {id},
            include: {
                pictures: true,
                videos: true
            }
        });

        if(!post) {
            return res.status(404).json({error: 'Post not found'});
        }

        for(const picture of post.pictures){
            try {
                console.log(`Deleting picture - URL: ${picture.url}`);
                const result = await deleteFromDropbox(picture.url);
                console.log(`Delete result:`, result);
            } catch (error) {
                console.warn(`Failed to delete picture from Dropbox: ${picture.url}`, error);
            }
        }
        
        for(const video of post.videos){
            try {
                console.log(`Deleting video - URL: ${video.url}`);
                const result = await deleteFromDropbox(video.url);
                console.log(`Delete result:`, result);
            } catch (error) {
                console.warn(`Failed to delete video from Dropbox: ${video.url}`, error);
            }

            if(video.thumbnailUrl){
                try {
                    console.log(`Deleting thumbnail - URL: ${video.thumbnailUrl}`);
                    const result = await deleteFromDropbox(video.thumbnailUrl);
                    console.log(`Delete result:`, result);
                } catch (error) {
                    console.warn(`Failed to delete thumbnail from Dropbox: ${video.thumbnailUrl}`, error);
                }
            }
        }

        const deletedPost = await prisma.post.delete({
            where: {id}
        })
        
        res.json({ message: 'Post deleted successfully', post: deletedPost });

    } catch (error) {
        console.error('deletePost error:', error);
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: 'Failed to delete post', details: message });
    }
}