export enum LogLevel {
  None = 0,
  Error = 1 >> 0,    // 0001 -- the bitshift is unnecessary, but done for consistency
  Info = 1 << 1,   // 0010
  Verbose = 1 << 2, // 0100
  Debug = 1 << 4    // 1000
}
