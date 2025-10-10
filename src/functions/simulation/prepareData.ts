import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { Actor, Risk, SimulationInput } from "./types";
import { pDailyFromReturnPeriodMonths } from "../indicators/probability";
import { DVCascadeSnapshot } from "../../types/dataverse/DVCascadeSnapshot";
import { RISK_TYPE } from "../../types/dataverse/Riskfile";

export function prepareData(
  risks: DVRiskSnapshot[],
  cascades: DVCascadeSnapshot[]
): SimulationInput {
  const standardRisks = risks.filter(
    (r) => r.cr4de_risk_type === RISK_TYPE.STANDARD
  );
  const actorRisks = risks.filter(
    (r) => r.cr4de_risk_type === RISK_TYPE.MANMADE
  );

  const input: SimulationInput = {
    rootNode: {
      id: null,
      risks: [],
      actors: [],
    },
    numberOfSimulations: 1,
  };

  const riskCatalog: Record<string, Risk> = standardRisks.reduce(
    (acc, risk) => ({
      ...acc,
      [risk._cr4de_risk_file_value]: {
        id: risk._cr4de_risk_file_value,
        name: risk.cr4de_title,
        cascades: [],
        directImpact: {
          considerable: {
            ha: risk.cr4de_quanti.considerable.di.ha.euros,
            hb: risk.cr4de_quanti.considerable.di.hb.euros,
            hc: risk.cr4de_quanti.considerable.di.hc.euros,
            sa: risk.cr4de_quanti.considerable.di.sa.euros,
            sb: risk.cr4de_quanti.considerable.di.sb.euros,
            sc: risk.cr4de_quanti.considerable.di.sc.euros,
            sd: risk.cr4de_quanti.considerable.di.sd.euros,
            ea: risk.cr4de_quanti.considerable.di.ea.euros,
            fa: risk.cr4de_quanti.considerable.di.fa.euros,
            fb: risk.cr4de_quanti.considerable.di.fb.euros,
          },
          major: {
            ha: risk.cr4de_quanti.major.di.ha.euros,
            hb: risk.cr4de_quanti.major.di.hb.euros,
            hc: risk.cr4de_quanti.major.di.hc.euros,
            sa: risk.cr4de_quanti.major.di.sa.euros,
            sb: risk.cr4de_quanti.major.di.sb.euros,
            sc: risk.cr4de_quanti.major.di.sc.euros,
            sd: risk.cr4de_quanti.major.di.sd.euros,
            ea: risk.cr4de_quanti.major.di.ea.euros,
            fa: risk.cr4de_quanti.major.di.fa.euros,
            fb: risk.cr4de_quanti.major.di.fb.euros,
          },
          extreme: {
            ha: risk.cr4de_quanti.extreme.di.ha.euros,
            hb: risk.cr4de_quanti.extreme.di.hb.euros,
            hc: risk.cr4de_quanti.extreme.di.hc.euros,
            sa: risk.cr4de_quanti.extreme.di.sa.euros,
            sb: risk.cr4de_quanti.extreme.di.sb.euros,
            sc: risk.cr4de_quanti.extreme.di.sc.euros,
            sd: risk.cr4de_quanti.extreme.di.sd.euros,
            ea: risk.cr4de_quanti.extreme.di.ea.euros,
            fa: risk.cr4de_quanti.extreme.di.fa.euros,
            fb: risk.cr4de_quanti.extreme.di.fb.euros,
          },
        },
      },
    }),
    {}
  );
  const actorCatalog: Record<string, Actor> = actorRisks.reduce((acc, risk) => {
    const actor = {
      id: risk._cr4de_risk_file_value,
      name: risk.cr4de_title,
      attacks: [],
    };

    input.rootNode.actors.push(actor);

    return {
      ...acc,
      [risk._cr4de_risk_file_value]: actor,
    };
  }, {});

  for (const risk of standardRisks) {
    input.rootNode.risks.push({
      cause: input.rootNode,
      causeScenario: null,
      effect: riskCatalog[risk._cr4de_risk_file_value],
      probabilities: {
        considerable: pDailyFromReturnPeriodMonths(
          risk.cr4de_quanti.considerable.dp.rpMonths
        ),
        major: pDailyFromReturnPeriodMonths(
          risk.cr4de_quanti.major.dp.rpMonths
        ),
        extreme: pDailyFromReturnPeriodMonths(
          risk.cr4de_quanti.extreme.dp.rpMonths
        ),
      },
    });
  }

  for (const cascade of cascades) {
    const cause = riskCatalog[cascade._cr4de_cause_risk_value];
    const effect = riskCatalog[cascade._cr4de_effect_risk_value];

    if (!effect) continue;

    if (!cause) {
      // Check if cause is an actor risk
      const actorRisk = actorCatalog[cascade._cr4de_cause_risk_value];
      if (actorRisk) {
        actorRisk.attacks.push({
          cause: actorRisk,
          causeScenario: "considerable",
          effect,
          probabilities: {
            considerable: cascade.cr4de_quanti_cp.considerable.considerable.abs,
            major: cascade.cr4de_quanti_cp.considerable.major.abs,
            extreme: cascade.cr4de_quanti_cp.considerable.extreme.abs,
          },
        });
        actorRisk.attacks.push({
          cause: actorRisk,
          causeScenario: "major",
          effect,
          probabilities: {
            considerable: cascade.cr4de_quanti_cp.major.considerable.abs,
            major: cascade.cr4de_quanti_cp.major.major.abs,
            extreme: cascade.cr4de_quanti_cp.major.extreme.abs,
          },
        });
        actorRisk.attacks.push({
          cause: actorRisk,
          causeScenario: "extreme",
          effect,
          probabilities: {
            considerable: cascade.cr4de_quanti_cp.extreme.considerable.abs,
            major: cascade.cr4de_quanti_cp.extreme.major.abs,
            extreme: cascade.cr4de_quanti_cp.extreme.extreme.abs,
          },
        });
      }
      continue;
    }

    cause.cascades.push({
      cause,
      causeScenario: "considerable",
      effect,
      probabilities: {
        considerable: cascade.cr4de_quanti_cp.considerable.considerable.abs,
        major: cascade.cr4de_quanti_cp.considerable.major.abs,
        extreme: cascade.cr4de_quanti_cp.considerable.extreme.abs,
      },
    });
    cause.cascades.push({
      cause,
      causeScenario: "major",
      effect,
      probabilities: {
        considerable: cascade.cr4de_quanti_cp.major.considerable.abs,
        major: cascade.cr4de_quanti_cp.major.major.abs,
        extreme: cascade.cr4de_quanti_cp.major.extreme.abs,
      },
    });
    cause.cascades.push({
      cause,
      causeScenario: "extreme",
      effect,
      probabilities: {
        considerable: cascade.cr4de_quanti_cp.extreme.considerable.abs,
        major: cascade.cr4de_quanti_cp.extreme.major.abs,
        extreme: cascade.cr4de_quanti_cp.extreme.extreme.abs,
      },
    });
  }

  return input;
}
