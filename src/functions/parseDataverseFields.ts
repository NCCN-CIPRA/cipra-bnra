import {
  ParsedRiskFields,
  UnparsedRiskFields,
} from "../types/dataverse/Riskfile";
import { unwrap as unwrap_he, wrap as wrap_he } from "./historicalEvents";
import { unwrap as unwrap_ip, wrap as wrap_ip } from "./intensityParameters";
import { unwrap as unwrap_s, wrap as wrap_s } from "./scenarios";

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

export function stringifyRiskFields(e: ParsedRiskFields): UnparsedRiskFields {
  return {
    ...e,
    cr4de_historical_events: e.cr4de_historical_events
      ? wrap_he(e.cr4de_historical_events)
      : null,
    cr4de_intensity_parameters: e.cr4de_intensity_parameters
      ? wrap_ip(e.cr4de_intensity_parameters)
      : null,
    cr4de_scenario_considerable: e.cr4de_scenarios?.considerable
      ? wrap_s(e.cr4de_scenarios?.considerable)
      : null,
    cr4de_scenario_major: e.cr4de_scenarios?.major
      ? wrap_s(e.cr4de_scenarios?.major)
      : null,
    cr4de_scenario_extreme: e.cr4de_scenarios?.extreme
      ? wrap_s(e.cr4de_scenarios?.extreme)
      : null,
  };
}
