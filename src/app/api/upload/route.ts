import { NextRequest, NextResponse } from 'next/server'
import { cloudinary } from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Upload to Cloudinary using base64
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`
    
    const result = await cloudinary.uploader.upload(base64, {
      resource_type: 'video',
      folder: 'autoclipp/uploads',
      chunk_size: 6000000,
    })

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      duration: result.duration,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
