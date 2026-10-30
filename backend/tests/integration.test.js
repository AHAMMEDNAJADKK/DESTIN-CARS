const http = require('http');

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runIntegrationTests() {
  console.log('🚀 Running Full End-to-End API Integration Tests...\n');
  let passed = 0;
  let failed = 0;

  async function check(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (e) {
      console.error(`  ❌ FAIL: ${name} -> ${e.message}`);
      failed++;
    }
  }

  // 1. Health check
  await check('Health Check Endpoint /api/health', async () => {
    const res = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET'
    });
    if (res.status !== 200 || res.data.status !== 'healthy') {
      throw new Error(`Unexpected health response: ${JSON.stringify(res)}`);
    }
  });

  // 2. Next voucher number
  let nextVoucherNo = '';
  await check('Generate Next Voucher Number /api/vouchers/next-number', async () => {
    const res = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/vouchers/next-number',
      method: 'GET'
    });
    if (res.status !== 200 || !res.data.voucherNumber) {
      throw new Error(`Failed to get voucher number: ${JSON.stringify(res)}`);
    }
    nextVoucherNo = res.data.voucherNumber;
    console.log(`     Generated Voucher Number: ${nextVoucherNo}`);
  });

  // 3. Create Voucher with all fields
  let createdVoucherId = '';
  await check('Create Voucher with Valid Data', async () => {
    const payload = {
      voucherNumber: nextVoucherNo,
      date: new Date().toISOString(),
      vehicleNumber: 'KL 07 CD 5500',
      driverName: 'Suresh Kumar',
      driverPhone: '+919526886600',
      customerName: 'Dr. Anand Verma',
      customerAddress: 'Grand Hyatt, Bolgatty, Kochi',
      customerPhone: '9847012345',
      startingLocation: 'Cochin International Airport',
      destination: 'Munnar Tea Hills Resort',
      startingKM: 12450,
      closingKM: 12620,
      fromTime: '08:30',
      toTime: '16:00',
      taxiCharges: 4500,
      tollParking: 250,
      nightBata: 300,
      advance: 1000
    };

    const res = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/vouchers',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      payload
    );

    if (res.status !== 201 || !res.data.data?._id) {
      throw new Error(`Create failed: ${JSON.stringify(res.data)}`);
    }

    createdVoucherId = res.data.data._id;
    // Check recalculated fields on backend
    if (res.data.data.totalKM !== 170) {
      throw new Error(`Total KM calculation mismatch: expected 170, got ${res.data.data.totalKM}`);
    }
    if (res.data.data.totalAmount !== 5050) {
      throw new Error(`Total Amount calculation mismatch: expected 5050, got ${res.data.data.totalAmount}`);
    }
    if (res.data.data.balance !== 4050) {
      throw new Error(`Balance calculation mismatch: expected 4050, got ${res.data.data.balance}`);
    }
  });

  // 4. Duplicate voucher number rejection
  await check('Reject Duplicate Voucher Number', async () => {
    const res = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/vouchers',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        voucherNumber: nextVoucherNo,
        date: new Date().toISOString(),
        vehicleNumber: 'KL 07 CD 5500',
        driverName: 'Test Driver',
        driverPhone: '9526886600',
        customerName: 'Test Customer',
        customerPhone: '9847012345',
        startingLocation: 'A',
        destination: 'B',
        startingKM: 100,
        closingKM: 200,
        fromTime: '10:00',
        toTime: '12:00',
        taxiCharges: 1000
      }
    );
    if (res.status !== 409) {
      throw new Error(`Expected 409 Conflict, received: ${res.status}`);
    }
  });

  // 5. Validation rejection: Closing KM < Starting KM
  await check('Reject when Closing KM < Starting KM', async () => {
    const res = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/vouchers',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        voucherNumber: 'DC-TEST-FAIL-KM',
        date: new Date().toISOString(),
        vehicleNumber: 'KL 07 CD 5500',
        driverName: 'Driver',
        driverPhone: '9526886600',
        customerName: 'Customer',
        customerPhone: '9847012345',
        startingLocation: 'A',
        destination: 'B',
        startingKM: 500,
        closingKM: 400,
        fromTime: '10:00',
        toTime: '12:00',
        taxiCharges: 1000
      }
    );
    if (res.status !== 400) {
      throw new Error(`Expected 400 Bad Request, received: ${res.status}`);
    }
  });

  // 6. Validation rejection: Invalid Indian phone number
  await check('Reject Invalid Indian Phone Number', async () => {
    const res = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/vouchers',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        voucherNumber: 'DC-TEST-FAIL-PHONE',
        date: new Date().toISOString(),
        vehicleNumber: 'KL 07 CD 5500',
        driverName: 'Driver',
        driverPhone: '12345', // invalid
        customerName: 'Customer',
        customerPhone: '9847012345',
        startingLocation: 'A',
        destination: 'B',
        startingKM: 100,
        closingKM: 200,
        fromTime: '10:00',
        toTime: '12:00',
        taxiCharges: 1000
      }
    );
    if (res.status !== 400) {
      throw new Error(`Expected 400 Bad Request, received: ${res.status}`);
    }
  });

  // 7. Retrieve vouchers list
  await check('Get Vouchers List /api/vouchers', async () => {
    const res = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/vouchers',
      method: 'GET'
    });
    if (res.status !== 200 || !Array.isArray(res.data.data) || res.data.data.length === 0) {
      throw new Error(`Failed to list vouchers: ${JSON.stringify(res.data)}`);
    }
  });

  // 8. Search vouchers by customer name
  await check('Search Vouchers by Customer Name', async () => {
    const res = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/vouchers?search=Anand',
      method: 'GET'
    });
    if (res.status !== 200 || res.data.data.length === 0) {
      throw new Error(`Search returned no results: ${JSON.stringify(res.data)}`);
    }
  });

  // 9. Update Voucher
  await check('Update Voucher /api/vouchers/:id', async () => {
    const updatePayload = {
      voucherNumber: nextVoucherNo,
      date: new Date().toISOString(),
      vehicleNumber: 'KL 07 CD 5500',
      driverName: 'Suresh Kumar',
      driverPhone: '+919526886600',
      customerName: 'Dr. Anand Verma',
      customerAddress: 'Grand Hyatt, Bolgatty, Kochi',
      customerPhone: '9847012345',
      startingLocation: 'Cochin International Airport',
      destination: 'Munnar Tea Hills Resort',
      startingKM: 12450,
      closingKM: 12650, // Updated KM (+30km)
      fromTime: '08:30',
      toTime: '17:30',
      taxiCharges: 4800, // Updated taxi charge
      tollParking: 250,
      nightBata: 300,
      advance: 1500 // Updated advance
    };

    const res = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/vouchers/${createdVoucherId}`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      },
      updatePayload
    );

    if (res.status !== 200 || res.data.data.closingKM !== 12650) {
      throw new Error(`Update failed: ${JSON.stringify(res.data)}`);
    }
    if (res.data.data.totalKM !== 200) {
      throw new Error(`Updated Total KM expected 200, got ${res.data.data.totalKM}`);
    }
    if (res.data.data.totalAmount !== 5350) {
      throw new Error(`Updated Total Amount expected 5350, got ${res.data.data.totalAmount}`);
    }
    if (res.data.data.balance !== 3850) {
      throw new Error(`Updated Balance expected 3850, got ${res.data.data.balance}`);
    }
  });

  // 10. Clean up / Delete Voucher
  await check('Delete Voucher /api/vouchers/:id', async () => {
    const res = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/vouchers/${createdVoucherId}`,
      method: 'DELETE'
    });
    if (res.status !== 200) {
      throw new Error(`Delete failed: ${JSON.stringify(res.data)}`);
    }
  });

  console.log(`\n========================================`);
  console.log(`Integration Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runIntegrationTests();
