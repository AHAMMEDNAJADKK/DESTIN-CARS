const assert = require('assert');
const {
  calculateTotalKM,
  calculateTotalAmount,
  calculateBalance,
  calculateDuration,
  isValidIndianPhone
} = require('../src/utils/calculations');

console.log('🧪 Starting Destin Cabs Backend Unit Tests...\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    failed++;
  }
}

// Test 1: Calculate Total KM
test('calculateTotalKM standard calculation', () => {
  const result = calculateTotalKM(100, 250);
  assert.strictEqual(result, 150);
});

// Test 2: Calculate Total KM with decimals
test('calculateTotalKM handles decimals accurately', () => {
  const result = calculateTotalKM(120.5, 345.8);
  assert.strictEqual(result, 225.3);
});

// Test 3: Closing KM less than Starting KM throws error
test('calculateTotalKM throws error when closing KM < starting KM', () => {
  assert.throws(() => {
    calculateTotalKM(200, 150);
  }, /Closing KM cannot be less than Starting KM/);
});

// Test 4: Calculate Total Amount
test('calculateTotalAmount sums taxi, toll, and night bata', () => {
  const result = calculateTotalAmount(2500, 250, 300);
  assert.strictEqual(result, 3050);
});

// Test 5: Calculate Total Amount with optional zero/missing fields
test('calculateTotalAmount with zero night bata and toll', () => {
  const result = calculateTotalAmount(1800, 0, 0);
  assert.strictEqual(result, 1800);
});

// Test 6: Negative charge amounts throw error
test('calculateTotalAmount rejects negative numbers', () => {
  assert.throws(() => {
    calculateTotalAmount(1500, -50, 200);
  }, /Charge amounts cannot be negative/);
});

// Test 7: Calculate Balance
test('calculateBalance correctly calculates remaining amount', () => {
  const balance = calculateBalance(3000, 1000);
  assert.strictEqual(balance, 2000);
});

// Test 8: Calculate Balance when full advance paid
test('calculateBalance zero balance when advance equals total', () => {
  const balance = calculateBalance(2500, 2500);
  assert.strictEqual(balance, 0);
});

// Test 9: Calculate Balance negative advance throws error
test('calculateBalance rejects negative advance', () => {
  assert.throws(() => {
    calculateBalance(2000, -500);
  }, /Advance amount cannot be negative/);
});

// Test 10: Calculate Duration same day
test('calculateDuration standard day trip', () => {
  const duration = calculateDuration('08:30', '17:45');
  assert.strictEqual(duration.hours, 9);
  assert.strictEqual(duration.minutes, 15);
  assert.strictEqual(duration.totalMinutes, 555);
  assert.strictEqual(duration.formatted, '9 hrs 15 mins');
});

// Test 11: Calculate Duration crossing midnight
test('calculateDuration trip crossing midnight (22:00 to 02:30)', () => {
  const duration = calculateDuration('22:00', '02:30');
  assert.strictEqual(duration.hours, 4);
  assert.strictEqual(duration.minutes, 30);
  assert.strictEqual(duration.totalMinutes, 270);
  assert.strictEqual(duration.formatted, '4 hrs 30 mins');
});

// Test 12: Calculate Duration exact hours
test('calculateDuration exact full hours', () => {
  const duration = calculateDuration('10:00', '15:00');
  assert.strictEqual(duration.hours, 5);
  assert.strictEqual(duration.minutes, 0);
  assert.strictEqual(duration.formatted, '5 hrs');
});

// Test 13: Indian Phone number validation valid numbers
test('isValidIndianPhone accepts standard 10 digit and +91', () => {
  assert.strictEqual(isValidIndianPhone('9526886600'), true);
  assert.strictEqual(isValidIndianPhone('+919526886600'), true);
  assert.strictEqual(isValidIndianPhone('+91 95268 86600'), true);
  assert.strictEqual(isValidIndianPhone('9847012345'), true);
});

// Test 14: Indian Phone number validation invalid numbers
test('isValidIndianPhone rejects invalid lengths and formats', () => {
  assert.strictEqual(isValidIndianPhone('12345'), false);
  assert.strictEqual(isValidIndianPhone('5526886600'), false); // Starts with 5 (not 6-9)
  assert.strictEqual(isValidIndianPhone('abcdefghij'), false);
  assert.strictEqual(isValidIndianPhone(''), false);
});

console.log(`\n========================================`);
console.log(`Results: ${passed} Passed, ${failed} Failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
