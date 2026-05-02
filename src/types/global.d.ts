/* eslint-disable @typescript-eslint/no-empty-object-type */
import React from "react";

declare global {
  namespace JSX {
    interface Element extends React.JSX.Element {
      // Re-exporting for global availability
    }
    interface IntrinsicElements extends React.JSX.IntrinsicElements {
      // Re-exporting for global availability
    }
  }
}
