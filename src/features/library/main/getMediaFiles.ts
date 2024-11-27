import { promises as fs } from 'fs'
import path from 'path'
import type { MediaFile } from '../shared/types'

// Supported file extensions
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'])
const VIDEO_EXTENSIONS = new Set(['.mp4', '.webm', '.mov', '.avi', '.mkv'])

async function* walkDirectory(dir: string): AsyncGenerator<string> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    
    if (entry.isDirectory()) {
      yield* walkDirectory(fullPath)
    } else if (entry.isFile()) {
      yield fullPath
    }
  }
}

export async function getMediaFiles(libraryPath: string): Promise<MediaFile[]> {
  const mediaFiles: MediaFile[] = []

  try {
    for await (const filePath of walkDirectory(libraryPath)) {
      const ext = path.extname(filePath).toLowerCase()
      
      // Check if file extension matches supported formats
      const isImage = IMAGE_EXTENSIONS.has(ext)
      const isVideo = VIDEO_EXTENSIONS.has(ext)
      
      if (!isImage && !isVideo) continue
      
      // Get file stats
      const stats = await fs.stat(filePath)
      
      mediaFiles.push({
        path: filePath,
        type: isImage ? 'image' : 'video',
        name: path.basename(filePath),
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      })
    }

    return mediaFiles
  } catch (error) {
    console.error('Error scanning library:', error)
    throw error
  }
}
