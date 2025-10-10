import { prettyRound } from "./roundNumberString";

describe.only("Pretty Round", () => {
  test("Should give nice numbers", () => {
    expect(prettyRound(1)).toBe("1");
    expect(prettyRound(3)).toBe("3");
    expect(prettyRound(6)).toBe("5");
    expect(prettyRound(8)).toBe("10");
    expect(prettyRound(34)).toBe("25");
    expect(prettyRound(41)).toBe("50");
    expect(prettyRound(160)).toBe("150");
    expect(prettyRound(234)).toBe("250");
    expect(prettyRound(444)).toBe("500");
    expect(prettyRound(1000)).toBe("1 000");
    expect(prettyRound(1596)).toBe("1 500");
    expect(prettyRound(10884)).toBe("10 000");
  });
});
