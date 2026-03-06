import fs from 'fs';
import path from 'path';
import { Dropbox } from 'dropbox';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeStatic from 'ffprobe-static';
import { Readable } from 'stream';
import { prisma } from '../lib/db';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeStatic.path);

const DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID || null;
const DROPBOX_CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET || null;

// persisted will be loaded from DB lazily
let persisted: { access_token?: string; refresh_token?: string | null; expires_at?: Date | null } | null = null;

// --- add token cache and fetch helper ---
const tokenCache = {
  accessToken: null as string | null,
  expiresAt: null as number | null
};

async function getFetch() {
  if (typeof globalThis.fetch === 'function') return globalThis.fetch;
  const mod = await import('node-fetch');
  return mod.default;
}


async function loadPersistedFromDB() {
  if (persisted !== null) return;
  try {
    const row = await prisma.dropboxToken.findUnique({ where: { id: 'dropbox' } });
    persisted = row ?? {};
  } catch (e) {
    persisted = {};
  }

  // initialize tokenCache from persisted DB row if present
  if (persisted?.access_token) {
    tokenCache.accessToken = persisted.access_token;
  }
  if (persisted?.expires_at) {
    tokenCache.expiresAt = new Date(persisted.expires_at).getTime();
  }
}

// helper to persist tokens returned by OAuth token endpoint into DB
async function persistTokens(data: { access_token: string; refresh_token?: string; expires_in?: number }) {
  try {
    const expiresIn = data.expires_in || null;
    const now = Date.now();
    const expires_at = expiresIn ? new Date(now + expiresIn * 1000 - 30 * 1000) : null;
    const upsertData = {
      id: 'dropbox',
      access_token: data.access_token,
      // prefer refresh_token returned by OAuth; otherwise keep existing persisted refresh_token
      refresh_token: data.refresh_token || (persisted && persisted.refresh_token) || null,
      expires_at: expires_at ?? null
    };

    await prisma.dropboxToken.upsert({
      where: { id: 'dropbox' },
      create: upsertData,
      update: upsertData
    });

    // update in-memory cache & persisted snapshot
    tokenCache.accessToken = upsertData.access_token;
    tokenCache.expiresAt = expires_at ? expires_at.getTime() : null;
    persisted = {
      access_token: upsertData.access_token,
      refresh_token: upsertData.refresh_token ?? null,
      expires_at: expires_at ?? null
    };
  } catch (e) {
    // fallback to in-memory only
    tokenCache.accessToken = data.access_token;
    tokenCache.expiresAt = Date.now() + ((data.expires_in || 14400) * 1000) - (30 * 1000);
  }
}

// Ensure DB persisted tokens are loaded before using refresh or ensure
async function refreshAccessToken() {
  await loadPersistedFromDB();
  // Use the refresh token from persisted DB row
  const refreshToken = (persisted && persisted.refresh_token);
  if (!refreshToken || !DROPBOX_CLIENT_ID || !DROPBOX_CLIENT_SECRET) {
    throw new Error('Missing Dropbox refresh token in DB or missing DROPBOX_CLIENT_ID / DROPBOX_CLIENT_SECRET in env.');
  }

  const fetchFn = await getFetch();

  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken);

  const basicAuth = Buffer.from(`${DROPBOX_CLIENT_ID}:${DROPBOX_CLIENT_SECRET}`).toString('base64');

  const res = await fetchFn('https://api.dropbox.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Failed to refresh Dropbox token: ${res.status} ${res.statusText} ${body}`);
  }

  const data = await res.json();
  if (!data.access_token) {
    throw new Error('No access_token returned when refreshing Dropbox token');
  }

  await persistTokens(data);
  return tokenCache.accessToken;
}

async function ensureAccessToken() {
  await loadPersistedFromDB();
  const now = Date.now();

  if (tokenCache.accessToken && tokenCache.expiresAt && now < tokenCache.expiresAt) {
    return tokenCache.accessToken;
  }

  // No env access token fallback: require refresh token in DB
  // This will attempt to refresh using the persisted refresh_token (must exist)
  // If absent, refreshAccessToken() will throw and caller will see the error.

  return await refreshAccessToken();
}

async function getDropboxClient() {
  const accessToken = await ensureAccessToken();
  if (!accessToken) {
    throw new Error('Failed to obtain Dropbox access token');
  }
  // Dropbox SDK may require fetch; pass global fetch if needed in some runtimes
  return new Dropbox({ accessToken });
}

export const uploadToDropbox = async ({ buffer, filename, path = '' }: { buffer: Buffer; filename: string; path?: string }) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const dropboxPath = `${normalizedPath}${normalizedPath.endsWith('/') ? '' : '/'}${filename}`;
  try {
    const dbx = await getDropboxClient();
    const response = await dbx.filesUpload({
      path: dropboxPath,
      contents: buffer,
      mode: { '.tag': 'overwrite' },
      autorename: false,
      mute: false
    });
    return response;
  } catch (error) {
    throw new Error('Dropbox upload failed: ' + (error instanceof Error ? error.message : String(error)));
  }
};

interface DropboxSharedLinkResult {
    result?: {
        url?: string;
        link?: string;
    };
    url?: string;
    link?: string;
}

interface DropboxListLinksResult {
    result?: {
        links?: Array<{ url?: string; link?: string }>;
    };
    links?: Array<{ url?: string; link?: string }>;
}

interface DropboxTemporaryLinkResult {
    result?: {
        link?: string;
    };
    link?: string;
}

interface DropboxError extends Error {
    error?: {
        error_summary?: string;
    };
    error_summary?: string;
    status?: number;
}

export const getPermanentLink = async (dropboxPath: string): Promise<string> => {
    const dbx = await getDropboxClient();

    // Try to create a shared link, but if that fails try safe fallbacks:
    // 1) list existing shared links
    // 2) get a temporary link
    try {
        const createRes = await dbx.sharingCreateSharedLinkWithSettings({ path: dropboxPath }) as DropboxSharedLinkResult;
        const url = createRes?.result?.url || createRes?.url || createRes?.link;
        if (url) return String(url).replace('?dl=0', '?dl=1');
    } catch (createErr) {
        // If shared link already exists (Dropbox returns 409 / shared_link_already_exists),
        // immediately try to list existing shared links instead of only logging.
        const error = createErr as DropboxError;
        const summary = error?.error?.error_summary || error?.error_summary || error?.message || String(createErr);
        const s = String(summary).toLowerCase();
        if (s.includes('shared_link_already_exists') || s.includes('already_exists') || (error?.status === 409)) {
            try {
                const listRes = await dbx.sharingListSharedLinks({ path: dropboxPath, direct_only: true }) as DropboxListLinksResult;
                const links = listRes?.result?.links || listRes?.links;
                if (Array.isArray(links) && links.length > 0) {
                    const url = links[0]?.url || links[0]?.link;
                    if (url) return String(url).replace('?dl=0', '?dl=1');
                }
            } catch (listErrInner) {
                const listErr = listErrInner as DropboxError;
                console.warn('sharingListSharedLinks after create 409 failed:', listErr?.message || listErrInner);
            }
        } else {
            // continue to fallback attempts for other errors
            console.warn('sharingCreateSharedLinkWithSettings failed (will try fallback):', error?.message || createErr);
        }
    }

    // Fallback: list existing shared links
    try {
        const listRes = await dbx.sharingListSharedLinks({ path: dropboxPath, direct_only: true }) as DropboxListLinksResult;
        const links = listRes?.result?.links || listRes?.links;
        if (Array.isArray(links) && links.length > 0) {
            const url = links[0]?.url || links[0]?.link;
            if (url) return String(url).replace('?dl=0', '?dl=1');
        }
    } catch (listErr) {
        const error = listErr as DropboxError;
        console.warn('sharingListSharedLinks fallback failed:', error?.message || listErr);
    }

    // Final fallback: temporary link
    try {
        const tmpRes = await dbx.filesGetTemporaryLink({ path: dropboxPath }) as DropboxTemporaryLinkResult;
        const tmpLink = tmpRes?.result?.link || tmpRes?.link;
        if (tmpLink) return tmpLink;
    } catch (tmpErr) {
        const error = tmpErr as DropboxError;
        console.warn('filesGetTemporaryLink fallback failed:', error?.message || tmpErr);
    }

    throw new Error('Dropbox permanent link failed: unable to create or retrieve link for ' + dropboxPath);
};

export const getVideoDuration = async (buffer: Buffer): Promise<number | undefined> => {
  const tmpDir = path.join(process.cwd(), 'tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const inputFile = path.join(tmpDir, `video-duration-${Date.now()}.mp4`);

  try {
    fs.writeFileSync(inputFile, buffer);

    return new Promise((resolve, reject) => {
      ffmpeg(inputFile)
        .ffprobe((err, data) => {
          if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
          if (err) return reject(err);
          resolve(data.format.duration);
        });
    });
  } catch (err) {
    if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
    throw err;
  }
};

export const getVideoThumbnail = async (buffer: Buffer): Promise<Buffer> => {
  const tmpDir = path.join(process.cwd(), 'tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const inputFile = path.join(tmpDir, `video-${Date.now()}.mp4`);
  const outputFile = path.join(tmpDir, `thumb-${Date.now()}.png`);

  try {
    // Write buffer to temporary file
    fs.writeFileSync(inputFile, buffer);

    // Extract thumbnail
    return new Promise((resolve, reject) => {
      ffmpeg(inputFile)
        .seekInput(1)
        .outputOptions('-vframes', '1')
        .outputOptions('-s', '320x180')
        .output(outputFile)
        .on('end', () => {
          const thumbnailBuffer = fs.readFileSync(outputFile);
          // Clean up temp files
          fs.unlinkSync(inputFile);
          fs.unlinkSync(outputFile);
          resolve(thumbnailBuffer);
        })
        .on('error', (err) => {
          // Clean up on error
          if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
          if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
          reject(err);
        })
        .run();
    });
  } catch (err) {
    // Clean up on error
    if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
    if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
    throw err;
  }
};

// new helper to delete a file from Dropbox
interface DropboxDeleteResult {
    deleted: boolean;
    alreadyDeleted?: boolean;
    response?: unknown;
    info?: string;
}

interface DropboxDeleteError {
    error?: {
        error_summary?: string;
    };
    error_summary?: string;
    message?: string;
}

interface SharedLinkMetadataResult {
    result?: {
        path_lower?: string;
        path_display?: string;
    };
    path_lower?: string;
    path_display?: string;
}

// Helper to get the actual Dropbox path from a shared link URL
async function getPathFromSharedLink(url: string): Promise<string | null> {
    try {
        const dbx = await getDropboxClient();
        const result = await dbx.sharingGetSharedLinkMetadata({ url }) as SharedLinkMetadataResult;
        const path = result?.result?.path_lower || result?.path_lower || result?.result?.path_display || result?.path_display;
        return path || null;
    } catch (error) {
        console.warn('Failed to get path from shared link:', error);
        return null;
    }
}

export const deleteFromDropbox = async (dropboxPathOrUrl: string): Promise<DropboxDeleteResult> => {
    try {
        const dbx = await getDropboxClient();
        
        let pathToDelete = dropboxPathOrUrl;
        
        // If it's a URL (shared link), get the actual path first
        if (dropboxPathOrUrl.startsWith('http')) {
            const actualPath = await getPathFromSharedLink(dropboxPathOrUrl);
            if (!actualPath) {
                return { deleted: false, alreadyDeleted: true, info: 'Could not resolve path from shared link' };
            }
            pathToDelete = actualPath;
            console.log(`Resolved shared link to path: ${pathToDelete}`);
        }
        
        const response = await dbx.filesDeleteV2({ path: pathToDelete });
        return { deleted: true, response };
    } catch (error) {
        // Normalize detection of "not found" / already deleted situations.
        const summary = (error as DropboxDeleteError)?.error?.error_summary || (error as DropboxDeleteError)?.error_summary || (error as DropboxDeleteError)?.message || String(error);
        const s = String(summary).toLowerCase();
        if (s.includes('not_found') || s.includes('not found') || s.includes('path/not_found') || s.includes('shared_link_already_exists')) {
            // Indicate the file was already deleted / not present — not an error for DB deletion.
            return { deleted: false, alreadyDeleted: true, info: summary };
        }
        throw new Error('Dropbox delete failed: ' + ((error as DropboxDeleteError)?.message || String(error)));
    }
};

// new: rename / move a Dropbox file (returns info about result)
interface DropboxMoveMetadata {
    path_display?: string;
    path_lower?: string;
}

interface DropboxMoveResponse {
    result?: {
        metadata?: DropboxMoveMetadata;
    };
}

interface DropboxMoveResult {
    moved: boolean;
    alreadyDeleted?: boolean;
    copied?: boolean;
    response?: DropboxMoveResponse;
    newPath?: string;
    info?: string;
}

interface DropboxMoveError {
    error?: {
        error_summary?: string;
    };
    error_summary?: string;
    message?: string;
}

export const renameDropboxFile = async (oldPath: string, newPath: string): Promise<DropboxMoveResult> => {
    const dbx = await getDropboxClient();
    try {
        const response = await dbx.filesMoveV2({
            from_path: oldPath,
            to_path: newPath,
            autorename: true
        }) as DropboxMoveResponse;
        const meta = response?.result?.metadata;
        const movedPath = meta?.path_display || meta?.path_lower || newPath;
        return { moved: true, response, newPath: movedPath };
    } catch (error) {
        const err = error as DropboxMoveError;
        const summary = err?.error?.error_summary || err?.error_summary || err?.message || String(error);
        const s = String(summary).toLowerCase();

        // If source is missing, indicate alreadyDeleted so caller can decide
        if (s.includes('not_found') || s.includes('path/not_found')) {
            return { moved: false, alreadyDeleted: true, info: summary };
        }

        // On conflict / 409 (target exists) attempt copy+delete as a fallback move
        if (s.includes('already_exists') || s.includes('conflict') || s.includes('409') || s.includes('path/conflict') || s.includes('to') && s.includes('already_exists')) {
            try {
                const copyRes = await dbx.filesCopyV2({
                    from_path: oldPath,
                    to_path: newPath,
                    autorename: true
                }) as DropboxMoveResponse;
                const meta = copyRes?.result?.metadata;
                const finalPath = meta?.path_display || meta?.path_lower || newPath;
                // best-effort delete old file (ignore errors)
                try { await dbx.filesDeleteV2({ path: oldPath }); } catch (delErr) { /* ignore */ }
                return { moved: true, response: copyRes, newPath: finalPath, copied: true };
            } catch (copyErr) {
                const copyError = copyErr as DropboxMoveError;
                throw new Error('Dropbox rename fallback (copy+delete) failed: ' + (copyError?.message || String(copyErr)));
            }
        }

        throw new Error('Dropbox rename failed: ' + (err?.message || String(error)));
    }
};

interface StreamableLinkInput {
    url: string | null | undefined;
}

interface StreamableLinkOutput {
    url: string | null | undefined;
}

export const getStreamableLink = (url: StreamableLinkInput['url']): StreamableLinkOutput['url'] => {
    if (!url) return url;
    try {
        let u: string = String(url);

        // If it is a Dropbox "www.dropbox.com" shared link, convert to dl.dropboxusercontent.com
        // Example: https://www.dropbox.com/s/abcd/file.mp4?dl=0  ->  https://dl.dropboxusercontent.com/s/abcd/file.mp4
        if (/dropbox\.com\/s\//i.test(u)) {
            u = u.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
            // remove dl query if present
            u = u.replace(/(\?|\&)dl=\d+/i, '');
            // remove trailing '?' if empty
            u = u.replace(/\?$/,'');
            return u;
        }

        // If it's a Dropbox shared link of other forms, try convert dl=0 or dl=1 to raw=1
        if (u.includes('dl=0') || u.includes('dl=1')) {
            u = u.replace(/dl=\d+/g, 'raw=1');
            return u;
        }

        // Temporary links (filesGetTemporaryLink) should already be direct; return as-is
        return u;
    } catch (err) {
        return url;
    }
};
