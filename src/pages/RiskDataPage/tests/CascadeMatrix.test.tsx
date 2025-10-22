import { fireEvent, screen, within } from "@testing-library/react";
import { vi } from "vitest";
import { RISK_TYPE } from "../../../types/dataverse/Riskfile";
import { SCENARIOS } from "../../../functions/scenarios";
import CascadeMatrix from "../CascadeMatrix";
import { DVRiskSnapshot } from "../../../types/dataverse/DVRiskSnapshot";
import { DVCascadeSnapshot } from "../../../types/dataverse/DVCascadeSnapshot";
import { QueryClient } from "@tanstack/react-query";
import { renderWithContext } from "../../../test/test-utils";
import { pAbsFromCPScale7 } from "../../../functions/indicators/cp";

describe("CascadeMatrix", () => {
  const baseRisk = {
    cr4de_risk_type: RISK_TYPE.STANDARD,
    cr4de_title: "Base Risk",
    cr4de_scenarios: JSON.stringify({
      considerable: [],
      major: [],
      extreme: [],
    }),
  } as DVRiskSnapshot;
  const actorRisk = {
    cr4de_risk_type: RISK_TYPE.MANMADE,
    cr4de_title: "Actor Risk",
    cr4de_scenarios: JSON.stringify({
      considerable: [],
      major: [],
      extreme: [],
    }),
  } as DVRiskSnapshot;

  const baseCascade = {
    cr4de_quanti_cp: {
      [SCENARIOS.CONSIDERABLE]: {
        [SCENARIOS.CONSIDERABLE]: { abs: 0.1 },
        [SCENARIOS.MAJOR]: { abs: 0.2 },
        [SCENARIOS.EXTREME]: { abs: 0.3 },
      },
      [SCENARIOS.MAJOR]: {
        [SCENARIOS.CONSIDERABLE]: { abs: 0.4 },
        [SCENARIOS.MAJOR]: { abs: 0.5 },
        [SCENARIOS.EXTREME]: { abs: 0.6 },
      },
      [SCENARIOS.EXTREME]: {
        [SCENARIOS.CONSIDERABLE]: { abs: 0.7 },
        [SCENARIOS.MAJOR]: { abs: 0.8 },
        [SCENARIOS.EXTREME]: { abs: 0.9 },
      },
    },
  } as DVCascadeSnapshot;

  const renderMatrix = (props = {}) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    renderWithContext(
      <CascadeMatrix
        cause={"cause" in props ? (props.cause as DVRiskSnapshot) : baseRisk}
        effect={baseRisk}
        cascade={baseCascade}
        onChange={vi.fn()}
        {...props}
      />,
      {
        outletContext: {
          user: null,
        },
        client: queryClient,
      }
    );
  };

  test("renders cause and effect headers", () => {
    renderMatrix({ cause: baseRisk });

    expect(screen.getByText(/Cause/i)).toBeInTheDocument();
    expect(screen.getByText(/Effect/i)).toBeInTheDocument();
    expect(screen.queryByText(/Actor/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Attack/i)).not.toBeInTheDocument();
  });

  test("renders actor and attack headers", () => {
    renderMatrix({ cause: actorRisk });

    // Also check for “Actor” and “Attack” labels in the headers
    expect(screen.getByText(/Actor/i)).toBeInTheDocument();
    expect(screen.getByText(/Attack/i)).toBeInTheDocument();
    expect(screen.queryByText(/Cause/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Effect/i)).not.toBeInTheDocument();
  });

  test("renders all scenario boxes", () => {
    renderMatrix();

    // There should be 3 scenario boxes per axis (rows + columns)
    const scenarioBoxes = screen.getAllByText(/Considerable|Major|Extreme/i);
    expect(scenarioBoxes.length).toBeGreaterThanOrEqual(6);
  });

  test("renders CPX grid cells correctly", () => {
    renderMatrix();

    // Each CPX cell renders a text like “CP1”, “CP2”, etc. depending on values
    // Expect 9 total cells (3x3 grid)
    const cpLabels = screen.getAllByText(/CP/i);
    expect(cpLabels.length).toBe(9);
  });

  test("toggles scenario description table on expand", async () => {
    renderMatrix();

    const expandButton = screen.getByRole("button", {
      name: /Show scenarios/i,
    });
    expect(expandButton).toBeInTheDocument();

    // Initially table rows are hidden
    expect(screen.queryAllByText("Considerable Scenario").length).toBe(0);

    fireEvent.click(expandButton);
    expect(await screen.queryAllByText("Considerable Scenario").length).toBe(2);

    fireEvent.click(expandButton);
    expect(screen.queryAllByText("Considerable Scenario").length).toBe(0);
  });

  test("renders CP values with correct prefix", () => {
    renderMatrix();

    // CP labels should include prefix (e.g. “CP0.1”)
    expect(screen.queryAllByText(/CP(\s*)\d+/i).length).toBe(9);
  });

  test("renders M values with correct prefix", () => {
    renderMatrix({ cause: actorRisk });

    // CP labels should include prefix (e.g. “CP0.1”)
    expect(screen.queryAllByText(/M(\s*)\d+/i).length).toBe(9);
  });

  test("shows tooltips with interval explanation", async () => {
    renderMatrix();

    const firstCell = screen.getAllByText(/CP(\s*)\d/i)[0];
    fireEvent.mouseOver(firstCell);

    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toBeInTheDocument();
    expect(
      within(tooltip).getByText(/This estimation represents/i)
    ).toBeInTheDocument();
  });

  test("opens menu when editable and clicked", async () => {
    renderMatrix();

    const firstCell = screen.getAllByText(/CP(\s*)\d/i)[0];
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    fireEvent.click(firstCell);

    const menu = await screen.findByRole("menu");
    expect(menu).toBeInTheDocument();
  });

  test("calls onChange when CPX value is changed", async () => {
    const handleChange = vi.fn();
    renderMatrix({ onChange: handleChange });

    const firstCell = screen.getAllByText(/CP(\s*)\d/i)[0];
    fireEvent.click(firstCell);

    const menuItems = await screen.findAllByRole("menuitem");

    expect(menuItems.length).toBeGreaterThan(9);

    // click the first or the one with text 1.5, whichever you want
    const targetItem =
      menuItems.find((el) => el.textContent?.match(/1\.5/)) ?? menuItems[0];
    fireEvent.click(targetItem);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenLastCalledWith(
      SCENARIOS.CONSIDERABLE,
      SCENARIOS.CONSIDERABLE,
      pAbsFromCPScale7(1.5)
    );
  });

  test("shows comparisons value when compareCPAbs is different", () => {
    const compareCascade = JSON.parse(JSON.stringify(baseCascade));
    compareCascade.cr4de_quanti_cp[SCENARIOS.CONSIDERABLE][
      SCENARIOS.CONSIDERABLE
    ].abs = pAbsFromCPScale7(7.5);

    renderMatrix({
      compareCascade: compareCascade,
    });

    expect(screen.getByText(/original:(\s*)CP7\.5/i)).toBeInTheDocument();
  });
});
