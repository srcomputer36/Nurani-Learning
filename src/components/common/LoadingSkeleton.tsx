/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const LoadingSkeleton = () => {
  return (
    <div className="px-6 py-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 6].map((i) => (
          <div key={i} className="bg-white rounded-3xl border border-gray-100 p-2 animate-pulse">
            <div className="aspect-[3/4] bg-gray-100 rounded-2xl mb-4" />
            <div className="px-2 pb-2">
              <div className="h-2 w-1/3 bg-gray-100 rounded mb-2" />
              <div className="h-4 w-full bg-gray-100 rounded mb-1" />
              <div className="h-4 w-2/3 bg-gray-100 rounded mb-4" />
              <div className="h-10 w-full bg-gray-100 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
