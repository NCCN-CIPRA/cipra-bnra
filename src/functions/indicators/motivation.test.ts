import { describe, test, expect } from "vitest";
import {
  pDailyFromMScale3,
  pDailyFromMScale7,
  mScale3FromPDaily,
  mScale7FromPDaily,
  mScale3to7,
  mScale7to3,
  pDailyFromP3years,
} from "./motivation"; // Adjust import path as needed

describe("Motivation Scale Conversion Functions", () => {
  describe("pDailyFromMScale3", () => {
    test("should return correct values for integer M-Scale 3 inputs", () => {
      expect(pDailyFromMScale3(0.5)).toBeCloseTo(pDailyFromP3years(0.01));
      expect(pDailyFromMScale3(1.5)).toBeCloseTo(pDailyFromP3years(0.5));
      expect(pDailyFromMScale3(2.5)).toBeCloseTo(pDailyFromP3years(0.9));
      expect(pDailyFromMScale3(3.5)).toBeCloseTo(pDailyFromP3years(1));
    });

    test("should return correct values for any M-Scale 3 inputs", () => {
      expect(pDailyFromMScale3(0)).toBeCloseTo(pDailyFromP3years(0));
      expect(pDailyFromMScale3(1)).toBeCloseTo(pDailyFromP3years(25.5 / 100));
      expect(pDailyFromMScale3(2)).toBeCloseTo(pDailyFromP3years(70 / 100));
      expect(pDailyFromMScale3(3)).toBeCloseTo(pDailyFromP3years(95 / 100));
    });
  });

  describe(" mScale3FromPDaily", () => {
    test("should return correct values for integer M-Scale 3 outputs", () => {
      expect(mScale3FromPDaily(pDailyFromP3years(0))).toBeCloseTo(0, 3);
      expect(mScale3FromPDaily(pDailyFromP3years(0.01))).toBeCloseTo(0.5, 3);
      expect(mScale3FromPDaily(pDailyFromP3years(0.5))).toBeCloseTo(1.5, 3);
      expect(mScale3FromPDaily(pDailyFromP3years(0.9))).toBeCloseTo(2.5, 3);
      expect(mScale3FromPDaily(pDailyFromP3years(1))).toBeCloseTo(3.5, 3);
    });

    test("should return correct values for any M-Scale 3 outputs", () => {
      expect(mScale3FromPDaily(pDailyFromP3years(0.5 / 100))).toBeCloseTo(0.25);
      expect(mScale3FromPDaily(pDailyFromP3years(25.5 / 100))).toBeCloseTo(1);
      expect(mScale3FromPDaily(pDailyFromP3years(70 / 100))).toBeCloseTo(2);
      expect(mScale3FromPDaily(pDailyFromP3years(95 / 100))).toBeCloseTo(3);
    });

    test("other inputs", () => {
      expect(pDailyFromMScale7(1)).toBeCloseTo(pDailyFromP3years(0.05005), 5);
      expect(mScale3FromPDaily(pDailyFromP3years(0.05005))).toBeCloseTo(
        0.581734694,
        5
      );
      expect(pDailyFromMScale3(0.581734694)).toBeCloseTo(
        pDailyFromP3years(0.05005),
        5
      );
    });
  });

  describe(" pDailyFromMScale7", () => {
    test("should return correct values for integer M-Scale 7 inputs", () => {
      expect(pDailyFromMScale7(0.5)).toBeCloseTo(pDailyFromP3years(0.01 / 100)); // midpoint between 0 and 0.0001
      expect(pDailyFromMScale7(1.5)).toBeCloseTo(pDailyFromP3years(0.1)); // midpoint between 0.0001 and 0.1
      expect(pDailyFromMScale7(2.5)).toBeCloseTo(pDailyFromP3years(0.25)); // midpoint between 0.1 and 0.25
      expect(pDailyFromMScale7(3.5)).toBeCloseTo(pDailyFromP3years(0.4)); // midpoint between 0.25 and 0.4
      expect(pDailyFromMScale7(4.5)).toBeCloseTo(pDailyFromP3years(0.55)); // midpoint between 0.4 and 0.55
      expect(pDailyFromMScale7(5.5)).toBeCloseTo(pDailyFromP3years(0.75)); // midpoint between 0.55 and 0.75
      expect(pDailyFromMScale7(6.5)).toBeCloseTo(pDailyFromP3years(0.9)); // midpoint between 0.75 and 0.9
      expect(pDailyFromMScale7(7.5)).toBeCloseTo(pDailyFromP3years(1)); // midpoint between 0.9 and 1.0
    });

    test("should handle decimal M-Scale 7 inputs", () => {
      // Test 0.5 values (should return upper bounds)
      expect(pDailyFromMScale7(0)).toBeCloseTo(pDailyFromP3years(0.005 / 100)); // upper bound of first interval
      expect(pDailyFromMScale7(1)).toBeCloseTo(
        pDailyFromP3years((10 - 0.1) / 2 / 100)
      ); // upper bound of second interval
      expect(pDailyFromMScale7(2)).toBeCloseTo(pDailyFromP3years(0.175)); // upper bound of third interval
      expect(pDailyFromMScale7(3)).toBeCloseTo(pDailyFromP3years(0.325)); // upper bound of third interval
      expect(pDailyFromMScale7(4)).toBeCloseTo(pDailyFromP3years(0.475)); // upper bound of third interval
      expect(pDailyFromMScale7(5)).toBeCloseTo(pDailyFromP3years(0.65)); // upper bound of third interval
      expect(pDailyFromMScale7(6)).toBeCloseTo(pDailyFromP3years(0.825)); // upper bound of third interval
      expect(pDailyFromMScale7(7)).toBeCloseTo(pDailyFromP3years(0.95)); // upper bound of third interval
    });
  });

  describe(" mScale7FromPDaily", () => {
    test("should return correct values for integer M-Scale 7 outputs", () => {
      expect(mScale7FromPDaily(pDailyFromP3years(0.01 / 100))).toBeCloseTo(0.5);
      expect(mScale7FromPDaily(pDailyFromP3years(0.1))).toBeCloseTo(1.5);
      expect(mScale7FromPDaily(pDailyFromP3years(0.25))).toBeCloseTo(2.5);
      expect(mScale7FromPDaily(pDailyFromP3years(0.4))).toBeCloseTo(3.5);
      expect(mScale7FromPDaily(pDailyFromP3years(0.55))).toBeCloseTo(4.5);
      expect(mScale7FromPDaily(pDailyFromP3years(0.75))).toBeCloseTo(5.5);
      expect(mScale7FromPDaily(pDailyFromP3years(0.9))).toBeCloseTo(6.5);
      expect(mScale7FromPDaily(pDailyFromP3years(1))).toBeCloseTo(7.5);
    });

    test("should return correct values for any M-Scale 7 outputs", () => {
      expect(mScale7FromPDaily(pDailyFromP3years(0.005 / 100))).toBeCloseTo(
        0.25
      );
      expect(
        mScale7FromPDaily(pDailyFromP3years((10 - 0.1) / 2 / 100))
      ).toBeCloseTo(1, 1);
      expect(mScale7FromPDaily(pDailyFromP3years(0.175))).toBeCloseTo(2);
      expect(mScale7FromPDaily(pDailyFromP3years(0.325))).toBeCloseTo(3);
      expect(mScale7FromPDaily(pDailyFromP3years(0.475))).toBeCloseTo(4);
      expect(mScale7FromPDaily(pDailyFromP3years(0.65))).toBeCloseTo(5);
      expect(mScale7FromPDaily(pDailyFromP3years(0.8251))).toBeCloseTo(6);
      expect(mScale7FromPDaily(pDailyFromP3years(0.95))).toBeCloseTo(7);
    });

    test("other inputs", () => {
      expect(mScale7FromPDaily(pDailyFromMScale3(0))).toBeCloseTo(0, 5);
      expect(mScale3FromPDaily(pDailyFromMScale7(0))).toBeCloseTo(0, 5);
    });
  });

  describe("Round-trip conversions", () => {
    test("3 -> 7 -> 3 should be identity", () => {
      const testValues = [0, 1, 2, 3, 2.5, 1.43];
      testValues.forEach((mScale3) => {
        expect(mScale7to3(mScale3to7(mScale3))).toBeCloseTo(mScale3, 3);
      });
    });
    test("7 -> 3 -> 7 should be identity", () => {
      const testValues = [0, 1, 2, 3, 4, 5, 6, 2.5, 1.2, 0.8, 3.33];
      testValues.forEach((mScale7) => {
        expect(mScale3to7(mScale7to3(mScale7))).toBeCloseTo(mScale7, 3);
      });
    });
  });
});
