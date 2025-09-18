import { describe, test, expect } from "vitest";
import {
  diScale5FromEuros,
  diScale5to7,
  diScale7to5,
  eurosFromDIScale5,
  eurosFromIScale7,
  eurosFromTIScale5,
  iScale7FromEuros,
  tiScale5FromEuros,
  tiScale5to7,
  tiScale7to5,
} from "./impact";

describe("I7-Scale Conversion Functions", () => {
  describe("eurosFromIScale7", () => {
    test("should return correct values for typical I-Scale inputs", () => {
      expect(eurosFromIScale7(0)).toBeCloseTo(0);
      expect(eurosFromIScale7(0.5) / 500000).toBeCloseTo(1, 0);
      expect(eurosFromIScale7(1.5) / 5000000).toBeCloseTo(1, 0);
      expect(eurosFromIScale7(2.5) / 25000000).toBeCloseTo(1, 0);
      expect(eurosFromIScale7(3.5) / 200000000).toBeCloseTo(1, 0);
      expect(eurosFromIScale7(4.5) / 1000000000).toBeCloseTo(1, 0);
      expect(eurosFromIScale7(5.5) / 7500000000).toBeCloseTo(1, 0);
      expect(eurosFromIScale7(6.5) / 50000000000).toBeCloseTo(1, 0);
      expect(eurosFromIScale7(7.5) / 500000000000).toBeCloseTo(1, 0);
    });

    test("aggregation", () => {
      expect(eurosFromIScale7(2.5, 2)).toBeCloseTo(2 * eurosFromIScale7(2.5));
    });
  });

  describe("iScale7FromEuros", () => {
    test("should return correct values for typical I-Scale outputs", () => {
      expect(iScale7FromEuros(0)).toBeCloseTo(0, 3);
      expect(iScale7FromEuros(500000)).toBeCloseTo(0.5, 0);
      expect(iScale7FromEuros(5000000)).toBeCloseTo(1.5, 0);
      expect(iScale7FromEuros(25000000)).toBeCloseTo(2.5, 0);
      expect(iScale7FromEuros(200000000)).toBeCloseTo(3.5, 0);
      expect(iScale7FromEuros(1000000000)).toBeCloseTo(4.5, 0);
      expect(iScale7FromEuros(7500000000)).toBeCloseTo(5.5, 0);
      expect(iScale7FromEuros(50000000000)).toBeCloseTo(6.5, 0);
      expect(iScale7FromEuros(500000000000)).toBeCloseTo(7.5, 0);
    });

    test("aggregation", () => {
      expect(iScale7FromEuros(2 * eurosFromIScale7(2.5), 2)).toBeCloseTo(
        iScale7FromEuros(eurosFromIScale7(2.5))
      );
    });
  });

  describe("iScale7 sanity checks", () => {
    test("round trips should return identity", () => {
      expect(iScale7FromEuros(eurosFromIScale7(0))).toBeCloseTo(0);
      expect(iScale7FromEuros(eurosFromIScale7(0.4))).toBeCloseTo(0.4);
      expect(iScale7FromEuros(eurosFromIScale7(1))).toBeCloseTo(1);
      expect(iScale7FromEuros(eurosFromIScale7(4, 6), 6)).toBeCloseTo(4);
      expect(iScale7FromEuros(eurosFromIScale7(2.5))).toBeCloseTo(2.5);
      expect(iScale7FromEuros(eurosFromIScale7(6.33))).toBeCloseTo(6.33);
      expect(iScale7FromEuros(eurosFromIScale7(7.3))).toBeCloseTo(7.3);
      expect(iScale7FromEuros(eurosFromIScale7(5.4, 2), 2)).toBeCloseTo(5.4);
    });
  });
});

describe("TI5-Scale Conversion Functions", () => {
  describe("tiScale5 sanity checks", () => {
    test("round trips should return identity", () => {
      expect(tiScale5FromEuros(eurosFromTIScale5(0))).toBeCloseTo(0);
      expect(tiScale5FromEuros(eurosFromTIScale5(0.4))).toBeCloseTo(0.4);
      expect(tiScale5FromEuros(eurosFromTIScale5(1))).toBeCloseTo(1);
      expect(tiScale5FromEuros(eurosFromTIScale5(2.5))).toBeCloseTo(2.5);
      expect(tiScale5FromEuros(eurosFromTIScale5(6.33))).toBeCloseTo(6.33);
      expect(tiScale5FromEuros(eurosFromTIScale5(7.3))).toBeCloseTo(7.3);
    });
  });
});

describe("DI5-Scale Conversion Functions", () => {
  describe("eurosFromDIScale5", () => {
    test("should return correct values for typical DI-Scale inputs", () => {
      expect(eurosFromDIScale5(0)).toBeCloseTo(0);
      expect(eurosFromDIScale5(0.5) / 5000000).toBeCloseTo(1, 1);
      expect(eurosFromDIScale5(1.5) / 50000000).toBeCloseTo(1, 1);
      expect(eurosFromDIScale5(2.5) / 500000000).toBeCloseTo(1, 1);
      expect(eurosFromDIScale5(3.5) / 5000000000).toBeCloseTo(1, 1);
      expect(eurosFromDIScale5(4.5) / 50000000000).toBeCloseTo(1, 1);
      expect(eurosFromDIScale5(5.5) / 500000000000).toBeCloseTo(1, 1);
    });
  });

  describe("diScale5FromEuros", () => {
    test("should return correct values for typical DI-Scale outputs", () => {
      expect(diScale5FromEuros(0)).toBeCloseTo(0);
      expect(diScale5FromEuros(5000000)).toBeCloseTo(0.5, 0);
      expect(diScale5FromEuros(50000000)).toBeCloseTo(1.5, 0);
      expect(diScale5FromEuros(500000000)).toBeCloseTo(2.5, 0);
      expect(diScale5FromEuros(5000000000)).toBeCloseTo(3.5, 0);
      expect(diScale5FromEuros(50000000000)).toBeCloseTo(4.5, 0);
      expect(diScale5FromEuros(500000000000)).toBeCloseTo(5.5, 0);
    });
  });

  describe("diScale5 sanity checks", () => {
    test("round trips should return identity", () => {
      expect(diScale5FromEuros(eurosFromDIScale5(0))).toBeCloseTo(0);
      expect(diScale5FromEuros(eurosFromDIScale5(0.4))).toBeCloseTo(0.4);
      expect(diScale5FromEuros(eurosFromDIScale5(1))).toBeCloseTo(1);
      expect(diScale5FromEuros(eurosFromDIScale5(2.5))).toBeCloseTo(2.5);
      expect(diScale5FromEuros(eurosFromDIScale5(6.33))).toBeCloseTo(6.33);
      expect(diScale5FromEuros(eurosFromDIScale5(7.3))).toBeCloseTo(7.3);
    });
  });
});

describe("5 <-> 7 Conversion Functions", () => {
  test("round trips should return identity", () => {
    expect(tiScale5to7(tiScale7to5(2.5))).toBeCloseTo(2.5);
    expect(diScale5to7(diScale7to5(2.5))).toBeCloseTo(2.5);
  });
});
