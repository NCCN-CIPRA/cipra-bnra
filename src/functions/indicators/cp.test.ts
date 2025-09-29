import { describe, test, expect } from "vitest";
import { cpScale5FromPAbs, pAbsFromCPScale5, pAbsFromCPScale7 } from "./cp";

describe("CP Scale Conversion Functions", () => {
  describe("pAbsFromCPScale5", () => {
    test("should return correct values for integer CP-Scale 5 inputs", () => {
      expect(pAbsFromCPScale5(0.5)).toBeCloseTo(0.001);
      expect(pAbsFromCPScale5(1.5)).toBeCloseTo(0.01);
      expect(pAbsFromCPScale5(2.5)).toBeCloseTo(0.1);
      expect(pAbsFromCPScale5(3.5)).toBeCloseTo(0.5);
      expect(pAbsFromCPScale5(4.5)).toBeCloseTo(0.9);
      expect(pAbsFromCPScale5(5.5)).toBeCloseTo(1);
    });

    test("should return correct values for any M-Scale 3 inputs", () => {
      expect(pAbsFromCPScale5(0)).toBeCloseTo(0);
      expect(pAbsFromCPScale5(1)).toBeCloseTo(0.001 + (0.01 - 0.001) / 2);
      expect(pAbsFromCPScale5(2)).toBeCloseTo(0.01 + (0.1 - 0.01) / 2);
      expect(pAbsFromCPScale5(3)).toBeCloseTo(0.1 + (0.5 - 0.1) / 2);
      expect(pAbsFromCPScale5(4)).toBeCloseTo(0.5 + (0.9 - 0.5) / 2);
      expect(pAbsFromCPScale5(5)).toBeCloseTo(0.9 + (1 - 0.9) / 2);
    });
  });

  describe("cpScale5FromPAbs", () => {
    test("should return correct values for integer CP-Scale 5 outputs", () => {
      expect(cpScale5FromPAbs(0)).toBeCloseTo(0, 3);
      expect(cpScale5FromPAbs(0.001)).toBeCloseTo(0.5, 3);
      expect(cpScale5FromPAbs(0.01)).toBeCloseTo(1.5, 3);
      expect(cpScale5FromPAbs(0.1)).toBeCloseTo(2.5, 3);
      expect(cpScale5FromPAbs(0.5)).toBeCloseTo(3.5, 3);
      expect(cpScale5FromPAbs(0.9)).toBeCloseTo(4.5, 3);
      expect(cpScale5FromPAbs(1)).toBeCloseTo(5.5, 3);
    });

    test("should return correct values for any CP-Scale 5 outputs", () => {
      expect(cpScale5FromPAbs(0.001 + (0.01 - 0.001) / 2)).toBeCloseTo(1);
    });

    test("other inputs", () => {
      expect(pAbsFromCPScale7(1)).toBeCloseTo(0.05005, 5);
      expect(cpScale5FromPAbs(0.05005)).toBeCloseTo(1.945, 3);
      expect(pAbsFromCPScale5(1.945)).toBeCloseTo(0.05005, 5);
    });
  });

  // describe("pAbsFromMScale7", () => {
  //   test("should return correct values for integer M-Scale 7 inputs", () => {
  //     expect(pAbsFromMScale7(0.5)).toBeCloseTo(0.01 / 100); // midpoint between 0 and 0.0001
  //     expect(pAbsFromMScale7(1.5)).toBeCloseTo(0.1); // midpoint between 0.0001 and 0.1
  //     expect(pAbsFromMScale7(2.5)).toBeCloseTo(0.25); // midpoint between 0.1 and 0.25
  //     expect(pAbsFromMScale7(3.5)).toBeCloseTo(0.4); // midpoint between 0.25 and 0.4
  //     expect(pAbsFromMScale7(4.5)).toBeCloseTo(0.55); // midpoint between 0.4 and 0.55
  //     expect(pAbsFromMScale7(5.5)).toBeCloseTo(0.75); // midpoint between 0.55 and 0.75
  //     expect(pAbsFromMScale7(6.5)).toBeCloseTo(0.9); // midpoint between 0.75 and 0.9
  //     expect(pAbsFromMScale7(7.5)).toBeCloseTo(1); // midpoint between 0.9 and 1.0
  //   });

  //   test("should handle decimal M-Scale 7 inputs", () => {
  //     // Test 0.5 values (should return upper bounds)
  //     expect(pAbsFromMScale7(0)).toBeCloseTo(0.005 / 100); // upper bound of first interval
  //     expect(pAbsFromMScale7(1)).toBeCloseTo((10 - 0.1) / 2 / 100); // upper bound of second interval
  //     expect(pAbsFromMScale7(2)).toBeCloseTo(0.175); // upper bound of third interval
  //     expect(pAbsFromMScale7(3)).toBeCloseTo(0.325); // upper bound of third interval
  //     expect(pAbsFromMScale7(4)).toBeCloseTo(0.475); // upper bound of third interval
  //     expect(pAbsFromMScale7(5)).toBeCloseTo(0.65); // upper bound of third interval
  //     expect(pAbsFromMScale7(6)).toBeCloseTo(0.825); // upper bound of third interval
  //     expect(pAbsFromMScale7(7)).toBeCloseTo(0.95); // upper bound of third interval
  //   });
  // });

  // describe("mScale7FromPAbs", () => {
  //   test("should return correct values for integer M-Scale 7 outputs", () => {
  //     expect(mScale7FromPAbs(0.01 / 100)).toBeCloseTo(0.5);
  //     expect(mScale7FromPAbs(0.1)).toBeCloseTo(1.5);
  //     expect(mScale7FromPAbs(0.25)).toBeCloseTo(2.5);
  //     expect(mScale7FromPAbs(0.4)).toBeCloseTo(3.5);
  //     expect(mScale7FromPAbs(0.55)).toBeCloseTo(4.5);
  //     expect(mScale7FromPAbs(0.75)).toBeCloseTo(5.5);
  //     expect(mScale7FromPAbs(0.9)).toBeCloseTo(6.5);
  //     expect(mScale7FromPAbs(1)).toBeCloseTo(7.5);
  //   });

  //   test("should return correct values for any M-Scale 7 outputs", () => {
  //     expect(mScale7FromPAbs(0.005 / 100)).toBeCloseTo(0.25);
  //     expect(mScale7FromPAbs((10 - 0.1) / 2 / 100)).toBeCloseTo(1, 1);
  //     expect(mScale7FromPAbs(0.175)).toBeCloseTo(2);
  //     expect(mScale7FromPAbs(0.325)).toBeCloseTo(3);
  //     expect(mScale7FromPAbs(0.475)).toBeCloseTo(4);
  //     expect(mScale7FromPAbs(0.65)).toBeCloseTo(5);
  //     expect(mScale7FromPAbs(0.8251)).toBeCloseTo(6);
  //     expect(mScale7FromPAbs(0.95)).toBeCloseTo(7);
  //   });

  //   test("other inputs", () => {
  //     expect(mScale7FromPAbs(pAbsFromMScale3(0))).toBeCloseTo(0, 5);
  //     expect(mScale3FromPAbs(pAbsFromMScale7(0))).toBeCloseTo(0, 5);
  //   });
  // });

  // describe("Round-trip conversions", () => {
  //   test("3 -> 7 -> 3 should be identity", () => {
  //     const testValues = [0, 1, 2, 3, 2.5, 1.43];
  //     testValues.forEach((mScale3) => {
  //       expect(MScale7to3(MScale3to7(mScale3))).toBeCloseTo(mScale3, 3);
  //     });
  //   });
  //   test("7 -> 3 -> 7 should be identity", () => {
  //     const testValues = [0, 1, 2, 3, 4, 5, 6, 2.5, 1.2, 0.8, 3.33];
  //     testValues.forEach((mScale7) => {
  //       expect(MScale3to7(MScale7to3(mScale7))).toBeCloseTo(mScale7, 3);
  //     });
  //   });
  // });
});
