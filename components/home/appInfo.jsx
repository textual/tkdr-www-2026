"use client";

import { useAppInfoContext } from "@/lib/contexts/AppInfoContext";

import React from "react";

const AppInfoComponent = () => {
  const { isLoading, isRetrying, appInfo } = useAppInfoContext();
  if (isLoading || isRetrying) {
    return <div>Loading app info...</div>;
  }
  const valueObjs = ["IMAGE_SERVER", "ipLocation", "minAppVersion"];

  return (
    <div>
      <div>AppInfoComponent</div>
      {Object.entries(appInfo).map(([key, value]) => (
        <div key={key}>
          {valueObjs.includes(key) ? (
            <div className="border border-red-500 p-6 rounded-lg">
              <div className="text-red-500">{key}</div>
              <table>
                <tbody>
                  {Object.entries(value).map(([key, value]) => (
                    <tr key={key}>
                      <td>
                        <span className="text-accent-foreground">{key} :</span>
                      </td>
                      <td>{key === "api_secret" ? "********" : value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              {key}: {JSON.stringify(value)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AppInfoComponent;
