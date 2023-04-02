import { BigNumber } from '@ethersproject/bignumber';
import { formatEther } from '@ethersproject/units';

export const bigIntegerToFixed = (bn: BigNumber, decimals: number): string => {
  let res = formatEther(bn);
  res = (+res).toFixed(decimals);
  return res;
};


// Captures 0x + 4 characters, then the last 4 characters.
const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;
/**
 * Truncates an ethereum address to the format 0x0000…0000
 * @param address Full address to truncate
 * @returns Truncated address
 * from https://github.com/gpxl-dev/truncate-eth-address/blob/main/src/index.ts
 */
export const truncateEthAddress = (address: string) => {


  const match = address.match(truncateRegex);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};