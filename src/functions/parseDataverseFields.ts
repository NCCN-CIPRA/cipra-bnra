import {
  ParsedRiskFields,
  UnparsedRiskFields,
} from "../types/dataverse/Riskfile";
import { unwrap as unwrap_he } from "./historicalEvents";
import { unwrap as unwrap_ip } from "./intensityParameters";
import { unwrap as unwrap_s } from "./scenarios";

export function parseRiskFields(e: UnparsedRiskFields): ParsedRiskFields {
  const parameters = e.cr4de_intensity_parameters
    ? unwrap_ip(e.cr4de_intensity_parameters)
    : null;

  return {
    ...e,
    cr4de_historical_events: unwrap_he(e.cr4de_historical_events),
    cr4de_intensity_parameters: parameters,
    cr4de_scenarios:
      parameters &&
      e.cr4de_scenario_considerable &&
      e.cr4de_scenario_major &&
      e.cr4de_scenario_extreme
        ? unwrap_s(
            parameters,
            e.cr4de_scenario_considerable,
            e.cr4de_scenario_major,
            e.cr4de_scenario_extreme
          )
        : null,
  };
}
