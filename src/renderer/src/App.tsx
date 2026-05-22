import {AppConfig} from "@renderer/config/index";
import React, {useEffect} from "react";
import {Outlet} from "react-router";

function App(): React.JSX.Element {
  useEffect(() => {
    document.title = AppConfig.app.name
  }, [])

  return <Outlet />
}

export default App
