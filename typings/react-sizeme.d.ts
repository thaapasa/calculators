declare module 'react-sizeme' {
  import * as React from 'react';
  type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

  export interface Size {
    width: number;
    height: number;
  }
  export interface WithSizeConfig {
    monitorHeight?: boolean;
    monitorWidth?: boolean;
  }
  type WithSize<P> = P & { size: Size };
  export function withSize(
    cfg?: WithSizeConfig,
  ): <P>(
    r: React.ComponentType<WithSize<P>>,
  ) => React.ComponentType<Omit<P, 'size'> & { onSize?: (size: Size) => void }>;
}
