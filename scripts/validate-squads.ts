#!/usr/bin/env bun
import { ALL_SQUADS } from "../src/data/squads/index";
import {
  formatValidationReport,
  validateAllSquads,
} from "../src/data/squads/validate";

const issues = validateAllSquads(ALL_SQUADS);

if (issues.length === 0) {
  console.log(`✓ ${ALL_SQUADS.length} seleções validadas`);
  process.exit(0);
}

console.error(formatValidationReport(issues));
process.exit(1);
