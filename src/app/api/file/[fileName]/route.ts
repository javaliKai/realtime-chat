import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.url;
  console.log(url);

  return NextResponse.json({ success: true });
}
