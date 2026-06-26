import {
  formatAgencyReport,
  formatBalanceReport,
  runAgencyReport,
  runBalanceSimulation,
} from "../src/engine/balance";

const RUNS = Number(process.env.BALANCE_RUNS ?? 3000);

const profiles = [
  { ovr: 80, label: "Mediano" },
  { ovr: 85, label: "Forte" },
  { ovr: 90, label: "Elite" },
] as const;

console.log(`\nEleven Monsters — Balance Report (${RUNS} runs per profile)\n`);

for (const profile of profiles) {
  const report = runBalanceSimulation(profile, RUNS);
  console.log(formatBalanceReport(report));
  console.log();
}

console.log(formatAgencyReport(runAgencyReport(RUNS)));
console.log();
