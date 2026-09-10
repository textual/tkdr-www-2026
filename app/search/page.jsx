import React, { Suspense } from "react";

import SearchPage from "./SearchPage";

const SearchPageServer = () => {
  return (
    <div>
      <Suspense fallback={<div style={{ padding: 32 }}>Searching…</div>}>
        <SearchPage />
      </Suspense>
    </div>
  );
};

export default SearchPageServer;
