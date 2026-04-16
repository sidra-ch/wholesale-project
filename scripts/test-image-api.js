const https = require('https');

const TOKEN = '1|hoPqHTHuS7KXeJd90Ln9CKu3MT2xUumnxRpBhokU8345da9d';
const BASE = 'https://arslanwholesale.alwaysdata.net/api';

function req(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE + path);
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    };
    const r = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
        catch { resolve({ status: res.statusCode, data: body }); }
      });
    });
    r.on('error', reject);
    if (data) r.write(data);
    r.end();
  });
}

async function main() {
  // Product image mapping: product_id -> [image URLs]
  const prodImages = {
    1: ['/images/img1.jpeg', '/images/img2.jpeg'],
    2: ['/images/img3.jpeg', '/images/img4.jpeg'],
    3: ['/images/img5.jpeg', '/images/img6.jpeg'],
    4: ['/images/img7.jpeg', '/images/img8.jpeg'],
    5: ['/images/img9.jpeg', '/images/img10.jpeg'],
    6: ['/images/img11.jpeg', '/images/img12.jpeg'],
    7: ['/images/img13.jpeg', '/images/img14.jpeg'],
    8: ['/images/img15.jpeg', '/images/img16.jpeg'],
  };

  console.log('=== Updating Product Images ===');
  for (const [id, images] of Object.entries(prodImages)) {
    const r = await req('PUT', `/admin/products/${id}`, { images });
    console.log(`Product ${id}: ${r.status} - ${r.data.message || JSON.stringify(r.data).substring(0, 100)}`);
  }

  // Verify
  console.log('\n=== Verifying ===');
  const r = await req('GET', '/products');
  for (const p of r.data.data) {
    const imgs = p.images.map(i => i.image_url).join(', ');
    console.log(`Product ${p.id} (${p.name}): ${imgs}`);
  }

  // Also verify categories
  const c = await req('GET', '/categories');
  console.log('\n=== Categories ===');
  for (const cat of c.data.categories || c.data) {
    console.log(`Cat ${cat.id} (${cat.name}): ${cat.image}`);
  }
}

main().catch(console.error);
