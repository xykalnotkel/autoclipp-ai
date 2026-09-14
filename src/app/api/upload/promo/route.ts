import { NextRequest, NextResponse } from 'next/server'
import { cloudinary } from '@/lib/cloudinary'

export const runtime = 'nodejs'
export const maxDuration = 60

// Convert image to WebP sharp + compress tetap tajam
async function convertToWebpSharp(buffer: Buffer): Promise<Buffer> {
  try {
    const sharp = (await import('sharp')).default
    // Convert ke WebP dengan kualitas tinggi tapi compress
    // Resize max 800x1200 untuk promo popup 3:4, tanpa stretch
    // Quality 82 = tajam tapi file kecil (biasanya 40-70% lebih kecil dari JPG)
    // Effort 6 = balance speed & compression
    // SmartSubsample, keep metadata minimal
    const webpBuffer = await sharp(buffer)
      .rotate() // auto rotate based on EXIF
      .resize({
        width: 800,
        height: 1200,
        fit: 'inside', // keep aspect ratio, tidak stretch
        withoutEnlargement: true, // jangan upscale kalau sudah kecil
      })
      .webp({
        quality: 82, // 82 = tajam, 75 = lebih kecil, 90 = hampir lossless
        effort: 6, // 0-6, 6 paling compress tapi lambat dikit
        smartSubsample: true,
        nearLossless: false,
      })
      .toBuffer()
    
    return webpBuffer
  } catch (e) {
    console.log('Sharp not available, fallback to original', e)
    return buffer
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 })
    }

    // Validasi type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Hanya gambar yang diperbolehkan (JPG, PNG, WebP, etc)' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File terlalu besar, max 10MB' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const originalBuffer = Buffer.from(arrayBuffer)
    
    console.log(`Original: ${file.name} ${file.type} ${(file.size/1024).toFixed(1)}KB`)

    // Convert ke WebP sharp
    const webpBuffer = await convertToWebpSharp(originalBuffer)
    console.log(`WebP converted: ${(webpBuffer.length/1024).toFixed(1)}KB (saved ${(((file.size - webpBuffer.length)/file.size)*100).toFixed(1)}%)`)

    // Upload ke Cloudinary sebagai WebP
    const base64 = `data:image/webp;base64,${webpBuffer.toString('base64')}`
    
    const result = await cloudinary.uploader.upload(base64, {
      resource_type: 'image',
      folder: 'autoclipp/promos',
      format: 'webp',
      transformation: [
        // Cloudinary auto optimize lagi, tapi keep sharp
        { quality: 'auto:good', fetch_format: 'webp', flags: 'preserve_transparency' },
      ],
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    })

    // Generate optimized URL dengan webp + compress
    const optimizedUrl = cloudinary.url(result.public_id, {
      format: 'webp',
      quality: 'auto:good',
      fetch_format: 'webp',
      flags: 'progressive',
      secure: true,
    })

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      optimized_url: optimizedUrl,
      public_id: result.public_id,
      original_size: file.size,
      webp_size: webpBuffer.length,
      saved_percent: Math.round(((file.size - webpBuffer.length) / file.size) * 100),
      format: 'webp',
      width: result.width,
      height: result.height,
      message: `Berhasil convert ke WebP, compress ${Math.round(((file.size - webpBuffer.length) / file.size) * 100)}% tetap tajam`
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    })
  } catch (error: any) {
    console.error('Promo upload error:', error)
    return NextResponse.json({ error: error.message || 'Upload gagal' }, { status: 500 })
  }
}

// GET untuk cek status
export async function GET() {
  return NextResponse.json({
    status: 'promo upload API ready',
    features: ['auto webp convert', 'sharp compress 82% quality', 'resize max 800x1200', 'keep aspect ratio', 'cloudinary upload', 'progressive webp'],
    max_size: '10MB',
    output: 'webp',
    quality: '82% (tajam tapi kecil)'
  })
}
