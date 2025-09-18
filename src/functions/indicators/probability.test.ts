import { describe, test, expect } from "vitest";
import {
  returnPeriodMonthsFromPScale5,
  returnPeriodMonthsFromPScale7,
  pScale5FromReturnPeriodMonths,
  pScale7FromReturnPeriodMonths,
  pScale5to7,
} from "./probability"; // Adjust import path as needed

describe("P5-Scale Conversion Functions", () => {
  describe("returnPeriodMonthsFromPScale5", () => {
    test("should return correct values for typical P-Scale 5 inputs", () => {
      expect(returnPeriodMonthsFromPScale5(1.5)).toBeCloseTo(3000 * 12);
      expect(returnPeriodMonthsFromPScale5(2.5)).toBeCloseTo(300 * 12);
      expect(returnPeriodMonthsFromPScale5(3.5)).toBeCloseTo(30 * 12);
      expect(returnPeriodMonthsFromPScale5(4.5)).toBeCloseTo(3 * 12);
    });
  });

  describe("pScale5FromReturnPeriodMonths", () => {
    test("should return correct P-Scale 5 values for typical return periods", () => {
      expect(pScale5FromReturnPeriodMonths(3000 * 12)).toBeCloseTo(1.5);
      expect(pScale5FromReturnPeriodMonths(300 * 12)).toBeCloseTo(2.5);
      expect(pScale5FromReturnPeriodMonths(30 * 12)).toBeCloseTo(3.5);
      expect(pScale5FromReturnPeriodMonths(3 * 12)).toBeCloseTo(4.5);
    });
  });

  describe("Double conversion", () => {
    test("should return the same values after double conversion", () => {
      expect(
        returnPeriodMonthsFromPScale5(pScale5FromReturnPeriodMonths(3000))
      ).toBeCloseTo(3000, 2);
      expect(
        returnPeriodMonthsFromPScale5(pScale5FromReturnPeriodMonths(300))
      ).toBeCloseTo(300, 2);
      expect(
        returnPeriodMonthsFromPScale5(pScale5FromReturnPeriodMonths(1000))
      ).toBeCloseTo(1000, 2);

      expect(
        pScale5FromReturnPeriodMonths(returnPeriodMonthsFromPScale5(1))
      ).toBeCloseTo(1, 2);
      expect(
        pScale5FromReturnPeriodMonths(returnPeriodMonthsFromPScale5(2.5))
      ).toBeCloseTo(2.5, 2);
      expect(
        pScale5FromReturnPeriodMonths(returnPeriodMonthsFromPScale5(3.2))
      ).toBeCloseTo(3.2, 2);
    });
  });
});

describe("P7-Scale Conversion Functions", () => {
  describe("returnPeriodMonthsFromPScale7", () => {
    test("should return correct values for typical P-Scale 7 inputs", () => {
      expect(returnPeriodMonthsFromPScale7(1.5) / (5000 * 12)).toBeCloseTo(
        1,
        1
      );
      expect(returnPeriodMonthsFromPScale7(2.5) / (500 * 12)).toBeCloseTo(1, 1);
      expect(returnPeriodMonthsFromPScale7(3.5) / (50 * 12)).toBeCloseTo(1, 1);
      expect(returnPeriodMonthsFromPScale7(4.5) / (5 * 12)).toBeCloseTo(1, 1);
      expect(returnPeriodMonthsFromPScale7(5.5) / 6).toBeCloseTo(1, 1);
      expect(returnPeriodMonthsFromPScale7(6.5) / 1).toBeCloseTo(1, 0);
    });
  });

  describe("pScale7FromReturnPeriodMonths", () => {
    test("should return correct P-Scale 7 values for typical return periods", () => {
      expect(pScale7FromReturnPeriodMonths(5000 * 12)).toBeCloseTo(1.5, 1);
      expect(pScale7FromReturnPeriodMonths(500 * 12)).toBeCloseTo(2.5, 1);
      expect(pScale7FromReturnPeriodMonths(50 * 12)).toBeCloseTo(3.5, 1);
      expect(pScale7FromReturnPeriodMonths(5 * 12)).toBeCloseTo(4.5, 1);
      expect(pScale7FromReturnPeriodMonths(6)).toBeCloseTo(5.5, 1);
      expect(pScale7FromReturnPeriodMonths(1)).toBeCloseTo(6.5, 0);
    });
  });

  describe("Double conversion", () => {
    test("should return the same values after double conversion", () => {
      expect(
        returnPeriodMonthsFromPScale7(pScale7FromReturnPeriodMonths(3000))
      ).toBeCloseTo(3000, 2);
      expect(
        returnPeriodMonthsFromPScale7(pScale7FromReturnPeriodMonths(300))
      ).toBeCloseTo(300, 2);
      expect(
        returnPeriodMonthsFromPScale7(pScale7FromReturnPeriodMonths(1000))
      ).toBeCloseTo(1000, 2);

      expect(
        pScale7FromReturnPeriodMonths(returnPeriodMonthsFromPScale7(1))
      ).toBeCloseTo(1, 2);
      expect(
        pScale7FromReturnPeriodMonths(returnPeriodMonthsFromPScale7(2.5))
      ).toBeCloseTo(2.5, 2);
      expect(
        pScale7FromReturnPeriodMonths(returnPeriodMonthsFromPScale7(3.2))
      ).toBeCloseTo(3.2, 2);
    });
  });
});

describe("Scale Conversion Functions", () => {
  describe("Round-trip conversions", () => {
    test("P-Scale 5 -> return period -> P-Scale 5 should be identity", () => {
      const testValues = [0, 1, 2, 3, 4, 2.5, -1];
      testValues.forEach((pScale5) => {
        const rpMonths = returnPeriodMonthsFromPScale5(pScale5);
        const backToPScale5 = pScale5FromReturnPeriodMonths(rpMonths);
        expect(backToPScale5).toBeCloseTo(pScale5, 3);
      });
    });

    test("P-Scale 7 -> return period -> P-Scale 7 should be identity", () => {
      const testValues = [0, 1, 2, 3, 4, 2.5, -1];
      testValues.forEach((pScale7) => {
        const rpMonths = returnPeriodMonthsFromPScale7(pScale7);
        const backToPScale7 = pScale7FromReturnPeriodMonths(rpMonths);
        expect(backToPScale7).toBeCloseTo(pScale7, 3);
      });
    });

    test("return period -> P-Scale 5 -> return period should be identity", () => {
      const testValues = [1, 10, 100, 1000, 10000, 100000];
      testValues.forEach((rpMonths) => {
        const pScale5 = pScale5FromReturnPeriodMonths(rpMonths);
        const backToRp = returnPeriodMonthsFromPScale5(pScale5);
        expect(backToRp).toBeCloseTo(rpMonths, 3);
      });
    });

    test("return period -> P-Scale 7 -> return period should be identity", () => {
      const testValues = [1, 10, 100, 1000, 10000, 100000];
      testValues.forEach((rpMonths) => {
        const pScale7 = pScale7FromReturnPeriodMonths(rpMonths);
        const backToRp = returnPeriodMonthsFromPScale7(pScale7);
        expect(backToRp).toBeCloseTo(rpMonths, 3);
      });
    });
  });
});

describe("Mathematical properties", () => {
  test("P-Scale 5 functions should be monotonic", () => {
    // returnPeriodMonthsFromPScale5 should be decreasing
    expect(returnPeriodMonthsFromPScale5(1)).toBeGreaterThan(
      returnPeriodMonthsFromPScale5(2)
    );
    expect(returnPeriodMonthsFromPScale5(2)).toBeGreaterThan(
      returnPeriodMonthsFromPScale5(3)
    );

    // pScale5FromReturnPeriodMonths should be decreasing
    expect(pScale5FromReturnPeriodMonths(100)).toBeGreaterThan(
      pScale5FromReturnPeriodMonths(1000)
    );
    expect(pScale5FromReturnPeriodMonths(1000)).toBeGreaterThan(
      pScale5FromReturnPeriodMonths(10000)
    );
  });

  test("P-Scale 7 functions should be monotonic", () => {
    // returnPeriodMonthsFromPScale7 should be decreasing
    expect(returnPeriodMonthsFromPScale7(1)).toBeGreaterThan(
      returnPeriodMonthsFromPScale7(2)
    );
    expect(returnPeriodMonthsFromPScale7(2)).toBeGreaterThan(
      returnPeriodMonthsFromPScale7(3)
    );

    // pScale7FromReturnPeriodMonths should be decreasing
    expect(pScale7FromReturnPeriodMonths(100)).toBeGreaterThan(
      pScale7FromReturnPeriodMonths(1000)
    );
    expect(pScale7FromReturnPeriodMonths(1000)).toBeGreaterThan(
      pScale7FromReturnPeriodMonths(10000)
    );
  });

  test("conversion functions should preserve ordering", () => {
    const pScale5Values = [0, 1, 2, 3, 4];
    const pScale7Values = pScale5Values.map(pScale5to7);

    // P-Scale 7 values should be in increasing order (same as P-Scale 5)
    for (let i = 0; i < pScale7Values.length - 1; i++) {
      expect(pScale7Values[i]).toBeLessThan(pScale7Values[i + 1]);
    }
  });
});
