const axios = require('axios');
const cheerio = require('cheerio');

async function testScrape() {
  try {
    const bookingId = 600445;
    const url = `https://www.revoltmotors.com/thankyoubooking/${bookingId}`;
    
    console.log(`\n📍 Fetching: ${url}\n`);

    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const html = response.data;
    console.log(`✓ Page size: ${html.length} bytes\n`);

    // Save first 2000 chars for inspection
    console.log('📄 First 2000 characters of page:');
    console.log('='.repeat(80));
    console.log(html.substring(0, 2000));
    console.log('='.repeat(80));

    // Load with cheerio
    const $ = cheerio.load(html);

    // Try to find text content
    const bodyText = $('body').text();
    console.log(`\n📝 Body text length: ${bodyText.length}`);
    console.log('First 1000 chars of body text:');
    console.log('='.repeat(80));
    console.log(bodyText.substring(0, 1000));
    console.log('='.repeat(80));

    // Look for specific patterns
    console.log('\n🔍 Searching for patterns:\n');
    
    // Phone numbers
    const phones = bodyText.match(/\d{10}/g);
    console.log(`📞 Phone numbers found:`, phones ? phones.slice(0, 5) : 'None');

    // Emails
    const emails = bodyText.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi);
    console.log(`📧 Emails found:`, emails ? emails.slice(0, 3) : 'None');

    // Look for divs and tables
    console.log(`\n📊 Elements found:`);
    console.log(`- Divs: ${$('div').length}`);
    console.log(`- Tables: ${$('table').length}`);
    console.log(`- Forms: ${$('form').length}`);
    console.log(`- Sections: ${$('section').length}`);
    console.log(`- Articles: ${$('article').length}`);

    // Try to find customer info section
    console.log('\n🔎 Looking for customer info elements:\n');
    
    $('div, span, p, h1, h2, h3, h4, h5, h6').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text && (
        text.toLowerCase().includes('name') ||
        text.toLowerCase().includes('email') ||
        text.toLowerCase().includes('phone') ||
        text.toLowerCase().includes('mobile') ||
        text.toLowerCase().includes('customer') ||
        text.match(/\d{10}/) ||
        text.match(/[a-z0-9._%+-]+@/i)
      )) {
        if (i < 50) { // Limit output
          console.log(`[${i}] ${text.substring(0, 100)}`);
        }
      }
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
    }
  }
}

testScrape();
