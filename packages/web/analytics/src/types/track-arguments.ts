/** The arguments of `track` after the name: the payload, or nothing for an event mapped to `undefined`. */
export type TrackArguments<TData> = [TData] extends [undefined]
  ? []
  : [data: TData];
