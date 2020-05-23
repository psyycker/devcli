#!/usr/bin/env node

const removeFilePatternRecursive = require('../src/remove-file-pattern-recursive');
const args = process.argv.slice(2);
const path = args.length === 0 ? '.' : args[0];
removeFilePatternRecursive(path, 'node_modules');
