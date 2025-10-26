import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, phone, searchFilters } = await request.json()
    
    // Simular guardado en base de datos
    console.log('Nueva alerta guardada:', { email, phone, searchFilters })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Alerta guardada correctamente' 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al guardar la alerta' },
      { status: 500 }
    )
  }
}
