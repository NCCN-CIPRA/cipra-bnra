import { useContext, useEffect } from "react";
import AppContext from "../functions/AppContext";

export default function useBottomBarHeight(bottomBarHeight: number) {
  const { setBottomBarHeight } = useContext(AppContext);

  useEffect(() => setBottomBarHeight(bottomBarHeight), [bottomBarHeight]);
}
