import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import {
  noImpact,
  Risk,
  RiskCascade,
  Scenario,
  SimulationInput,
} from "../../types/simulation";
import { pDailyFromReturnPeriodMonths } from "../indicators/probability";
import { DVCascadeSnapshot } from "../../types/dataverse/DVCascadeSnapshot";
import { RISK_TYPE } from "../../types/dataverse/Riskfile";
import { pDailyFromMScale7 } from "../indicators/motivation";

export function prepareData(
  risks: DVRiskSnapshot[],
  cascades: DVCascadeSnapshot[],
): SimulationInput {
  const standardRisks = risks.filter(
    (r) => r.cr4de_risk_type === RISK_TYPE.STANDARD,
  );
  const actorRisks = risks.filter(
    (r) => r.cr4de_risk_type === RISK_TYPE.MANMADE,
  );

  const input: SimulationInput = {
    riskCatalogue: [],
    cascadeCatalogue: {},
    options: {
      filterRiskFileIds: undefined,
      filterScenarios: undefined,
      numEvents: 0,
      numYears: 0,
      relStd: 0,
    },
  };

  const standardCatalogue: Record<string, Risk> = standardRisks.reduce(
    (acc, risk) => ({
      ...acc,
      [risk._cr4de_risk_file_value]: {
        id: risk._cr4de_risk_file_value,
        hazardId: risk.cr4de_hazard_id,
        name: risk.cr4de_title,
        category: risk.cr4de_category,
        actor: false,
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
      } as Risk,
    }),
    {},
  );
  const actorCatalogue: Record<string, Risk> = actorRisks.reduce(
    (acc, risk) => {
      const actor: Risk = {
        id: risk._cr4de_risk_file_value,
        hazardId: risk.cr4de_hazard_id,
        name: risk.cr4de_title,
        category: risk.cr4de_category,
        actor: true,
        directImpact: {
          considerable: { ...noImpact },
          major: { ...noImpact },
          extreme: { ...noImpact },
        },
      };

      return {
        ...acc,
        [risk._cr4de_risk_file_value]: actor,
      };
    },
    {},
  );

  const riskCatalogue: Record<string, Risk> = {
    ...standardCatalogue,
    ...actorCatalogue,
  };
  const allCascades: RiskCascade[] = [];

  for (const risk of standardRisks) {
    // if (isMaliciousAction(risk._cr4de_risk_file_value)) {
    // Direct probability of attack scenarios was given as M values, but save as DP values. Therefore a correction is needed
    //   allCascades.push({
    //     cause: null,
    //     causeScenario: null,
    //     effect: riskCatalogue[risk._cr4de_risk_file_value],
    //     probabilities: {
    //       considerable: pDailyFromMScale7(
    //         pScale7FromReturnPeriodMonths(
    //           risk.cr4de_quanti.considerable.dp.rpMonths,
    //         ),
    //       ),
    //       major: pDailyFromMScale7(
    //         pScale7FromReturnPeriodMonths(risk.cr4de_quanti.major.dp.rpMonths),
    //       ),
    //       extreme: pDailyFromMScale7(
    //         pScale7FromReturnPeriodMonths(
    //           risk.cr4de_quanti.extreme.dp.rpMonths,
    //         ),
    //       ),
    //     },
    //   });
    // } else {
    allCascades.push({
      cause: null,
      causeScenario: null,
      effect: riskCatalogue[risk._cr4de_risk_file_value],
      probabilities: {
        considerable: pDailyFromReturnPeriodMonths(
          risk.cr4de_quanti.considerable.dp.rpMonths,
        ),
        major: pDailyFromReturnPeriodMonths(
          risk.cr4de_quanti.major.dp.rpMonths,
        ),
        extreme: pDailyFromReturnPeriodMonths(
          risk.cr4de_quanti.extreme.dp.rpMonths,
        ),
      },
    });
    // }
  }

  for (const risk of actorRisks) {
    allCascades.push({
      cause: null,
      causeScenario: null,
      effect: riskCatalogue[risk._cr4de_risk_file_value],
      probabilities: {
        considerable: 1,
        major: 1,
        extreme: 1,
      },
    });
  }

  for (const cascade of cascades) {
    const cause = riskCatalogue[cascade._cr4de_cause_risk_value];
    const effect = riskCatalogue[cascade._cr4de_effect_risk_value];

    if (!cause || !effect) {
      // console.error("Coulnd't find cause/effect: ", cascade);
      continue;
    }

    if (cause.actor) {
      // The CP (or M) values for actor -> attack cascades, are given as
      // probabilities for the actor to succesfully execute the given attack
      // in the following 3 years.
      // Thus we need to rescale the cascade probabilities to a daily probability
      const riskCascades = [
        {
          cause,
          causeScenario: "considerable" as Scenario,
          effect,
          probabilities: {
            considerable: pDailyFromMScale7(
              cascade.cr4de_quanti_cp.considerable.considerable.scale7,
            ),
            major: pDailyFromMScale7(
              cascade.cr4de_quanti_cp.considerable.major.scale7,
            ),
            extreme: pDailyFromMScale7(
              cascade.cr4de_quanti_cp.considerable.extreme.scale7,
            ),
          },
        },
        {
          cause,
          causeScenario: "major" as Scenario,
          effect,
          probabilities: {
            considerable: pDailyFromMScale7(
              cascade.cr4de_quanti_cp.major.considerable.scale7,
            ),
            major: pDailyFromMScale7(
              cascade.cr4de_quanti_cp.major.major.scale7,
            ),
            extreme: pDailyFromMScale7(
              cascade.cr4de_quanti_cp.major.extreme.scale7,
            ),
          },
        },
        {
          cause,
          causeScenario: "extreme" as Scenario,
          effect,
          probabilities: {
            considerable: pDailyFromMScale7(
              cascade.cr4de_quanti_cp.extreme.considerable.scale7,
            ),
            major: pDailyFromMScale7(
              cascade.cr4de_quanti_cp.extreme.major.scale7,
            ),
            extreme: pDailyFromMScale7(
              cascade.cr4de_quanti_cp.extreme.extreme.scale7,
            ),
          },
        },
      ];

      allCascades.push(...riskCascades);
    } else {
      const riskCascades = [
        {
          cause,
          causeScenario: "considerable" as Scenario,
          effect,
          probabilities: {
            considerable: cascade.cr4de_quanti_cp.considerable.considerable.abs,
            major: cascade.cr4de_quanti_cp.considerable.major.abs,
            extreme: cascade.cr4de_quanti_cp.considerable.extreme.abs,
          },
        },
        {
          cause,
          causeScenario: "major" as Scenario,
          effect,
          probabilities: {
            considerable: cascade.cr4de_quanti_cp.major.considerable.abs,
            major: cascade.cr4de_quanti_cp.major.major.abs,
            extreme: cascade.cr4de_quanti_cp.major.extreme.abs,
          },
        },
        {
          cause,
          causeScenario: "extreme" as Scenario,
          effect,
          probabilities: {
            considerable: cascade.cr4de_quanti_cp.extreme.considerable.abs,
            major: cascade.cr4de_quanti_cp.extreme.major.abs,
            extreme: cascade.cr4de_quanti_cp.extreme.extreme.abs,
          },
        },
      ];

      allCascades.push(...riskCascades);
    }
  }

  input.riskCatalogue = [...Object.values(riskCatalogue)].flat();
  input.cascadeCatalogue = allCascades.reduce((acc, cascade) => {
    acc[
      `${cascade.cause?.id || null}__${cascade.causeScenario}__${
        cascade.effect.id
      }`
    ] = cascade;
    return acc;
  }, {} as Record<string, RiskCascade>);

  return input;
}
