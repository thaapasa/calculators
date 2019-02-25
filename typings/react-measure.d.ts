declare module 'react-measure' {
    import * as React from "react";
    export interface ContentRect {
        bounds: {
            width: number;
            height: number;
        }
    }
    export default class Measure extends React.Component<{
        onResize: (x: ContentRect) => void
    }, {}> {}
}
