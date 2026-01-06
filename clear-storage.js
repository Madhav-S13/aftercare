// INSTRUCTIONS: Open Chrome DevTools Console and paste this script
// This will clear all stored authentication data

localStorage.removeItem('token');
localStorage.removeItem('user');
console.log('✅ LocalStorage cleared! Please refresh the page.');
