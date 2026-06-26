import { describe, expect, it } from "vitest";
import {
  formatBalanceReport,
  runAgencyReport,
  runBalanceSimulation,
  simulateTournamentRun,
  createUniformTeam,
} from "./balance";

const SIM_RUNS = 2000;

describe("balance simulation", () => {
  it("runs a full tournament deterministically", () => {
    const team = createUniformTeam(85);
    const a = simulateTournamentRun(42, team);
    const b = simulateTournamentRun(42, team);
    expect(a.champion).toBe(b.champion);
    expect(a.deepestPhase).toBe(b.deepestPhase);
  });

  it("prints current balance report", () => {
    const profiles = [
      { ovr: 80, label: "Mediano" },
      { ovr: 85, label: "Forte" },
      { ovr: 90, label: "Elite" },
    ] as const;

    const reports = profiles.map((p) => runBalanceSimulation(p, SIM_RUNS));
    const output = reports.map(formatBalanceReport).join("\n\n");
    console.log("\n=== BALANCE REPORT ===\n" + output + "\n");

    expect(reports[0].runs).toBe(SIM_RUNS);
  });

  it("keeps champion rate within expected bounds for median team (OVR 80)", () => {
    const report = runBalanceSimulation({ ovr: 80, label: "Mediano" }, 1500);
    expect(report.championRate).toBeGreaterThan(0.05);
    expect(report.championRate).toBeLessThan(0.12);
    expect(report.quarterRate).toBeGreaterThan(0.45);
    expect(report.quarterRate).toBeLessThan(0.7);
  });

  it("keeps champion rate within expected bounds for elite team (OVR 90)", () => {
    const report = runBalanceSimulation({ ovr: 90, label: "Elite" }, 1500);
    expect(report.championRate).toBeGreaterThan(0.25);
    expect(report.championRate).toBeLessThan(0.42);
    expect(report.finalRate).toBeGreaterThan(0.35);
  });

  it("elite team outperforms median team", () => {
    const median = runBalanceSimulation({ ovr: 80, label: "Mediano" }, 800);
    const elite = runBalanceSimulation({ ovr: 90, label: "Elite" }, 800);
    expect(elite.championRate).toBeGreaterThan(median.championRate);
    expect(elite.quarterRate).toBeGreaterThan(median.quarterRate);
  });

  it("keeps skill agency above seed (paired seeds)", () => {
    const agency = runAgencyReport(1200);
    expect(agency.skillLiftChampion).toBeGreaterThan(0.2);
    expect(agency.eliteWinsMedianLosesRate).toBeGreaterThan(0.15);
    expect(agency.medianWinsEliteLosesRate).toBeLessThan(0.02);
    expect(agency.hopelessSeedRate).toBeLessThan(0.15);
    expect(agency.decisionLiftChampion).toBeGreaterThan(0.03);
  });
});
