require('dotenv').config();
const mongoose = require('mongoose');
const Problem = require('../models/Problem');
const Inventory = require('../models/Inventory');
const User = require('../models/User');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/codebattle';

const initialProblems = [
  {
    title: 'Two Sum Algorithmic Arena',
    difficulty: 'Easy',
    tags: ['Arrays', 'Hash Table'],
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.',
    sampleInput: '[2, 7, 11, 15], 9',
    sampleOutput: '[0, 1]',
    driverCode: {
      javascript: 'function solution(nums, target) {\n  // Write your tactical logic here\n}',
      cpp: 'vector<int> solution(vector<int>& nums, int target) {\n  // C++ implementation\n}',
      python: 'def solution(nums, target):\n    # Python implementation\n    pass'
    },
    testCases: [
      { input: '[2, 7, 11, 15], 9', expectedOutput: '[0,1]', isHidden: false },
      { input: '[3, 2, 4], 6', expectedOutput: '[1,2]', isHidden: false },
      { input: '[3, 3], 6', expectedOutput: '[0,1]', isHidden: true }
    ],
    points: 100
  },
  {
    title: 'Reverse Linked List Air Drop',
    difficulty: 'Easy',
    tags: ['Linked List', 'Pointers'],
    description: 'Given the head of a singly linked list, reverse the list and return the reversed list array format.',
    sampleInput: '[1, 2, 3, 4, 5]',
    sampleOutput: '[5, 4, 3, 2, 1]',
    driverCode: {
      javascript: 'function solution(head) {\n  return head.reverse();\n}',
      cpp: 'vector<int> solution(vector<int> head) {\n  reverse(head.begin(), head.end());\n  return head;\n}',
      python: 'def solution(head):\n    return head[::-1]'
    },
    testCases: [
      { input: '[1, 2, 3, 4, 5]', expectedOutput: '[5,4,3,2,1]', isHidden: false },
      { input: '[1, 2]', expectedOutput: '[2,1]', isHidden: false },
      { input: '[]', expectedOutput: '[]', isHidden: true }
    ],
    points: 120
  },
  {
    title: 'Valid Parentheses Smoke Screen',
    difficulty: 'Easy',
    tags: ['Stack', 'Strings'],
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.',
    sampleInput: '"()[]{}"',
    sampleOutput: 'true',
    driverCode: {
      javascript: 'function solution(s) {\n  const stack = [];\n  // Write logic\n}',
      cpp: 'bool solution(string s) {\n  // Logic\n}',
      python: 'def solution(s):\n    pass'
    },
    testCases: [
      { input: '"()[]{}"', expectedOutput: 'true', isHidden: false },
      { input: '"(]"', expectedOutput: 'false', isHidden: false },
      { input: '"{[]}"', expectedOutput: 'true', isHidden: true }
    ],
    points: 150
  },
  {
    title: 'Maximum Subarray (Kadane Algo)',
    difficulty: 'Medium',
    tags: ['Dynamic Programming', 'Arrays'],
    description: 'Find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    sampleInput: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]',
    sampleOutput: '6',
    driverCode: {
      javascript: 'function solution(nums) {\n  // Kadanes algorithm\n}',
      cpp: 'int solution(vector<int>& nums) {\n}',
      python: 'def solution(nums):\n    pass'
    },
    testCases: [
      { input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', expectedOutput: '6', isHidden: false },
      { input: '[1]', expectedOutput: '1', isHidden: false },
      { input: '[5, 4, -1, 7, 8]', expectedOutput: '23', isHidden: true }
    ],
    points: 200
  },
  {
    title: 'Merge Intervals Erangel Drop',
    difficulty: 'Medium',
    tags: ['Sorting', 'Arrays'],
    description: 'Given an array of intervals where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals.',
    sampleInput: '[[1,3],[2,6],[8,10],[15,18]]',
    sampleOutput: '[[1,6],[8,10],[15,18]]',
    driverCode: {
      javascript: 'function solution(intervals) {\n}',
      cpp: 'vector<vector<int>> solution(vector<vector<int>>& intervals) {\n}',
      python: 'def solution(intervals):\n    pass'
    },
    testCases: [
      { input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]', isHidden: false },
      { input: '[[1,4],[4,5]]', expectedOutput: '[[1,5]]', isHidden: false }
    ],
    points: 250
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    tags: ['Sliding Window', 'Strings'],
    description: 'Given a string `s`, find the length of the longest substring without repeating characters.',
    sampleInput: '"abcabcbb"',
    sampleOutput: '3',
    driverCode: {
      javascript: 'function solution(s) {\n}',
      cpp: 'int solution(string s) {\n}',
      python: 'def solution(s):\n    pass'
    },
    testCases: [
      { input: '"abcabcbb"', expectedOutput: '3', isHidden: false },
      { input: '"bbbbb"', expectedOutput: '1', isHidden: false },
      { input: '"pwwkew"', expectedOutput: '3', isHidden: true }
    ],
    points: 220
  },
  {
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    tags: ['Trees', 'BFS'],
    description: 'Given the root of a binary tree, return the level order traversal of its nodes values.',
    sampleInput: '[3, 9, 20, null, null, 15, 7]',
    sampleOutput: '[[3],[9,20],[15,7]]',
    driverCode: {
      javascript: 'function solution(root) {\n}',
      cpp: 'vector<vector<int>> solution(TreeNode* root) {\n}',
      python: 'def solution(root):\n    pass'
    },
    testCases: [
      { input: '[3, 9, 20, null, null, 15, 7]', expectedOutput: '[[3],[9,20],[15,7]]', isHidden: false },
      { input: '[1]', expectedOutput: '[[1]]', isHidden: false }
    ],
    points: 240
  },
  {
    title: 'Container With Most Water',
    difficulty: 'Medium',
    tags: ['Two Pointers', 'Greedy'],
    description: 'Given `n` non-negative integers representing an elevation map, find two lines that together with the x-axis form a container containing the most water.',
    sampleInput: '[1,8,6,2,5,4,8,3,7]',
    sampleOutput: '49',
    driverCode: {
      javascript: 'function solution(height) {\n}',
      cpp: 'int solution(vector<int>& height) {\n}',
      python: 'def solution(height):\n    pass'
    },
    testCases: [
      { input: '[1,8,6,2,5,4,8,3,7]', expectedOutput: '49', isHidden: false },
      { input: '[1,1]', expectedOutput: '1', isHidden: false }
    ],
    points: 210
  },
  {
    title: 'Trapping Rain Water (Conqueror Special)',
    difficulty: 'Hard',
    tags: ['Two Pointers', 'Stack', 'Dynamic Programming'],
    description: 'Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    sampleInput: '[0,1,0,2,1,0,1,3,2,1,2,1]',
    sampleOutput: '6',
    driverCode: {
      javascript: 'function solution(height) {\n}',
      cpp: 'int solution(vector<int>& height) {\n}',
      python: 'def solution(height):\n    pass'
    },
    testCases: [
      { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6', isHidden: false },
      { input: '[4,2,0,3,2,5]', expectedOutput: '9', isHidden: true }
    ],
    points: 400
  },
  {
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    tags: ['Binary Search', 'Divide and Conquer'],
    description: 'Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.',
    sampleInput: '[1, 3], [2]',
    sampleOutput: '2.0',
    driverCode: {
      javascript: 'function solution(nums1, nums2) {\n}',
      cpp: 'double solution(vector<int>& nums1, vector<int>& nums2) {\n}',
      python: 'def solution(nums1, nums2):\n    pass'
    },
    testCases: [
      { input: '[1, 3], [2]', expectedOutput: '2.0', isHidden: false },
      { input: '[1, 2], [3, 4]', expectedOutput: '2.5', isHidden: false }
    ],
    points: 450
  }
];

const initialShopItems = [
  { itemType: 'skin', name: 'White Mummy Outfit', costBP: 2500, rarity: 'Legendary', description: 'Iconic BGMI White Mummy outfit rendered with procedural cyber highlights.', assetUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=WhiteMummy' },
  { itemType: 'editorTheme', name: 'Glacier M416 Syntax', costBP: 1800, rarity: 'Legendary', description: 'Monaco Editor syntax highlighting inspired by the Glacier M416 ice finish.', assetUrl: '' },
  { itemType: 'emote', name: 'Golden Conqueror Emote', costBP: 1200, rarity: 'Epic', description: 'Golden victory emote displaying glowing Conqueror status badge.', assetUrl: '' },
  { itemType: 'skin', name: 'Sanhok Jungle Camo', costBP: 1500, rarity: 'Epic', description: 'Tactical forest camo skin for Sanhok speed duels.', assetUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=SanhokCamo' },
  { itemType: 'editorTheme', name: 'Erangel Desert Theme', costBP: 800, rarity: 'Rare', description: 'Warm amber industrial theme for compiler IDE.', assetUrl: '' },
  { itemType: 'emote', name: 'Chicken Dinner Flare', costBP: 950, rarity: 'Rare', description: 'Red tactical flare gun sound and victory light effect.', assetUrl: '' }
];

const initialUsers = [
  { username: 'GhostCoder_99', email: 'ghost_coder@codebattle.com', providerId: 'demo_user_1', rank: 'CONQUEROR', winStreak: 7, unlockedSkins: ['White Mummy Outfit', 'Glacier M416 Syntax'], selectedSkin: 'White Mummy Outfit', stats: { level: 14, exp: 4250, bp: 12850, roomCredits: 5, matchesPlayed: 48, wins: 36, totalSolves: 142 } },
  { username: 'ViperX_Coder', email: 'viperx@codebattle.com', providerId: 'demo_user_2', rank: 'CONQUEROR', winStreak: 12, unlockedSkins: ['White Mummy Outfit'], selectedSkin: 'White Mummy Outfit', stats: { level: 25, exp: 9800, bp: 24850, roomCredits: 10, matchesPlayed: 92, wins: 86, totalSolves: 310 } },
  { username: 'Shadow_Ninja', email: 'shadow@codebattle.com', providerId: 'demo_user_3', rank: 'CONQUEROR', winStreak: 9, unlockedSkins: ['Sanhok Jungle Camo'], selectedSkin: 'Sanhok Jungle Camo', stats: { level: 22, exp: 8400, bp: 22400, roomCredits: 8, matchesPlayed: 85, wins: 78, totalSolves: 275 } },
  { username: 'NullPointer_God', email: 'nullgod@codebattle.com', providerId: 'demo_user_4', rank: 'ACE MASTER', winStreak: 5, unlockedSkins: ['White Mummy Outfit'], selectedSkin: 'White Mummy Outfit', stats: { level: 19, exp: 6700, bp: 19950, roomCredits: 6, matchesPlayed: 70, wins: 62, totalSolves: 210 } },
  { username: 'Erangel_King', email: 'erangelking@codebattle.com', providerId: 'demo_user_5', rank: 'ACE MASTER', winStreak: 4, unlockedSkins: ['Glacier M416 Syntax'], selectedSkin: 'Glacier M416 Syntax', stats: { level: 18, exp: 6200, bp: 18200, roomCredits: 5, matchesPlayed: 65, wins: 56, totalSolves: 190 } }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB for seeding:', mongoUri);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing Problems, Inventory, and User mock collections...');
    await Problem.deleteMany({});
    await Inventory.deleteMany({});
    await User.deleteMany({});

    // Drop stale indexes on user collection if any exist
    try {
      await User.collection.dropIndexes();
      console.log('Cleaned old user indexes.');
    } catch (e) {
      // index clean warning ignored
    }

    console.log('Seeding 10 DSA Problems...');
    await Problem.insertMany(initialProblems);

    console.log('Seeding Inventory Shop Items...');
    await Inventory.insertMany(initialShopItems);

    console.log('Seeding Top Conqueror Users & Leaderboard...');
    await User.insertMany(initialUsers);

    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seedDatabase();
