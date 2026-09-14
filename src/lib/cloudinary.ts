import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'jxjvz3qi',
  api_key: process.env.CLOUDINARY_API_KEY || '215792579745162',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'tuq6D7UuyBHU50aj4upCXPfvilA',
})

export { cloudinary }

export async function uploadToCloudinary(filePath: string, folder: string = 'autoclipp') {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'video',
      folder,
      chunk_size: 6000000,
    })
    return result
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}
