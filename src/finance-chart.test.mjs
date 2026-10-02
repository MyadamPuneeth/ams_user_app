import assert from 'node:assert/strict';
import { branchRevenueChart } from './finance-chart.ts';

const pie = branchRevenueChart([
  { branchId: 'old', branchName: 'Old branch', revenue: '100' },
  { branchId: 'new', branchName: 'New branch', revenue: '300' },
  { branchId: null, branchName: 'Unassigned', revenue: '-20' },
]);
assert.match(pie, /0deg 90deg/);
assert.match(pie, /90deg 360deg/);
assert.equal(branchRevenueChart([]), '');
