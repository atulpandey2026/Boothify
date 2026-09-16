import { NextRequest } from 'next/server';
import dns from 'node:dns/promises';
import net from 'node:net';

function isPrivateIp(ip: string) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return a === 10 || a === 127 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || a === 0;
  }
  if (net.isIPv6(ip)) {
    const normalized = ip.toLowerCase();
    return normalized === '::1' || normalized.startsWith('fc') || normalized.startsWith('fd') || normalized.startsWith('fe80:');
  }
  return true;
}

async function isSafeHost(hostname: string) {
  const lower = hostname.toLowerCase();
  if (lower === 'localhost' || lower.endsWith('.localhost') || lower.endsWith('.local')) return false;
  const addresses = await dns.lookup(hostname, { all: true });
  return addresses.length > 0 && addresses.every(({ address }) => !isPrivateIp(address));
}

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get('url');

  if (!rawUrl) {
    return new Response('Missing image URL', { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(rawUrl);
  } catch {
    return new Response('Invalid image URL', { status: 400 });
  }

  if (!['http:', 'https:'].includes(target.protocol)) {
    return new Response('Unsupported URL protocol', { status: 400 });
  }

  try {
    if (!(await isSafeHost(target.hostname))) {
      return new Response('Blocked image host', { status: 400 });
    }

    const response = await fetch(target.toString(), {
      headers: {
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'User-Agent': 'Boothify Image Proxy',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(10000),
      cache: 'no-store',
    });

    if (!response.ok) {
      return new Response(`Unable to load image (${response.status})`, { status: 502 });
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.toLowerCase().startsWith('image/')) {
      return new Response('The supplied URL does not point directly to an image.', { status: 415 });
    }

    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');

    const contentLength = response.headers.get('content-length');
    if (contentLength) headers.set('Content-Length', contentLength);

    return new Response(response.body, { status: 200, headers });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new Response('Unable to fetch the external image.', { status: 502 });
  }
}
